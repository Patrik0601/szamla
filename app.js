import express from 'express'
import cors from 'cors'
import { getAllBills, getBillById, creatBill, updateBill, deleteBill, getAllBuyers, getAllSellers } from './util/database.js';


const app = express();

app.use(cors());
app.use(express.json());


app.get('/bills', (req, res) => {
   try {
    const posts = getAllBills();
    res.json(posts);
  } catch (err) {
    console.error('GET /bills hiba:', err);
    res.status(500).json({ error: 'Nem sikerült lekérni a számlákat.' });
  }
});

app.get("/bills/:id", (req, res) => {
    try {
        const post = getBillById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Bill not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});


app.post('/bills', (req, res) => {
  try {
    const { buyer_id, seller_id, billNumber, created_at, payed_at, deadline_at, totalAmount, vat } = req.body;
    if (!buyer_id || !seller_id || !billNumber || !created_at || !payed_at || !deadline_at || !totalAmount || !vat) {
      return res.status(400).json({ error: 'Hiányzó mezők a kérésben.' });
    }
    const result = creatBill(buyer_id, seller_id, billNumber, created_at, payed_at, deadline_at, totalAmount, vat);
    res.status(201).json({ message: 'Számla létrehozva.', id: result.lastInsertRowid });
  } catch (err) {
    console.error('POST /bills hiba:', err);
    res.status(500).json({ error: 'Nem sikerült létrehozni a számlát.' });
  }
});

app.put('/bills/:id', (req, res) => {
  try {
    const id = req.params.id;
    const { buyer_id, seller_id, billNumber, created_at, payed_at, deadline_at, totalAmount, vat } = req.body;
    if (!buyer_id || !seller_id || !billNumber || !created_at || !payed_at || !deadline_at || !totalAmount || !vat) {
      return res.status(400).json({ error: 'Hiányzó mezők a kérésben.' });
    }
    const result = updateBill(id, buyer_id, seller_id, billNumber, created_at, payed_at, deadline_at, totalAmount, vat);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Nem található a számla.' });
    }
    res.json({ message: 'Számla frissítve.' });
  } catch (err) {
    console.error('PUT /bills/:id hiba:', err);
    res.status(500).json({ error: 'Nem sikerült frissíteni a számlát.' });
  }
});

app.delete('/bills/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = deleteBill(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Nem található a számla.' });
    }
    res.json({ message: 'Számla törölve.' });
  } catch (err) {
    console.error('DELETE /bills/:id hiba:', err);
    res.status(500).json({ error: 'Nem sikerült törölni a számlát.' });
  }
});

app.get('/buyers', (req, res) => {
  try {
    const buyers = getAllBuyers();
    res.json(buyers);
  } catch (err) {
    console.error('GET /buyers hiba:', err);
    res.status(500).json({ error: 'Nem sikerült lekérni a vevőket.' });
  }
});

app.get('/sellers', (req, res) => {
  try {
    const sellers = getAllSellers();
    res.json(sellers);
  } catch (err) {
    console.error('GET /sellers hiba:', err);
    res.status(500).json({ error: 'Nem sikerült lekérni az eladókat.' });
  }
});



const PORT = 8080
app.listen(PORT, () => {
  console.log(`Server runs on port: ${PORT}`);
});
