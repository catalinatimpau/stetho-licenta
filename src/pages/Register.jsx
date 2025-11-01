import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('doctor');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username: username.trim(),
      passwordHash: password.trim(),
      role: role.trim()
    };

    try {
      const response = await axios.post('https://localhost:7274/api/Auth/register', data);
      console.log('REGISTER OK:', response.data);
      setMessage('Înregistrare reușită!');
      setError('');

      const newUser = { username, role };
      localStorage.setItem('user', JSON.stringify(newUser)); 
      navigate('/'); 
    } catch (err) {
      console.error('REGISTER ERROR:', err);
      setMessage('');
      setError(err.response?.data || 'Eroare necunoscută la înregistrare.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundImage: 'url(/fundal1.png)', 
      backgroundSize: 'cover' 
    }}>
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        padding: '40px', 
        borderRadius: '10px', 
        boxShadow: '0 0 10px rgba(0,0,0,0.3)' 
      }}>
        <h2 style={{ textAlign: 'center' }}>Înregistrare</h2>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}

        <div style={{ marginBottom: '15px' }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Parola:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Rol:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="pacient">Pacient</option>
          </select>
        </div>

        <button type="submit" style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#3182ce', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}>
          Înregistrează-te
        </button>
      </form>
    </div>
  );
}

export default Register;
