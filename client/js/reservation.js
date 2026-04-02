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
      const response = await fetch('https://amber-and-oak.onrender.com/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to make reservation');
      }

      // 🌟 GET THE FRIENDLY 6-DIGIT TOKEN FROM THE BACKEND
      const reservationId = result.reservation.short_token;
      reservationData.id = reservationId;
      // 🌟 NEW: Use sessionStorage! It automatically clears when they close the browser tab.
      sessionStorage.setItem('amberOakReservation', JSON.stringify(reservationData));

      form.classList.add('hidden');
      messageBox.className = "mt-8"; 
      
      messageBox.innerHTML = `
        <div class="text-center animate-fade-in p-2">
            <h3 class="font-serif text-3xl mb-2 text-brand-brown tracking-tight">Table Confirmed!</h3>
            <p class="text-brand-charcoal/80 italic mb-4">Your table for ${reservationData.guests} on ${reservationData.date} is secured.</p>
            
            <div class="inline-block bg-brand-cream/50 border border-brand-brown/20 px-6 py-3 rounded-sm mb-8">
                <span class="text-xs uppercase tracking-widest text-brand-charcoal/70 block mb-1">Your Reservation ID</span>
                <span class="font-mono text-xl font-bold text-brand-orange">${reservationId}</span>
            </div>
            
            <div class="p-6 bg-white border border-brand-brown/10 rounded-sm shadow-sm">
                <h4 class="font-serif text-xl text-brand-brown mb-2">Enhance Your Experience</h4>
                <p class="text-sm text-brand-charcoal/70 mb-6">Skip the wait by pre-ordering your courses now.</p>
                <a href="/menu.html" class="inline-block bg-brand-orange text-white px-8 py-3 rounded-sm text-xs font-bold tracking-widest uppercase hover:bg-[#a64b24] transition-colors shadow-md">
                    Pre-Order to Table &rarr;
                </a>
            </div>
        </div>
      `;
      messageBox.classList.remove('hidden');

    }catch (error) {
      // 5. Handle Errors
      alert(`Error: ${error.message}`);
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  });
});