import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://localhost:7274/api/Auth/login', {
        id: 0,
        username: username,
        passwordHash: password,
        role: 'admin'
      });

      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/');
      } else {
        setError('Username sau parola incorecte.');
      }
    } catch (err) {
      console.error(err);
      setError('Eroare la conectare. Verifica datele introduse.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundImage: 'url(/fundal1.png)', backgroundSize: 'cover' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '40px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>

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

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;