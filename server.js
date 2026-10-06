import express from 'express';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/diakok', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM diakok');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ hiba: "Adatbázis hiba történt!" });
  }
});

app.post('/api/diakok', async (req, res) => {
  const { nev, szak } = req.body;
  if (!nev || !szak) {
    return res.status(400).json({ hiba: "A név és a szak megadása kötelező!" });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO diakok (nev, szak) VALUES (?, ?)',
      [nev, szak]
    );
    res.status(201).json({ id: result.insertId, nev, szak });
  } catch (error) {
    res.status(500).json({ hiba: "Adatbázis hiba történt!" });
  }
});

app.put('/api/diakok/:id', async (req, res) => {
  const { id } = req.params;
  const { nev, szak } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE diakok SET nev = ?, szak = ? WHERE id = ?',
      [nev, szak, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ hiba: "A keresett diák nem található!" });
    }

    res.status(200).json({ id: Number(id), nev, szak });
  } catch (error) {
    res.status(500).json({ hiba: "Adatbázis hiba történt!" });
  }
});

app.delete('/api/diakok/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM diakok WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ hiba: "A törlendő diák nem található!" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ hiba: "Adatbázis hiba történt!" });
  }
});

app.listen(PORT, () => {
  console.log(`A szerver fut a http://localhost:${PORT} címen`);
});
