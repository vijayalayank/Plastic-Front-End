import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import styles from './TestQR.module.css';

const TestQR = () => {
  const [selectedBatch, setSelectedBatch] = useState('Batch Code 1');
  
  const testBatches = [
    'Batch Code 1',
    'Batch Code 2', 
    'Batch Code 3',
    'Batch Code 4',
    'Batch Code 5',
    'Custom Batch XYZ',
    'Test Batch 123'
  ];

  return (
    <div className={styles.testContainer}>
      <h3 className={styles.title}>QR Code Generator for Testing</h3>
      <p className={styles.description}>
        Generate QR codes to test the scanner functionality
      </p>
      
      <div className={styles.controls}>
        <label className={styles.label}>Select Batch Code:</label>
        <select 
          className={styles.select}
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
        >
          {testBatches.map(batch => (
            <option key={batch} value={batch}>{batch}</option>
          ))}
        </select>
        
        <input
          type="text"
          className={styles.customInput}
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          placeholder="Or enter custom batch code"
        />
      </div>
      
      <div className={styles.qrContainer}>
        <div className={styles.qrWrapper}>
          <QRCode
            size={200}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={selectedBatch}
            viewBox={`0 0 200 200`}
          />
        </div>
        <p className={styles.qrLabel}>QR Code for: <strong>{selectedBatch}</strong></p>
      </div>
      
      <div className={styles.instructions}>
        <h4>How to test:</h4>
        <ol>
          <li>Select or enter a batch code above</li>
          <li>Open the Package scanner (📷 Scan button)</li>
          <li>Point your camera at this QR code</li>
          <li>The scanner should detect and validate the batch</li>
        </ol>
      </div>
    </div>
  );
};

export default TestQR;
