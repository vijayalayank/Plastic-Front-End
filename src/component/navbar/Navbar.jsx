import React from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>✕</span>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.divider}></div>
      </div>
    </nav>
  );
};

export default Navbar;
