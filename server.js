const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'samoth',
    database: 'my_boats'
});

db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

app.post('/add', (req, res) => {
    const { name, model } = req.body;
    const sql = 'INSERT INTO boat (name, model) VALUES (?, ?)';
    db.query(sql, [name, model], (err, result) => {
        if (err) {
            res.status(500).send('Erreur serveur');
        } else {
            res.status(201).send({ message: 'Bateau ajouté', id: result.insertId });
        }
    });
});

app.get('/records', (req, res) => {
    const sql = 'SELECT * FROM boat';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send('Erreur serveur');
        } else {
            res.json(results);
        }
    });
});

app.get('/record/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM boat WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send('Erreur serveur');
        } else if (result.length === 0) {
            res.status(404).send('Bateau non trouvé');
        } else {
            res.json(result[0]);
        }
    });
});

app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, model } = req.body;
    const sql = 'UPDATE boat SET name = ?, model = ? WHERE id = ?';
    db.query(sql, [name, model, id], (err, result) => {
        if (err) {
            res.status(500).send('Erreur serveur');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Bateau non trouvé');
        } else {
            res.send({ message: 'Bateau mis à jour' });
        }
    });
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM boat WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send('Erreur serveur');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Bateau non trouvé');
        } else {
            res.send({ message: 'Bateau supprimé' });
        }
    });
});

app.listen(port, () => {
    console.log(`Serveur Express en cours d'exécution sur http://localhost:${port}`);
});
