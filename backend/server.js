// server.js - API REST mínima con métricas Prometheus
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const client = require('prom-client');

const app = express();
app.use(cors());
app.use(express.json());

// Prometheus metrics
client.collectDefaultMetrics({ timeout: 5000 });
const httpDuration = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50,100,200,500,1000]
});
app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on('finish', () => end({ method: req.method, route: req.route?.path || req.path, code: res.statusCode }));
  next();
});
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Mongoose model
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  sport: String,
  difficulty: String,
  createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);

// Routes
app.get('/', (req, res) => res.json({ status: 'ok' }));

app.get('/notes', async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

app.post('/notes', async (req, res) => {
  const note = new Note(req.body);
  await note.save();
  res.status(201).json(note);
});

app.get('/notes/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).send();
  res.json(note);
});

app.put('/notes/:id', async (req, res) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(note);
});

app.delete('/notes/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Start
const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URL || 'mongodb://mongo:27017/extremenotes';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log(`API listening on ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
  });

module.exports = app;
