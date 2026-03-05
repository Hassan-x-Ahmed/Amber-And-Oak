document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservation-form');
  const messageBox = document.getElementById('reservation-message');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Change button state
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Processing...';
    submitBtn.disabled = true;

    // 2. Gather data
    const formData = new FormData(form);
    const reservationData = Object.fromEntries(formData.entries());

    try {
      // 3. Send real POST request to our Express backend
   // It must look EXACTLY like this:
const response = await fetch('http://localhost:8080/api/reservations', {
  method: 'POST',
  
  headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to make reservation');
      }

      // 4. Handle Success
      form.classList.add('hidden');
      messageBox.innerHTML = `
        <h3 class="font-serif text-2xl mb-2 text-brand-brown">Thank you, ${reservationData.fullName}!</h3>
        <p>Your request for a table for ${reservationData.guests} on ${reservationData.date} has been confirmed. We look forward to hosting you.</p>
      `;
      messageBox.classList.remove('hidden');

    } catch (error) {
      // 5. Handle Errors (e.g., booking in the past)
      alert(`Error: ${error.message}`);
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  });
});