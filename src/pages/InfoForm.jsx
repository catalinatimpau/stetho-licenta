import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';



function InfoForm() {
  const [user, setUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
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
          {!user ? (
            <>
              <Link to="/login" style={styles.link}>Conectează-te</Link>
              <Link to="/register" style={styles.link}>Creează cont</Link>
            </>
          ) : (
            <>
              <span style={{ color: '#2b6cb0', fontWeight: 'bold' }}>
                {user?.username} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                style={{ ...styles.link, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Deconectează-te
              </button>
            </>
          )}
        </div>
      </div>

     
      {showSidebar && (
        <div style={styles.sidebar}>
          <Link to="/" style={styles.sidebarLink}>Acasă</Link>
          <Link to="/login" style={styles.sidebarLink}>Conectează-te</Link>
          <Link to="/register" style={styles.sidebarLink}>Creează cont</Link>
          <Link to="/pacienti" style={styles.sidebarLink}>Pacienți</Link>
          <Link to="/info" style={styles.sidebarLink}>Informații</Link>
        </div>
      )}

      
      <div style={styles.overlay}>
        <h2 style={styles.heading}>Informații & Tutorial</h2>
        <p style={styles.text}><strong>Despre aplicație:</strong> StethoNet este o platformă inteligentă creată pentru a antrena recunoașterea sunetelor pulmonare normale și patologice, utilizând sunete reale și inteligență artificială pentru validare.</p>
        
        <h3 style={styles.subheading}>Tutorial rapid:</h3>
        <ul style={styles.list}>
          <li>⭐ Conectează-te sau creează un cont.</li>
          <li>⭐ Selectează un pacient pentru auscultație.</li>
          <li>⭐ Ascultă și observă sunetul.</li>
          <li>⭐ Alege un diagnostic și verifică cu AI.</li>
          <li>⭐ Acumulează puncte și evoluează!</li>
        </ul>

        <h3 style={styles.subheading}>Info medicale rapide:</h3>
        <ul style={styles.list}>
          <li><strong>Wheezing:</strong> Sunet șuierător emis în timpul respirației, cauzat de obstrucția căilor aeriene.</li>
          <li><strong>Crackles:</strong> Sunete fine, crepitante produse de lichid în alveole.</li>
        </ul>

        <p style={styles.textSmall}><em>* Predicțiile AI sunt orientative și nu substituie diagnosticul medical profesional.</em></p>
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
    gap: '20px',
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
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '50px',
    borderRadius: '10px',
    color: '#fff',
    maxWidth: '800px',
    margin: '80px auto',
    textAlign: 'left',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)'
  },
  heading: {
    fontSize: '32px',
    marginBottom: '20px',
  },
  subheading: {
    fontSize: '24px',
    marginTop: '30px',
    marginBottom: '10px'
  },
  text: {
    fontSize: '18px',
    marginBottom: '10px'
  },
  list: {
    fontSize: '18px',
    lineHeight: '1.8',
    paddingLeft: '20px'
  },
  textSmall: {
    fontSize: '14px',
    marginTop: '30px'
  }
};

export default InfoForm;
