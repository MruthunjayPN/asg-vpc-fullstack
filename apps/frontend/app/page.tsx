import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [frontendIP, setFrontendIP] = useState('');
  const [backendIP, setBackendIP] = useState('');
  const [backendMeta, setBackendMeta] = useState({ instanceId: '', availabilityZone: '', instanceType: '' });

  useEffect(() => {
    // Public IP of frontend
    axios.get('https://api.ipify.org?format=json')
      .then(res => setFrontendIP(res.data.ip));

    // Backend IP and metadata
    axios.get('http://<BACKEND-ALB-DNS>/ip')
      .then(res => setBackendIP(res.data.privateIP));

    axios.get('http://<BACKEND-ALB-DNS>/meta')
      .then(res => setBackendMeta(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Next.js Frontend</h1>
      <p><strong>Frontend EC2 Public IP:</strong> {frontendIP}</p>
      <p><strong>Backend EC2 Private IP:</strong> {backendIP}</p>

      <h3>Backend EC2 Metadata</h3>
      <ul>
        <li><strong>Instance ID:</strong> {backendMeta.instanceId}</li>
        <li><strong>AZ:</strong> {backendMeta.availabilityZone}</li>
        <li><strong>Instance Type:</strong> {backendMeta.instanceType}</li>
      </ul>
    </div>
  );
}
