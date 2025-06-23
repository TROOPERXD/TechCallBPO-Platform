const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// open the database
let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

const users = [
    { employee_id: 'E001', username: 'admin', password: 'adminpassword', email: 'admin@techcallbpo.com', contact_number: '123-456-7890' },
    { employee_id: 'E002', username: 'user1', password: 'user1password', email: 'user1@techcallbpo.com', contact_number: '098-765-4321' }
];

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS pqrs`, (err) => {
        if(err) return console.error(err.message);
        console.log('"pqrs" table dropped');
    });
    db.run(`DROP TABLE IF EXISTS shift`, (err) => {
        if(err) return console.error(err.message);
        console.log('"shift" table dropped');
    });
    db.run(`DROP TABLE IF EXISTS users`, (err) => {
        if(err) return console.error(err.message);
        console.log('"users" table dropped');
    });

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('"users" table created');

        const stmt = db.prepare("INSERT INTO users (employee_id, username, password) VALUES (?, ?, ?)");
        const promises = users.map(user => {
            return new Promise((resolve, reject) => {
                bcrypt.hash(user.password, saltRounds, (err, hash) => {
                    if(err) reject(err);
                    stmt.run(user.employee_id, user.username, hash, (err) => {
                        if(err) reject(err);
                        resolve();
                    });
                });
            });
        });

        Promise.all(promises)
            .then(() => {
                stmt.finalize();
                console.log('Dummy users inserted');

                db.run(`CREATE TABLE IF NOT EXISTS shift (
                    employee_id TEXT PRIMARY KEY,
                    contact_number TEXT,
                    email TEXT,
                    shift TEXT DEFAULT 'morning01',
                    FOREIGN KEY (employee_id) REFERENCES users (employee_id)
                )`, (err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log('"shift" table created');

                    const shiftStmt = db.prepare("INSERT INTO shift (employee_id, contact_number, email) VALUES (?, ?, ?)");
                    users.forEach(user => {
                        shiftStmt.run(user.employee_id, user.contact_number, user.email, (err) => {
                            if (err) {
                                console.error(err.message);
                            }
                        });
                    });
                    shiftStmt.finalize((err) => {
                        if (err) {
                            console.error(err.message);
                        }
                        console.log('Dummy shift data inserted');

                        db.run(`CREATE TABLE IF NOT EXISTS pqrs (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            type TEXT NOT NULL,
                            subject TEXT NOT NULL,
                            description TEXT NOT NULL,
                            employee_id TEXT NOT NULL,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (employee_id) REFERENCES users (employee_id)
                        )`, (err) => {
                            if (err) {
                                return console.error(err.message);
                            }
                            console.log('"pqrs" table created');

                            db.close((err) => {
                                if (err) {
                                    console.error(err.message);
                                }
                                console.log('Close the database connection.');
                            });
                        });
                    });
                });
            })
            .catch(err => {
                console.error(err.message);
                db.close();
            });
    });
});