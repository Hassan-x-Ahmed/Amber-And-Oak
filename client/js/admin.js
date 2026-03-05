document.addEventListener('DOMContentLoaded', fetchReservations);

async function fetchReservations() {
    const tableBody = document.getElementById('reservations-table-body');

    try {
        const response = await fetch('http://localhost:8080/api/reservations');
        if (!response.ok) throw new Error('Failed to fetch data');
        const reservations = await response.json();

        tableBody.innerHTML = '';

        if (reservations.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-stone-500">No reservations found.</td></tr>`;
            return;
        }

        reservations.forEach(res => {
            const dateObj = new Date(res.reservation_date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

            // Dynamic colors for the status badge
            let badgeColor = 'bg-yellow-100 text-yellow-800';
            if (res.status === 'confirmed') badgeColor = 'bg-green-100 text-green-800';
            if (res.status === 'cancelled') badgeColor = 'bg-red-100 text-red-800';

            const row = document.createElement('tr');
            row.className = "hover:bg-stone-50 transition-colors border-b border-stone-200";
            
            row.innerHTML = `
                <td class="p-4 font-medium">${formattedDate}</td>
                <td class="p-4">${res.full_name}</td>
                <td class="p-4">
                    <div class="text-sm">${res.email}</div>
                    <div class="text-sm text-stone-500">${res.phone}</div>
                </td>
                <td class="p-4">${res.guest_count}</td>
                <td class="p-4">
                    <span class="px-3 py-1 text-xs font-semibold rounded-full ${badgeColor} uppercase tracking-wide">
                        ${res.status}
                    </span>
                </td>
                <td class="p-4 text-right space-x-2">
                    ${res.status === 'pending' ? `
                        <button onclick="updateStatus('${res.id}', 'confirmed')" class="px-3 py-1 bg-green-600 text-white text-xs rounded shadow hover:bg-green-700 transition">Confirm</button>
                        <button onclick="updateStatus('${res.id}', 'cancelled')" class="px-3 py-1 bg-red-600 text-white text-xs rounded shadow hover:bg-red-700 transition">Cancel</button>
                    ` : `
                        <span class="text-stone-400 text-sm italic">Resolved</span>
                    `}
                </td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error:", error);
        tableBody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-red-500 font-semibold">Error loading reservations.</td></tr>`;
    }
}

// Make the update function available to our inline HTML buttons
window.updateStatus = async (id, newStatus) => {
    try {
        const response = await fetch(`http://localhost:8080/api/reservations/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            // Refresh the table to show the new colors!
            fetchReservations();
        } else {
            alert('Failed to update status');
        }
    } catch (error) {
        console.error("Error updating:", error);
    }
};