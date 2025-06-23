document.addEventListener('DOMContentLoaded', () => {
    fetch('/user')
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                document.getElementById('username').textContent = data.username;
            }
        });

    document.getElementById('logout-btn').addEventListener('click', () => {
        // For now, just redirect to the login page
        window.location.href = 'index.html';
    });

    document.getElementById('payroll-item').addEventListener('click', () => {
        alert('This feature is coming soon!');
    });
});