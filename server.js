const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const saltRounds = 10;

const app = express();
const port = 3001;

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Session setup
app.use(session({
    secret: 'your-secret-key', // Replace with a real secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error during password comparison' });
            }
            if (result) {
                req.session.user = { id: user.employee_id, username: user.username };
                res.json({ success: true, redirectUrl: '/dashboard.html' });
            } else {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        });
    });
});

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Not authenticated' });
    }
};

app.get('/user', isAuthenticated, (req, res) => {
    res.json({ success: true, user: req.session.user });
});

app.post('/pqrs', isAuthenticated, (req, res) => {
    const { type, subject, description } = req.body;
    const employee_id = req.session.user.id; // Assuming you store user's employee_id in session

    const sql = `INSERT INTO pqrs (type, subject, description, employee_id) VALUES (?, ?, ?, ?)`;
    db.run(sql, [type, subject, description, employee_id], function(err) {
        if (err) {
            res.status(500).json({ success: false, message: 'Failed to submit PQRS' });
            return;
        }
        res.json({ success: true, message: 'PQRS submitted successfully' });
    });
});

app.get('/api/shifts', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    // In a real application, you would fetch this from a database
    const shifts = [
        { title: 'Morning Shift', start: '2023-10-26T08:00:00', end: '2023-10-26T16:00:00' },
        { title: 'Afternoon Shift', start: '2023-10-27T14:00:00', end: '2023-10-27T22:00:00' },
        { title: 'Night Shift', start: '2023-10-28T22:00:00', end: '2023-10-29T06:00:00' }
    ];

    res.json(shifts);
});

// Logout
app.get('/logout', (req, res) => {
    res.json({ success: true, redirectUrl: '/dashboard.html' });
});

app.post('/register', (req, res) => {
    const { employeeId, username, password } = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
            res.status(500).json({ success: false, message: 'Error hashing password' });
            return;
        }
        const sql = `INSERT INTO users (employee_id, username, password) VALUES (?, ?, ?)`;
        db.run(sql, [employeeId, username, hash], function(err) {
            if (err) {
                res.status(500).json({ success: false, message: 'Username already exists' });
                return;
            }
            res.json({ success: true, id: this.lastID });
        });
    });
});

app.get('/api/payroll', isAuthenticated, (req, res) => {
    const { month } = req.query;
    const employeeId = req.session.user.id;

    // TODO: Replace with actual database query to fetch payroll data
    const mockPayrollData = {
        current: {
            payPeriod: 'June 2024',
            employeeId: employeeId,
            employeeName: 'John Doe',
            designation: 'Support Agent',
            payDate: '2024-06-30',
            paidDays: 30,
            lopDays: 0,
            earnings: {
                'Basic Salary': 3000,
                'HRA': 1200,
                'Performance Bonus': 500
            },
            deductions: {
                'Tax': 400,
                'Provident Fund': 300
            },
            grossEarnings: 4700,
            totalDeductions: 700,
            netPay: 4000
        },
        previous: {
            payPeriod: 'May 2024',
            employeeId: employeeId,
            employeeName: 'John Doe',
            designation: 'Support Agent',
            payDate: '2024-05-31',
            paidDays: 31,
            lopDays: 0,
            earnings: {
                'Basic Salary': 3000,
                'HRA': 1200,
                'Performance Bonus': 450
            },
            deductions: {
                'Tax': 380,
                'Provident Fund': 300
            },
            grossEarnings: 4650,
            totalDeductions: 680,
            netPay: 3970
        }
    };

    res.json(mockPayrollData[month] || mockPayrollData.current);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});