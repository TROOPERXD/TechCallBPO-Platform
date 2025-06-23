document.addEventListener('DOMContentLoaded', () => {
    const monthYearElement = document.getElementById('month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const shiftInfoElement = document.getElementById('shift-info');

    let currentDate = new Date();

    // Mock data for assigned shifts (replace with actual data from backend)
    const assignedShifts = {
        '2024-07-15': 'Morning Shift: 8:00 AM - 4:00 PM',
        '2024-07-18': 'Night Shift: 10:00 PM - 6:00 AM',
        '2024-07-22': 'Afternoon Shift: 2:00 PM - 10:00 PM',
        '2024-08-05': 'Morning Shift: 8:00 AM - 4:00 PM',
    };

    function renderCalendar() {
        calendarGrid.innerHTML = '';
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        monthYearElement.textContent = `${currentDate.toLocaleString('en-US', { month: 'long' })} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add day names
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayNameCell = document.createElement('div');
            dayNameCell.classList.add('calendar-day', 'day-name');
            dayNameCell.textContent = day;
            calendarGrid.appendChild(dayNameCell);
        });

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            dayCell.textContent = day;

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (assignedShifts[dateStr]) {
                dayCell.classList.add('assigned-shift');
                dayCell.addEventListener('click', () => {
                    shiftInfoElement.textContent = assignedShifts[dateStr];
                });
            } else {
                dayCell.addEventListener('click', () => {
                    shiftInfoElement.textContent = 'No shift assigned for this day.';
                });
            }

            calendarGrid.appendChild(dayCell);
        }
    }

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
});