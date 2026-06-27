const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let users = [];
let channels = [];
let invites = [];

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  const exists = users.find(u => u.email === email);
  if (exists) return res.json({ error: 'Email already exists' });
  const user = { id: Date.now(), name, email, password, role: 'member', income: 0 };
  users.push(user);
  res.json({ success: true, user });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.json({ error: 'Invalid credentials' });
  res.json({ success: true, user });
});

app.post('/api/channel', (req, res) => {
  const { name, userId } = req.body;
  const channel = { id: Date.now(), name, userId, income: 0, subscribers: 0 };
  channels.push(channel);
  res.json({ success: true, channel });
});

app.get('/api/channels', (req, res) => {
  res.json(channels);
});

app.post('/api/invite', (req, res) => {
  const { email, channelId } = req.body;
  invites.push({ email, channelId, status: 'pending' });
  res.json({ success: true, message: 'Invite sent!' });
});

app.post('/api/income', (req, res) => {
  const { channelId, amount } = req.body;
  const channel = channels.find(c => c.id == channelId);
  if (channel) channel.income += amount;
  res.json({ success: true, channel });
});

app.listen(PORT, () => {
  console.log('RS Brothers CMS running on http://localhost:3000');
});