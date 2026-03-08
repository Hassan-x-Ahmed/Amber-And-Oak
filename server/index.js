const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const nodemailer = require('nodemailer');

// Middleware
app.use(cors()); 
app.use(express.json()); 

// ==========================================
// 1. CREATE RESERVATION ENDPOINT
// ==========================================
app.post('/api/reservations', async (req, res) => {
  const { fullName, email, phone, guests, date, time, requests } = req.body;

  if (!fullName || !email || !phone || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();
  const MAX_CAPACITY_PER_SLOT = 20; 

  try {
    await client.query('BEGIN');

    // AVAILABILITY CHECK
    // 🌟 THE AVAILABILITY CHECK: Ignore cancelled reservations!
    const capacityQuery = `
      SELECT COALESCE(SUM(guest_count::integer), 0) as total_booked
      FROM reservations
      WHERE reservation_date = $1 AND reservation_time = $2 AND status != 'cancelled';
    `;
    const capacityResult = await client.query(capacityQuery, [date, time]);
    const currentlyBooked = parseInt(capacityResult.rows[0].total_booked);
    const requestedGuests = parseInt(guests);

    if (currentlyBooked + requestedGuests > MAX_CAPACITY_PER_SLOT) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: `Sorry, we only have space for ${MAX_CAPACITY_PER_SLOT - currentlyBooked} more guests at ${time}. Please select another time.` 
      });
    }

    // Insert or update customer
    const customerQuery = `
      INSERT INTO customers (full_name, email, phone)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) 
      DO UPDATE SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone
      RETURNING id;
    `;
    const customerResult = await client.query(customerQuery, [fullName, email, phone]);
    const customerId = customerResult.rows[0].id;

    // 🌟 GENERATE A FRIENDLY 6-DIGIT TOKEN
    const shortToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Insert reservation
    const reservationQuery = `
      INSERT INTO reservations (customer_id, reservation_date, reservation_time, guest_count, special_requests, short_token)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const reservationResult = await client.query(reservationQuery, [customerId, date, time, requestedGuests, requests, shortToken]);
    
    await client.query('COMMIT');

    // ==========================================
    // 🌟 THE AUTOMATED EMAIL ENGINE
    // ==========================================
    try {
      // Grab the friendly token from the database result
      const finalToken = reservationResult.rows[0].short_token;

      if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'placeholder@gmail.com') {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const mailOptions = {
            from: `"Amber & Oak" <${process.env.EMAIL_USER}>`,
            to: email, 
            subject: 'Your Reservation is Confirmed - Amber & Oak',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 8px; color: #1c1917;">
                <h2 style="color: #432818; font-family: Georgia, serif; font-size: 28px; margin-bottom: 10px;">Table Confirmed!</h2>
                <p style="font-size: 16px; line-height: 1.6;">Dear ${fullName.split(' ')[0]},</p>
                <p style="font-size: 16px; line-height: 1.6;">Your table for <strong>${requestedGuests}</strong> on <strong>${date}</strong> at <strong>${time}</strong> is officially secured.</p>
                
                <div style="background-color: #fafaf9; padding: 20px; border-left: 4px solid #ea580c; margin: 30px 0;">
                  <p style="margin: 0; font-size: 12px; letter-spacing: 2px; color: #78716c;">YOUR PRE-ORDER ID</p>
                  <h3 style="margin: 5px 0 0 0; color: #ea580c; font-size: 32px; font-family: monospace;">${finalToken}</h3>
                </div>
                
                <p style="font-size: 14px; color: #57534e; line-height: 1.6;">Return to our website and click "Order for Table" using your ID above to pre-order your courses.</p>
              </div>
            `
          };

          transporter.sendMail(mailOptions)
            .then(() => console.log(`[SUCCESS] Email receipt sent to ${email}`))
            .catch(err => console.error("[ERROR] Email failed to send:", err));
            
      } else {
          console.log(`[DEV MODE] Email skipped. Receipt for ${email} generated with TOKEN: ${finalToken}`);
      }
    } catch (emailError) {
      console.error("Nodemailer setup error:", emailError);
    }
    // ==========================================

    res.status(201).json({ 
      message: 'Reservation successfully created',
      reservation: reservationResult.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Reservation Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// ==========================================
// 2. GET ALL RESERVATIONS (Admin Dashboard)
// ==========================================
app.get('/api/reservations', async (req, res) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT 
        r.id, 
        c.full_name, 
        c.email, 
        c.phone, 
        r.reservation_date, 
        r.reservation_time, 
        r.guest_count, 
        r.status,
        r.short_token
      FROM reservations r
      JOIN customers c ON r.customer_id = c.id
      ORDER BY r.reservation_date ASC, r.reservation_time ASC;
    `;
    
    const result = await client.query(query);
    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  } finally {
    client.release();
  }
});

// ==========================================
// 3. VERIFY TOKEN (Pre-Order Verification)
// ==========================================
app.get('/api/reservations/:token', async (req, res) => {
  const { token } = req.params; 
  const client = await pool.connect();

  try {
    const query = `
      SELECT 
        r.id, 
        c.full_name AS "fullName", 
        r.reservation_date AS "date", 
        r.guest_count AS "guests",
        r.short_token
      FROM reservations r
      JOIN customers c ON r.customer_id = c.id
      WHERE r.short_token = $1;
    `;
    
    const result = await client.query(query, [token]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error verifying reservation:', error);
    res.status(500).json({ error: 'Failed to verify reservation' });
  } finally {
    client.release();
  }
});

// ==========================================
// 4. UPDATE STATUS (Admin Dashboard)
// ==========================================
app.patch('/api/reservations/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 
  const client = await pool.connect();

  try {
    const query = `
      UPDATE reservations 
      SET status = $1 
      WHERE id = $2 
      RETURNING *;
    `;
    
    const result = await client.query(query, [status, id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update reservation' });
  } finally {
    client.release();
  }
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});