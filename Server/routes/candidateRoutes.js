const express = require('express');
const { addCandidates } = require('../controllers/candidateController');
const router = express.Router();

router.post('/upload', addCandidates);

module.exports = router;
