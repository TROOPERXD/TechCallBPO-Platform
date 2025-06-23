document.addEventListener('DOMContentLoaded', () => {
    const applyButton = document.querySelector('.apply-btn');

    if (applyButton) {
        applyButton.addEventListener('click', () => {
            const whyYou = prompt('Why are you the best candidate for this position?');
            const experience = prompt('Describe your relevant experience.');
            const cv = confirm('Do you want to upload your CV?');

            if (whyYou && experience && cv) {
                alert('Thank you for your application! We will review it and get back to you soon.');
            } else {
                alert('Application cancelled.');
            }
        });
    }
});