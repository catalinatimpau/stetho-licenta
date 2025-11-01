import React from 'react';
import NavBar from '../components/NavBar';

function Home() {
  return (
    <div style={styles.pageWrapper}>
      
      <NavBar />

      
      <div style={styles.overlay}>
        <h2 style={styles.title}>
          Bine ai venit la <span style={styles.highlight}>StethoNet</span>!
        </h2>
        <p style={styles.text}>
        Aplicație pentru ascultarea sunetelor pulmonare, diagnosticare asistată AI și antrenament medical interactiv.
        </p>
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
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: '40px',
    borderRadius: '10px',
    color: '#fff',
    maxWidth: '800px',
    margin: '120px auto',
    textAlign: 'center',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: '36px',
    marginBottom: '20px',
  },
  highlight: {
    color: '#63b3ed',
  },
  text: {
    fontSize: '18px',
    marginBottom: '30px',
  },
};

export default Home;
