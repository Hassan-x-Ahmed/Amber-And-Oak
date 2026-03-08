// Base URL for your Express server
const API_URL = 'http://localhost:8080/api/reservations';

// Fetch reservations when the page loads
document.addEventListener('DOMContentLoaded', fetchReservations);

async function fetchReservations() {
    const tableBody = document.getElementById('reservations-table-body');
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const reservations = await response.json();
        
        // Clear the loading spinner
        tableBody.innerHTML = '';

        if (reservations.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="p-8 text-center text-stone-400 italic">No reservations found.</td>
                </tr>
            `;
            return;
        }

        // Loop through the database records and create HTML rows
        reservations.forEach(res => {
            // Setup dynamic status badge colors
            let statusColor = 'bg-stone-100 text-stone-600'; // Default pending
            if (res.status === 'confirmed') statusColor = 'bg-green-100 text-green-700 border-green-200';
            if (res.status === 'cancelled') statusColor = 'bg-red-100 text-red-700 border-red-200';

            // Ensure we have a token fallback if old data is missing it
            const displayToken = res.short_token || 'N/A';
            const displayTime = res.reservation_time || 'TBD';

            // 🌟 Clean up the ugly database date
            const rawDate = new Date(res.reservation_date);
            const cleanDate = rawDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

            const row = document.createElement('tr');
            row.className = 'hover:bg-stone-50 transition-colors group';
            row.innerHTML = `
                <td class="p-4 font-mono font-bold text-amber-700 text-lg">${displayToken}</td>
                <td class="p-4">
                    <p class="font-bold text-stone-800">${res.full_name}</p>
                    <p class="text-xs text-stone-500">${res.phone} • ${res.email}</p>
                </td>
                <td class="p-4">
                    <p class="font-bold text-stone-800">${cleanDate}</p> <p class="text-xs text-stone-500">${displayTime}</p>
                </td>
                <td class="p-4 font-bold text-stone-600">${res.guest_count} <i class="fa-solid fa-user text-xs text-stone-400 ml-1"></i></td>
                <td class="p-4">
                    <span class="px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${statusColor}">
                        ${res.status || 'Pending'}
                    </span>
                </td>
                <td class="p-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="updateStatus('${res.id}', 'confirmed')" class="w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition shadow-sm" title="Confirm">
                        <i class="fa-solid fa-check"></i>
                    </button>
                    <button onclick="updateStatus('${res.id}', 'cancelled')" class="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm" title="Cancel">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="p-8 text-center text-red-500">Failed to load reservations. Make sure your Express server is running on port 8080!</td>
            </tr>
        `;
    }
}

// Function to handle the Confirm/Cancel buttons
async function updateStatus(id, newStatus) {
    if (!confirm(`Are you sure you want to mark this reservation as ${newStatus}?`)) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Failed to update status');

        // Refresh the table to show the new colored badge!
        fetchReservations();
        
    } catch (error) {
        alert("Error updating status. Please try again.");
        console.error(error);
    }
}