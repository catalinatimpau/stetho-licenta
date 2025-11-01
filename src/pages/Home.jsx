import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Home() {
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
          <Link to="/pacienti" style={styles.sidebarLink}>Pacienți</Link>
          <Link to="/info" style={styles.sidebarLink}>Informații</Link>
          <Link to="/add-patient" style={styles.sidebarLink}>Adaugă pacient</Link>
        </div>
      )}

      
      <div style={styles.overlay}>
        {user ? (
          <>
            Bine ai venit, {user.role} {user.username}! Ai acces personalizat la platformă.
          </>
        ) : (
          <>
            Bine ai venit la StethoNet! Platformă inteligentă pentru ascultarea și analizarea sunetelor pulmonare.
          </>
        )}
      </div>

      
      <div style={styles.servicesSection}>
        <h2 style={styles.sectionTitle}>Ce îți oferă StethoNet?</h2>
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={5000}
          transitionTime={700}
          swipeable
          emulateTouch
          showArrows={true}
        >
          <div style={styles.serviceSlide}>
            <img src="/carusel.png" alt="AI Diagnostic" style={styles.serviceImage} />
            <h3>Observații clinice</h3>
            <p>Verificare pe baza sunetului și istoric medical.</p>
          </div>
          <div style={styles.serviceSlide}>
            <img src="/carusel1.png" alt="Înregistrare sunet" style={styles.serviceImage} />
            <h3>Înregistrare sunete respiratorii</h3>
            <p>Încarcă fișiere WAV sau folosește înregistrări preexistente pentru analiză și arhivare.</p>
          </div>
          <div style={styles.serviceSlide}>
            <img src="/carusel2.png" alt="Spectrogramă" style={styles.serviceImage} />
            <h3>Vizualizare spectrogramă</h3>
            <p>Vezi analiza spectrală a sunetelor respiratorii în format grafic interactiv.</p>
          </div>
          <div style={styles.serviceSlide}>
            <img src="/carusel3.png" alt="Fișe pacient" style={styles.serviceImage} />
            <h3>Fișe medicale complete</h3>
            <p>Centralizează date despre pacienți, ascultări, greutate, diagnostic și istoric.</p>
          </div>
          <div style={styles.serviceSlide}>
            <img src="/carusel4.png" alt="Setări cont" style={styles.serviceImage} />
            <h3>Cont și preferințe</h3>
            <p>Setează interfața, tema, autentificarea și alte preferințe din contul tău.</p>
          </div>
        </Carousel>
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
    overflowX: 'hidden',
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '25px 60px',
    color: '#fff',
    maxWidth: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '22px',
    marginTop: '40px',
    marginBottom: '30px',
    boxShadow: '0 0 12px rgba(0,0,0,0.3)'
  },
  servicesSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    padding: '60px 30px',
    borderRadius: '12px',
    margin: '0 auto 60px auto',
    maxWidth: '1200px',
    textAlign: 'center',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '30px',
    marginBottom: '40px',
    color: '#2b6cb0',
    fontWeight: 'bold'
  },
  serviceSlide: {
    padding: '10px 20px'
  },
  serviceImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '20px'
  }
};

export default Home;
