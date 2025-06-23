document.addEventListener('DOMContentLoaded', function () {
    // Mock data - in a real application, this would come from a server
    const metrics = {
        aht: 272, // in seconds
        csat: 92, // percentage
        fcr: 85, // percentage
        callsAnswered: 128
    };

    const targets = {
        aht: 300, // seconds (lower is better)
        csat: 90, // percentage
        fcr: 80, // percentage
        callsAnswered: 100
    };

    function calculateAttainment() {
        const ahtValue = parseFloat(document.getElementById('aht-value').textContent.split(':').reduce((acc, time) => 60 * acc + +time));
        const csatValue = parseFloat(document.getElementById('csat-value').textContent);
        const fcrValue = parseFloat(document.getElementById('fcr-value').textContent);
        const callsAnsweredValue = parseFloat(document.getElementById('calls-answered-value').textContent);

        // Attainment calculation (simplified)
        const ahtAttainment = (targets.aht / ahtValue) * 100;
        const csatAttainment = (csatValue / targets.csat) * 100;
        const fcrAttainment = (fcrValue / targets.fcr) * 100;
        const callsAnsweredAttainment = (callsAnsweredValue / targets.callsAnswered) * 100;

        const totalAttainment = (ahtAttainment + csatAttainment + fcrAttainment + callsAnsweredAttainment) / 4;

        document.getElementById('total-attainment').textContent = `${totalAttainment.toFixed(2)}%`;

        // Bonus calculation (simplified)
        let bonus = 0;
        if (totalAttainment >= 100) {
            bonus = (totalAttainment - 100) * 10 + 200; // Base bonus + performance incentive
        } else if (totalAttainment >= 95) {
            bonus = 150;
        } else if (totalAttainment >= 90) {
            bonus = 100;
        }

        document.getElementById('estimated-bonus').textContent = `$${bonus.toFixed(2)}`;
    }

    calculateAttainment();


    const ctx = document.getElementById('performanceChart').getContext('2d');
    const performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'Overall Performance',
                data: [95, 92, 98, 102, 99, 105, 101],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
});