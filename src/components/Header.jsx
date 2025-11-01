import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>StethoNet</h1>
      <nav style={styles.nav}>
        
      </nav>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#fff',
    padding: '16px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  logo: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2b6cb0'
  },
  nav: {
    display: 'flex',
    gap: '16px'
  },
  link: {
    color: '#2b6cb0',
    fontWeight: '500'
  }
};

export default Header;
