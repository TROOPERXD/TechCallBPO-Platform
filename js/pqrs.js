document.addEventListener('DOMContentLoaded', () => {
    const pqrForm = document.getElementById('pqr-form');

    pqrForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('/pqrs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Your PQRS has been submitted successfully!');
                window.location.href = '/dashboard.html';
            } else {
                alert('Failed to submit PQRS: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error submitting PQRS:', error);
            alert('An error occurred while submitting your PQRS.');
        });
    });
});