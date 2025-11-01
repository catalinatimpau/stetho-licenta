import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AddPatientForm() {
  const [user, setUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    sex: '',
    age: '',
    weight: '',
    height: '',
    diagnosis: '',
    username: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.role !== 'admin') {
        navigate('/');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      username: generatePatientCode(),
    }));
  }, []);

  const generatePatientCode = () => {
    return 'PAT' + Math.floor(100000 + Math.random() * 900000);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const patientData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      sex: formData.sex,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      diagnosis: formData.diagnosis || "necunoscut",
      username: formData.username
    };

    try {
      
      const response = await fetch('https://localhost:7274/api/Patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
      });

      if (response.ok) {
        alert(`Pacient adăugat cu succes! Cod pacient: ${patientData.username} | Parola: 1234`);

        
        const patientsFromLocalStorage = JSON.parse(localStorage.getItem('patients')) || [];
        patientsFromLocalStorage.push({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username
        });

        localStorage.setItem('patients', JSON.stringify(patientsFromLocalStorage));

        setFormData({
          firstName: '',
          lastName: '',
          sex: '',
          age: '',
          weight: '',
          height: '',
          diagnosis: '',
          username: generatePatientCode()
        });
      } else {
        alert('Eroare la adăugare pacient!');
      }
    } catch (error) {
      console.error('Eroare:', error);
      alert('Eroare la conectare cu serverul!');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      
      <div style={styles.navbar}>
        <div style={styles.leftSide}>
          <button style={styles.menuButton} onClick={() => setShowSidebar(!showSidebar)}>
            ☰ Meniu
          </button>
          <span style={styles.title}>StethoNet</span>
        </div>
        <div style={styles.rightSide}>
          {user && (
            <>
              <span style={{ color: '#2b6cb0', fontWeight: 'bold' }}>{user.username} ({user.role})</span>
              <button onClick={handleLogout} style={{ ...styles.link, background: 'none', border: 'none', cursor: 'pointer' }}>
                Deconectează-te
              </button>
            </>
          )}
        </div>
      </div>

      
      {showSidebar && (
        <div style={styles.sidebar}>
          <Link to="/" style={styles.sidebarLink}>Acasă</Link>
          <Link to="/pacienti" style={styles.sidebarLink}>Pacienți</Link>
          <Link to="/info" style={styles.sidebarLink}>Informații</Link>
        </div>
      )}

      
      <div style={styles.container}>
        <h2 style={styles.heading}>Adaugă un pacient nou</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="Prenume"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Nume"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <select name="sex" value={formData.sex} onChange={handleChange} required style={styles.input}>
            <option value="">Selectează sex</option>
            <option value="M">Masculin</option>
            <option value="F">Feminin</option>
          </select>
          <input
            type="number"
            name="age"
            placeholder="Vârstă"
            value={formData.age}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="weight"
            placeholder="Greutate (kg)"
            value={formData.weight}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="height"
            placeholder="Înălțime (cm)"
            value={formData.height}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="diagnosis"
            placeholder="Diagnostic (opțional)"
            value={formData.diagnosis}
            onChange={handleChange}
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>Adaugă pacient</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundImage: 'url(\"/fundal1.png\")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    overflow: 'hidden',
    position: 'relative'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottom: '1px solid #ddd',
    position: 'relative',
    zIndex: 10
  },
  leftSide: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2b6cb0'
  },
  menuButton: {
    fontSize: '18px',
    background: '#3182ce',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  rightSide: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  link: {
    color: '#2b6cb0',
    fontWeight: '500',
    textDecoration: 'none',
    fontSize: '16px',
    cursor: 'pointer'
  },
  sidebar: {
    position: 'absolute',
    top: '80px',
    left: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    width: '200px',
    padding: '20px',
    boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
    zIndex: 9
  },
  sidebarLink: {
    display: 'block',
    marginBottom: '12px',
    color: '#2b6cb0',
    fontWeight: '500',
    textDecoration: 'none',
    fontSize: '18px'
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '40px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '800px',
    textAlign: 'center',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
    margin: '30px auto'
  },
  heading: {
    fontSize: '28px',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#2b6cb0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },
  submitButton: {
    padding: '10px 20px',
    fontSize: '18px',
    backgroundColor: '#2b6cb0',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};
 
export default AddPatientForm;
