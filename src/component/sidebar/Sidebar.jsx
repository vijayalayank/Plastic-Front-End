import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({ activeItem, onItemClick }) => {
  const menuItems = [
    { id: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'stocks', label: 'Stocks', icon: '📦' }
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>✕</div>
      </div>
      
      <nav className={styles.navigation}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.navItem} ${activeItem === item.id ? styles.active : ''}`}
            onClick={() => onItemClick(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
