import React from 'react';
import styles from './TopBar.module.css';

const TopBar = () => {
  return (
    <div className={styles.topBar}>
      <div className={styles.leftSection}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>✕</span>
          </div>
        </div>
      </div>
      
      <div className={styles.centerSection}>
        <div className={styles.divider}></div>
      </div>
    </div>
  );
};

export default TopBar;
