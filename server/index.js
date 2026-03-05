const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Reservation Endpoint
app.post('/api/reservations', async (req, res) => {
  const { fullName, email, phone, guests, date, requests } = req.body;

  if (!fullName || !email || !phone || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

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

    // Insert reservation
    const reservationQuery = `
      INSERT INTO reservations (customer_id, reservation_date, guest_count, special_requests)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const reservationResult = await client.query(reservationQuery, [customerId, date, guests, requests]);

    await client.query('COMMIT');

    res.status(201).json({ 
      message: 'Reservation successfully created',
      reservation: reservationResult.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Reservation Error:', error);
    
    if (error.constraint === 'future_reservation') {
      return res.status(400).json({ error: 'Reservations must be made for future dates.' });
    }

    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});
// --- GET ALL RESERVATIONS (For Admin Dashboard) ---
app.get('/api/reservations', async (req, res) => {
  const client = await pool.connect();

  try {
    // We use a JOIN to get the customer's name and email alongside their reservation details
    const query = `
      SELECT 
        r.id, 
        c.full_name, 
        c.email, 
        c.phone, 
        r.reservation_date, 
        r.guest_count, 
        r.status
      FROM reservations r
      JOIN customers c ON r.customer_id = c.id
      ORDER BY r.reservation_date ASC;
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
// --- UPDATE RESERVATION STATUS ---
app.patch('/api/reservations/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'confirmed' or 'cancelled'
  const client = await pool.connect();

  try {
    // This SQL updates the status of the specific reservation ID
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});