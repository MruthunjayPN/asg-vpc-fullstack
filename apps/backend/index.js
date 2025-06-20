import express from "express";
import cors from "cors";
import os from "os"
import axios from "axios"

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.get('/health', (req, res) => res.send('OK'));
app.get('/users', (req, res) => res.json([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]));
app.get('/stats', (req, res) => res.json({ uptime: process.uptime(), usersOnline: 17 }));

app.get('/ip', (req, res) => {
  const interfaces = os.networkInterfaces();
  const privateIP = interfaces.eth0?.[0]?.address || 'Unknown';
  res.json({ privateIP });
});

app.get('/meta', async (req, res) => {
  try {
    const [instanceId, az, instanceType] = await Promise.all([
      axios.get('http://169.254.169.254/latest/meta-data/instance-id'),
      axios.get('http://169.254.169.254/latest/meta-data/placement/availability-zone'),
      axios.get('http://169.254.169.254/latest/meta-data/instance-type'),
    ]);
    res.json({
      instanceId: instanceId.data,
      availabilityZone: az.data,
      instanceType: instanceType.data,
    });
  } catch (err) {
    res.status(500).send('Metadata unavailable');
  }
});

app.listen(port, () => console.log(`Backend running on port ${port}`));
