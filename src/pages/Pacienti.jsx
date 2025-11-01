import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Pacienti() {
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [localPatients, setLocalPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userParsed = JSON.parse(savedUser);
      setUser(userParsed);
    }
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      if (user.role === 'doctor' || user.role === 'admin') {
        const response = await fetch('https://localhost:7274/api/Patients');
        const data = await response.json();
        setPatients(data);
      } else if (user.role === 'pacient') {
        const response = await fetch(`https://localhost:7274/api/Patients/${user.username}`);
        const baseData = await response.json();

        const dbResponse = await fetch(`https://localhost:7274/api/Patients/database`);
        const dbData = await dbResponse.json();

        const match = dbData.find(p => p.username === user.username);

        const combined = match
          ? {
              ...baseData,
              age: match.age,
              sex: match.sex,
              weight: match.weight,
              height: match.height,
              diagnosis: match.diagnosis,
              bmi: match.bmi ?? null,
              number: baseData.number
            }
          : baseData;

        setPatients([combined]);
      }
    } catch (err) {
      console.error('Eroare la încărcarea pacienților:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocalPatients = () => {
    const savedLocalPatients = JSON.parse(localStorage.getItem('patients')) || [];
    setLocalPatients(savedLocalPatients);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (!user) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <h2 style={styles.heading}>Trebuie să fii autentificat!</h2>
          <div style={styles.buttonContainer}>
            <Link to="/login" style={styles.button}>Conectează-te</Link>
            <Link to="/register" style={{ ...styles.button, backgroundColor: '#4a5568' }}>Creează Cont</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.navbar}>
        <div style={styles.leftSide}>
          <button style={styles.menuButton} onClick={() => setShowSidebar(!showSidebar)}>☰ Meniu</button>
          <span style={styles.title}>StethoNet</span>
        </div>
        <div style={styles.rightSide}>
          {user && (
            <>
              <span style={{ color: '#2b6cb0', fontWeight: 'bold' }}>{user.username} ({user.role})</span>
              <button onClick={handleLogout} style={styles.link}>Deconectează-te</button>
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
        {user.role === 'doctor' || user.role === 'admin' ? (
          <>
            <h2 style={styles.heading}>Lista pacienților înregistrați</h2>
            <div style={styles.buttonsContainer}>
              <button style={styles.loadButton} onClick={fetchPatients}>
                {loading ? 'Se încarcă...' : 'Încarcă pacienții existenți'}
              </button>
              <button style={{ ...styles.loadButton, backgroundColor: '#2c5282' }} onClick={fetchLocalPatients}>
                Încarcă pacienții noi
              </button>
            </div>

            <div style={styles.grid}>
              {patients.map((patient, index) => (
                <div key={index} style={styles.card} onClick={() => navigate("/detalii-pacient", { state: { pacient: patient } })}>
                  <div style={styles.icon}>👤</div>
                  <div style={styles.cardText}>
                    {patient.number ? `Pacient ${patient.number}` : 'Pacient'}
                  </div>
                </div>
              ))}
            </div>

            {localPatients.length > 0 && (
              <>
                <h3 style={{ marginTop: '40px', color: '#2b6cb0' }}>Pacienți noi adăugați local:</h3>
                <div style={styles.grid}>
                  {localPatients.map((patient, index) => (
                    <div key={`local-${index}`} style={styles.card} onClick={() => navigate("/detalii-pacient", { state: { pacient: patient } })}>
                      <div style={styles.icon}>🆕</div>
                      <div style={styles.cardText}>
                        {patient.firstName} {patient.lastName}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <h2 style={styles.heading}>Profilul meu</h2>
            <button style={styles.loadButton} onClick={fetchPatients}>
              {loading ? 'Se încarcă...' : 'Încarcă datele mele'}
            </button>

            {patients.length > 0 && (
  <div
    style={styles.profileCard}
    onClick={() => navigate("/detalii-pacient", { state: { pacient: patients[0], role: 'pacient' } })}
  >
    ...
  </div>
)}

          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundImage: 'url("/fundal1.png")',
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
    color: '#2b6cb0',
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
    alignItems: 'center',
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
    zIndex: 9,
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
    maxWidth: '1100px',
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
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px'
  },
  loadButton: {
    padding: '10px 20px',
    backgroundColor: '#3182ce',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 0 8px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    height: '130px'
  },
  icon: {
    fontSize: '36px',
    marginBottom: '8px'
  },
  cardText: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2b6cb0',
    textAlign: 'center'
  },
  profileCard: {
    marginTop: '30px',
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 0 12px rgba(0, 0, 0, 0.1)',
    fontSize: '18px',
    textAlign: 'left',
    lineHeight: '1.7',
    color: '#2d3748'
  }
};

export default Pacienti;
