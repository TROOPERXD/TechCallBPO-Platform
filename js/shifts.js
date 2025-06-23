document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('shifts-calendar');

    const fetchShifts = async () => {
        try {
            // In a real application, you would fetch this from a server
            // const response = await fetch('/api/shifts');
            // const shifts = await response.json();
            const shifts = [
                { title: 'Morning Shift', start: '2023-10-26T08:00:00', end: '2023-10-26T16:00:00' },
                { title: 'Afternoon Shift', start: '2023-10-27T14:00:00', end: '2023-10-27T22:00:00' },
                { title: 'Night Shift', start: '2023-10-28T22:00:00', end: '2023-10-29T06:00:00' }
            ];
            renderCalendar(shifts);
        } catch (error) {
            console.error('Error fetching shifts:', error);
            calendarEl.innerHTML = '<p>Could not load shifts.</p>';
        }
    };

    const renderCalendar = (shifts) => {
        // This is a placeholder for a real calendar implementation
        let calendarHTML = '<ul>';
        for (const shift of shifts) {
            calendarHTML += `<li>${shift.title}: ${new Date(shift.start).toLocaleString()} to ${new Date(shift.end).toLocaleString()}</li>`;
        }
        calendarHTML += '</ul>';
        calendarEl.innerHTML = calendarHTML;
    };

    fetchShifts();
});