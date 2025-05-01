const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');


app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === '12345') {
        return res.json({ role: 'admin' });
    } else if (username === 'standard' && password === '12345') {
        return res.json({ role: 'standard' });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});


app.get('/products', (req, res) => {
    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');
        res.json(JSON.parse(data));
    });
});


app.post('/products', (req, res) => {
    const newProduct = req.body;
    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');
        const products = JSON.parse(data);
        products.push(newProduct);
        fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), err => {
            if (err) return res.status(500).send('Error writing to file');
            res.send('Product added');
        });
    });
});

app.put('/products/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const updatedProduct = req.body;

    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');
        const products = JSON.parse(data);
        if (index < 0 || index >= products.length) {
            return res.status(404).send('Product not found');
        }
        products[index] = updatedProduct;
        fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), err => {
            if (err) return res.status(500).send('Error writing to file');
            res.send('Product updated');
        });
    });
});

app.delete('/products/:index', (req, res) => {
    const index = parseInt(req.params.index);

    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');
        const products = JSON.parse(data);
        if (index < 0 || index >= products.length) {
            return res.status(404).send('Product not found');
        }
        products.splice(index, 1);
        fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), err => {
            if (err) return res.status(500).send('Error writing to file');
            res.send('Product deleted');
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});