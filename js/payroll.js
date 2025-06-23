document.addEventListener('DOMContentLoaded', () => {
    const monthSelector = document.getElementById('month');
    const downloadButton = document.getElementById('download-pdf');
    const payslipContainer = document.getElementById('payslip');

    const fetchPayrollData = async (month) => {
        try {
            const response = await fetch(`/api/payroll?month=${month}`);
            const data = await response.json();
            renderPayslip(data);
        } catch (error) {
            console.error('Error fetching payroll data:', error);
            payslipContainer.innerHTML = '<p>Could not load payroll data.</p>';
        }
    };

    const renderPayslip = (data) => {
        const payslipHTML = `
            <div class="payslip-header">
                <h3>TechCallBPO</h3>
                <p>Payslip for ${data.payPeriod}</p>
            </div>
            <div class="payslip-details">
                <div class="payslip-section">
                    <h3>Employee Details</h3>
                    <table>
                        <tr><th>Employee ID:</th><td>${data.employeeId}</td></tr>
                        <tr><th>Employee Name:</th><td>${data.employeeName}</td></tr>
                        <tr><th>Designation:</th><td>${data.designation}</td></tr>
                    </table>
                </div>
                <div class="payslip-section">
                    <h3>Payment Details</h3>
                    <table>
                        <tr><th>Pay Date:</th><td>${data.payDate}</td></tr>
                        <tr><th>Paid Days:</th><td>${data.paidDays}</td></tr>
                        <tr><th>LOP Days:</th><td>${data.lopDays}</td></tr>
                    </table>
                </div>
            </div>
            <div class="payslip-section">
                <h3>Earnings</h3>
                <table>
                    ${Object.entries(data.earnings).map(([key, value]) => `<tr><th>${key}</th><td>${value.toFixed(2)}</td></tr>`).join('')}
                    <tr><th>Gross Earnings:</th><td>${data.grossEarnings.toFixed(2)}</td></tr>
                </table>
            </div>
            <div class="payslip-section">
                <h3>Deductions</h3>
                <table>
                    ${Object.entries(data.deductions).map(([key, value]) => `<tr><th>${key}</th><td>${value.toFixed(2)}</td></tr>`).join('')}
                    <tr><th>Total Deductions:</th><td>${data.totalDeductions.toFixed(2)}</td></tr>
                </table>
            </div>
            <div class="payslip-footer">
                <h3>Net Pay: ${data.netPay.toFixed(2)}</h3>
            </div>
        `;
        payslipContainer.innerHTML = payslipHTML;
    };

    downloadButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const payslipElement = document.getElementById('payslip');

        // Create watermark elements dynamically
        const textWatermark = document.createElement('div');
        textWatermark.textContent = 'TechCall';
        Object.assign(textWatermark.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-30deg)',
            fontSize: '6em',
            fontWeight: 'bold',
            color: 'rgba(0, 0, 0, 0.05)',
            zIndex: '0',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
        });

        const logoWatermark = document.createElement('div');
        Object.assign(logoWatermark.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200px',
            height: '200px',
            transform: 'translate(-50%, -50%)',
            backgroundImage: `url('../images/default-avatar.svg')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '150px',
            opacity: '0.08',
            zIndex: '0',
            pointerEvents: 'none'
        });

        // Append watermarks before capturing
        payslipElement.appendChild(textWatermark);
        payslipElement.appendChild(logoWatermark);

        html2canvas(payslipElement).then(canvas => {
            // Remove watermarks after capturing
            payslipElement.removeChild(textWatermark);
            payslipElement.removeChild(logoWatermark);

            const imgData = canvas.toDataURL('image/png');
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            doc.save('payslip.pdf');
        });
    });

    // Initial load
    fetchPayrollData('current');
});