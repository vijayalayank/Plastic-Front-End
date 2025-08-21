import React from 'react';
import styles from './Heading.module.css';

const Heading = ({ title = "Manufacturing" }) => {
  return (
    <div className={styles.heading}>
      <h1 className={styles.title}>{title}</h1>
    </div>
  );
};

export default Heading;
