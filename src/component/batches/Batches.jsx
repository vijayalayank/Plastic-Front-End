import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { usePopup } from '../../context/PopupContext';
import styles from './Batches.module.css';

const Batches = ({ currentShift = 'all', currentDate = new Date(), onBatchDataUpdate }) => {
  const { openPopup } = usePopup();

  // Define shift-specific batch data
  const getShiftBatches = (shift) => {
    const batchDataMap = {
      morning: [
        {
          id: 1,
          name: 'Morning Batch 1',
          status: 'active',
          batchCode: 'M-B001',
          performWeight: '25.5',
          neckSize: '28mm',
          numberOfPieces: '1000',
          qcPassed: '950'
        },
        {
          id: 2,
          name: 'Morning Batch 2',
          status: 'active',
          batchCode: 'M-B002',
          performWeight: '24.8',
          neckSize: '28mm',
          numberOfPieces: '1200',
          qcPassed: '1150'
        },
        {
          id: 3,
          name: 'Morning Batch 3',
          status: 'active',
          batchCode: 'M-B003',
          performWeight: '26.2',
          neckSize: '30mm',
          numberOfPieces: '800',
          qcPassed: '780'
        },
        {
          id: 4,
          name: 'Morning Batch 4',
          status: 'active',
          batchCode: 'M-B004',
          performWeight: '25.0',
          neckSize: '28mm',
          numberOfPieces: '1100',
          qcPassed: '1050'
        }
      ],
      evening: [
        {
          id: 1,
          name: 'Evening Batch 1',
          status: 'active',
          batchCode: 'E-B001',
          performWeight: '27.2',
          neckSize: '32mm',
          numberOfPieces: '1500',
          qcPassed: '1450'
        },
        {
          id: 2,
          name: 'Evening Batch 2',
          status: 'active',
          batchCode: 'E-B002',
          performWeight: '26.8',
          neckSize: '30mm',
          numberOfPieces: '1300',
          qcPassed: '1280'
        },
        {
          id: 3,
          name: 'Evening Batch 3',
          status: 'active',
          batchCode: 'E-B003',
          performWeight: '28.1',
          neckSize: '32mm',
          numberOfPieces: '1600',
          qcPassed: '1550'
        },
        {
          id: 4,
          name: 'Evening Batch 4',
          status: 'active',
          batchCode: 'E-B004',
          performWeight: '27.5',
          neckSize: '30mm',
          numberOfPieces: '1400',
          qcPassed: '1370'
        },
        {
          id: 5,
          name: 'Evening Batch 5',
          status: 'active',
          batchCode: 'E-B005',
          performWeight: '26.9',
          neckSize: '28mm',
          numberOfPieces: '1200',
          qcPassed: '1180'
        }
      ],
      night: [
        {
          id: 1,
          name: 'Night Batch 1',
          status: 'active',
          batchCode: 'N-B001',
          performWeight: '23.8',
          neckSize: '25mm',
          numberOfPieces: '600',
          qcPassed: '580'
        },
        {
          id: 2,
          name: 'Night Batch 2',
          status: 'active',
          batchCode: 'N-B002',
          performWeight: '24.2',
          neckSize: '25mm',
          numberOfPieces: '700',
          qcPassed: '670'
        },
        {
          id: 3,
          name: 'Night Batch 3',
          status: 'active',
          batchCode: 'N-B003',
          performWeight: '23.5',
          neckSize: '28mm',
          numberOfPieces: '550',
          qcPassed: '520'
        }
      ]
    };

    return batchDataMap[shift] || batchDataMap.morning;
  };

  const [batches, setBatches] = useState(getShiftBatches(currentShift));

  // Update batches when currentShift changes
  useEffect(() => {
    setBatches(getShiftBatches(currentShift));
  }, [currentShift]);
  // Notify parent component when batches change
  useEffect(() => {
    if (onBatchDataUpdate) {
      onBatchDataUpdate(batches);
    }
  }, [batches, onBatchDataUpdate]);

  const handleAddBatch = () => {
    const shiftPrefix = currentShift === 'morning' ? 'M-B' :
                       currentShift === 'evening' ? 'E-B' :
                       currentShift === 'night' ? 'N-B' : 'B';
    const batchNumber = String(batches.length + 1).padStart(3, '0');
    const newBatchCode = `${shiftPrefix}${batchNumber}`;

    const newBatch = {
      id: Date.now(),
      name: `${currentShift.charAt(0).toUpperCase() + currentShift.slice(1)} Batch ${batches.length + 1}`,
      status: 'active',
      batchCode: newBatchCode,
      performWeight: '',
      neckSize: '',
      numberOfPieces: '',
      qcPassed: ''
    };

    openPopup('editBatch', {
      batch: newBatch,
      batchCode: newBatchCode,
      isEdit: false
    });
  };

  const handleEditBatch = (batchId) => {
    const batch = batches.find(b => b.id === batchId);
    if (batch) {
      openPopup('editBatch', {
        batch: batch,
        isEdit: true
      });
    }
  };



  const handleShowQR = (batchId) => {
    const batch = batches.find(b => b.id === batchId);
    if (batch) {
      openPopup('qrCode', { batch });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Batches</h2>
        <button className={styles.addButton} onClick={handleAddBatch}>
          Add Batch
        </button>
      </div>

      <div className={styles.batchGrid}>
        {batches.map((batch) => (
          <div key={batch.id} className={styles.batchCard}>
            <div className={styles.cardHeader}>
              <button
                className={styles.editIcon}
                onClick={() => handleEditBatch(batch.id)}
                title="Edit batch"
              >
                ✏️
              </button>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.batchName}>{batch.name}</h3>
              <button
                className={styles.qrButton}
                onClick={() => handleShowQR(batch.id)}
                title="Show QR Code"
              >
                📱 QR Code
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <span className={styles.pageInfo}>Page 1</span>
      </div>


    </div>
  );
};

export default Batches;
