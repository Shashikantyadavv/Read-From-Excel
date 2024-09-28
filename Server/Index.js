const express = require('express');
const connectDB = require('./config');
const bodyParser = require('body-parser');
const cors = require('cors');
const candidateRoutes = require('./routes/candidateRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
connectDB();

app.use('/api/candidates', candidateRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
