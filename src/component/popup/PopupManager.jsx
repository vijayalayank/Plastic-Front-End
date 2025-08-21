import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { usePopup } from '../../context/PopupContext';
import styles from './PopupManager.module.css';

const PopupManager = ({ batches, onBatchUpdate }) => {
  const { activePopup, popupData, closePopup } = usePopup();
  const [formData, setFormData] = useState({
    batchCode: '',
    performWeight: '',
    neckSize: '',
    numberOfPieces: '',
    qcPassed: ''
  });


  useEffect(() => {
    if (activePopup === 'editBatch' && popupData) {
      if (popupData.isEdit) {
        // Editing existing batch
        setFormData({
          batchCode: popupData.batch.batchCode,
          performWeight: popupData.batch.performWeight,
          neckSize: popupData.batch.neckSize,
          numberOfPieces: popupData.batch.numberOfPieces,
          qcPassed: popupData.batch.qcPassed
        });
      } else {
        // Adding new batch
        setFormData({
          batchCode: popupData.batchCode,
          performWeight: '',
          neckSize: '',
          numberOfPieces: '',
          qcPassed: ''
        });
      }
    }
  }, [activePopup, popupData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  const handleSaveChanges = () => {
    if (onBatchUpdate) {
      onBatchUpdate(formData, popupData);
    }
    closePopup();
  };



  const generateQRData = (batch) => {
    return JSON.stringify({
      batchId: batch.id,
      batchCode: batch.batchCode,
      performWeight: batch.performWeight,
      neckSize: batch.neckSize,
      numberOfPieces: batch.numberOfPieces,
      qcPassed: batch.qcPassed,
      timestamp: new Date().toISOString()
    });
  };

  const downloadQRCode = () => {
    const batch = popupData.batch;
    if (!batch) return;

    // Get the QR code SVG element
    const svg = document.querySelector('#popup-qr-code-svg');
    if (!svg) return;

    // Create a canvas to convert SVG to image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    
    // Set canvas size
    canvas.width = 256;
    canvas.height = 256;
    
    // Create an image from SVG
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = function() {
      // Draw white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the QR code
      ctx.drawImage(img, 0, 0);
      
      // Convert canvas to blob and download
      canvas.toBlob(function(blob) {
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `QR_Code_${batch.batchCode.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      }, 'image/png');
      
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  if (!activePopup) return null;

  return (
    <div className={styles.modalOverlay} onClick={closePopup}>
      {/* Edit Batch Modal */}
      {activePopup === 'editBatch' && (
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>
              {popupData?.isEdit ? 'Edit Batch Detail' : 'Add New Batch'}
            </h2>
            <button className={styles.closeButton} onClick={closePopup}>
              ×
            </button>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Batch No : {formData.batchCode}</label>
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Perform Weight :</label>
              <input
                type="text"
                className={styles.fieldInput}
                value={formData.performWeight}
                onChange={(e) => handleInputChange('performWeight', e.target.value)}
                placeholder="Enter perform weight"
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Neck Size :</label>
              <input
                type="text"
                className={styles.fieldInput}
                value={formData.neckSize}
                onChange={(e) => handleInputChange('neckSize', e.target.value)}
                placeholder="Enter neck size"
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Number of Pieces :</label>
              <input
                type="text"
                className={styles.fieldInput}
                value={formData.numberOfPieces}
                onChange={(e) => handleInputChange('numberOfPieces', e.target.value)}
                placeholder="Enter number of pieces"
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Q.C. Passed :</label>
              <input
                type="text"
                className={styles.fieldInput}
                value={formData.qcPassed}
                onChange={(e) => handleInputChange('qcPassed', e.target.value)}
                placeholder="Enter QC passed count"
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.saveButton} onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {activePopup === 'qrCode' && popupData?.batch && (
        <div className={styles.qrModalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>
              QR Code - {popupData.batch.name}
            </h2>
            <button className={styles.closeButton} onClick={closePopup}>
              ×
            </button>
          </div>
          <div className={styles.qrCodeContainer}>
            <div className={styles.qrCodeWrapper}>
              <QRCode
                id="popup-qr-code-svg"
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={generateQRData(popupData.batch)}
                viewBox={`0 0 256 256`}
              />
            </div>
            
            <div className={styles.qrActions}>
              <button className={styles.downloadButton} onClick={downloadQRCode}>
                📥 Download QR Code
              </button>
            </div>

            <div className={styles.qrDetails}>
              <div className={styles.batchDetails}>
                <p><strong>Batch Code:</strong> {popupData.batch.batchCode}</p>
                <p><strong>Perform Weight:</strong> {popupData.batch.performWeight}</p>
                <p><strong>Neck Size:</strong> {popupData.batch.neckSize}</p>
                <p><strong>Number of Pieces:</strong> {popupData.batch.numberOfPieces}</p>
                <p><strong>Q.C. Passed:</strong> {popupData.batch.qcPassed}</p>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default PopupManager;
