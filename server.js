const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

const filterPresetsFilePath = path.join(__dirname, 'filterPresets.json');

// Read filter presets
app.get('/api/filter-presets', (req, res) => {
    fs.readFile(filterPresetsFilePath, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }
        res.json(JSON.parse(data));
    });
});

// Save filter presets
app.post('/api/filter-presets', (req, res) => {
    const filterPresets = req.body;
    fs.writeFile(filterPresetsFilePath, JSON.stringify(filterPresets, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error writing file' });
        }
        res.json({ message: 'Filter presets saved' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
