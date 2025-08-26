import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import QRScanner from '../qr-scanner';
import { usePopup } from '../../context/PopupContext';
import { batchService } from '../../services/batchService';
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

  const [packageFormData, setPackageFormData] = useState({
    name: '',
    invoiceId: '',
    batches: [],
    status: 'Active',
    description: ''
  });

  const [scannedBatch, setScannedBatch] = useState('');
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [batchValidation, setBatchValidation] = useState({
    isValidating: false,
    isValid: null,
    message: '',
    foundBatch: null
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
    } else if (activePopup === 'addPackage') {
      // Adding new package
      setPackageFormData({
        name: '',
        invoiceId: '',
        batches: [],
        status: 'Active',
        description: ''
      });
      setScannedBatch('');
      setIsQRScannerOpen(false);
      setBatchValidation({
        isValidating: false,
        isValid: null,
        message: '',
        foundBatch: null
      });
    } else if (activePopup === 'editPackage' && popupData?.package) {
      // Editing existing package
      setPackageFormData({
        name: popupData.package.name,
        invoiceId: popupData.package.invoiceId,
        batches: [...popupData.package.batches],
        status: popupData.package.status,
        description: popupData.package.description
      });
      setScannedBatch('');
      setIsQRScannerOpen(false);
      setBatchValidation({
        isValidating: false,
        isValid: null,
        message: '',
        foundBatch: null
      });
    }
  }, [activePopup, popupData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePackageInputChange = (field, value) => {
    setPackageFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  const handleRemoveBatch = (batchToRemove) => {
    setPackageFormData(prev => ({
      ...prev,
      batches: prev.batches.filter(batch => batch !== batchToRemove)
    }));
  };

  const handleScannedBatchChange = (value) => {
    setScannedBatch(value);
  };

  const handleScannedBatchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleValidateBatch();
    }
  };

  const handleValidateBatch = async () => {
    if (!scannedBatch.trim()) return;

    setBatchValidation({
      isValidating: true,
      isValid: null,
      message: 'Validating batch...',
      foundBatch: null
    });

    try {
      const foundBatch = await batchService.findBatch(scannedBatch.trim());

      if (foundBatch) {
        setBatchValidation({
          isValidating: false,
          isValid: true,
          message: `Found: ${foundBatch.batchName}`,
          foundBatch: foundBatch
        });
      } else {
        setBatchValidation({
          isValidating: false,
          isValid: false,
          message: 'Batch not found in database',
          foundBatch: null
        });
      }
    } catch (error) {
      setBatchValidation({
        isValidating: false,
        isValid: false,
        message: 'Error validating batch',
        foundBatch: null
      });
    }
  };

  const handleAddValidatedBatch = () => {
    alert('Add Batch button clicked!'); // Temporary debug alert

    const batchToAdd = batchValidation.foundBatch
      ? batchValidation.foundBatch.batchCode
      : scannedBatch.trim();

    if (batchToAdd && !packageFormData.batches.includes(batchToAdd)) {
      setPackageFormData(prev => ({
        ...prev,
        batches: [...prev.batches, batchToAdd]
      }));
      setScannedBatch('');
      setBatchValidation({
        isValidating: false,
        isValid: null,
        message: '',
        foundBatch: null
      });
      alert(`Batch "${batchToAdd}" added successfully!`); // Success alert
    } else {
      alert(`Batch "${batchToAdd}" not added - either empty or already exists`); // Error alert
    }
  };

  const handleAddManually = () => {
    if (scannedBatch.trim() && !packageFormData.batches.includes(scannedBatch.trim())) {
      setPackageFormData(prev => ({
        ...prev,
        batches: [...prev.batches, scannedBatch.trim()]
      }));
      setScannedBatch('');
      setBatchValidation({
        isValidating: false,
        isValid: null,
        message: '',
        foundBatch: null
      });
    }
  };

  const handleOpenQRScanner = () => {
    setIsQRScannerOpen(true);
  };

  const handleCloseQRScanner = () => {
    setIsQRScannerOpen(false);
  };

  const handleQRScan = async (qrData) => {
    setIsQRScannerOpen(false);

    // Parse QR data to extract batch information
    const parsedData = batchService.parseQRData(qrData);

    if (parsedData) {
      setScannedBatch(parsedData.batchCode);

      // Auto-validate the scanned batch
      setBatchValidation({
        isValidating: true,
        isValid: null,
        message: 'Validating scanned batch...',
        foundBatch: null
      });

      try {
        const foundBatch = await batchService.findBatch(parsedData.batchCode);

        if (foundBatch) {
          setBatchValidation({
            isValidating: false,
            isValid: true,
            message: `Scanned: ${foundBatch.batchName}`,
            foundBatch: foundBatch
          });
        } else {
          setBatchValidation({
            isValidating: false,
            isValid: false,
            message: 'Scanned batch not found in database',
            foundBatch: null
          });
        }
      } catch (error) {
        setBatchValidation({
          isValidating: false,
          isValid: false,
          message: 'Error validating scanned batch',
          foundBatch: null
        });
      }
    } else {
      setScannedBatch(qrData);
      setBatchValidation({
        isValidating: false,
        isValid: false,
        message: 'Invalid QR code format',
        foundBatch: null
      });
    }
  };



  const handleSaveChanges = () => {
    if (onBatchUpdate) {
      onBatchUpdate(formData, popupData);
    }
    closePopup();
  };

  const handleSavePackage = () => {
    // Here you would typically save the package data to a backend
    console.log('Saving package data:', packageFormData);
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

      {/* Add Package Modal */}
      {activePopup === 'addPackage' && (
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Add Package</h2>
            <button className={styles.closeButton} onClick={closePopup}>
              ×
            </button>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.packageFormSection}>
              {/* Package Name and Scan Section */}
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    value={packageFormData.name}
                    onChange={(e) => handlePackageInputChange('name', e.target.value)}
                    placeholder="package name"
                  />
                </div>
                <div className={styles.scanSection}>
                  <input
                    type="text"
                    className={`${styles.scanInput} ${
                      batchValidation.isValid === true ? styles.validInput :
                      batchValidation.isValid === false ? styles.invalidInput : ''
                    }`}
                    value={scannedBatch}
                    onChange={(e) => handleScannedBatchChange(e.target.value)}
                    onKeyPress={handleScannedBatchKeyPress}
                    placeholder="Scan or enter batch code"
                    disabled={batchValidation.isValidating}
                  />
                  <button
                    className={styles.scanButton}
                    onClick={handleOpenQRScanner}
                    type="button"
                    disabled={batchValidation.isValidating}
                  >
                    📷 Scan
                  </button>
                </div>

                {/* Batch Validation Section */}
                {(batchValidation.message || scannedBatch.trim()) && (
                  <div className={styles.validationSection}>
                    {batchValidation.isValidating && (
                      <div className={styles.validationMessage}>
                        <span className={styles.loadingSpinner}>⏳</span>
                        {batchValidation.message}
                      </div>
                    )}

                    {!batchValidation.isValidating && batchValidation.isValid === true && (
                      <div className={styles.validationMessage}>
                        <span className={styles.successIcon}>✅</span>
                        {batchValidation.message}
                        <button
                          className={styles.addBatchButton}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddValidatedBatch();
                          }}
                          type="button"
                        >
                          Add Batch
                        </button>
                      </div>
                    )}

                    {!batchValidation.isValidating && batchValidation.isValid === false && scannedBatch.trim() && (
                      <div className={styles.validationMessage}>
                        <span className={styles.errorIcon}>❌</span>
                        {batchValidation.message}
                        <button
                          className={styles.addManuallyButton}
                          onClick={handleAddManually}
                          type="button"
                        >
                          Add Manually
                        </button>
                      </div>
                    )}

                    {!batchValidation.isValidating && !batchValidation.message && scannedBatch.trim() && (
                      <div className={styles.validationActions}>
                        <button
                          className={styles.validateButton}
                          onClick={handleValidateBatch}
                          type="button"
                        >
                          Validate Batch
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Added Batches Section */}
              <div className={styles.addedBatchesSection}>
                <h3 className={styles.sectionTitle}>Added batches</h3>
                <div className={styles.batchesList}>
                  {packageFormData.batches.length === 0 ? (
                    <p className={styles.noBatches}>No batches added yet</p>
                  ) : (
                    packageFormData.batches.map((batch, index) => (
                      <div key={index} className={styles.batchItem}>
                        <span className={styles.batchCode}>{batch}</span>
                        <button
                          className={styles.removeBatchButton}
                          onClick={() => handleRemoveBatch(batch)}
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Invoice ID Section */}
              <div className={styles.invoiceSection}>
                <input
                  type="text"
                  className={styles.invoiceInput}
                  value={packageFormData.invoiceId}
                  onChange={(e) => handlePackageInputChange('invoiceId', e.target.value)}
                  placeholder="add Invoice ID"
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.createButton} onClick={handleSavePackage}>
                Create package and Gen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {activePopup === 'editPackage' && popupData?.package && (
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Edit Package</h2>
            <button className={styles.closeButton} onClick={closePopup}>
              ×
            </button>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.packageFormSection}>
              {/* Package Name and Scan Section */}
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <input
                    type="text"
                    className={styles.fieldInput}
                    value={packageFormData.name}
                    onChange={(e) => handlePackageInputChange('name', e.target.value)}
                    placeholder="package name"
                  />
                </div>
                <div className={styles.scanSection}>
                  <input
                    type="text"
                    className={`${styles.scanInput} ${
                      batchValidation.isValid === true ? styles.validInput :
                      batchValidation.isValid === false ? styles.invalidInput : ''
                    }`}
                    value={scannedBatch}
                    onChange={(e) => handleScannedBatchChange(e.target.value)}
                    onKeyPress={handleScannedBatchKeyPress}
                    placeholder="Scan or enter batch code"
                    disabled={batchValidation.isValidating}
                  />
                  <button
                    className={styles.scanButton}
                    onClick={handleOpenQRScanner}
                    type="button"
                    disabled={batchValidation.isValidating}
                  >
                    📷 Scan
                  </button>
                </div>

                {/* Batch Validation Section */}
                {(batchValidation.message || scannedBatch.trim()) && (
                  <div className={styles.validationSection}>
                    {batchValidation.isValidating && (
                      <div className={styles.validationMessage}>
                        <span className={styles.loadingSpinner}>⏳</span>
                        {batchValidation.message}
                      </div>
                    )}

                    {!batchValidation.isValidating && batchValidation.isValid === true && (
                      <div className={styles.validationMessage}>
                        <span className={styles.successIcon}>✅</span>
                        {batchValidation.message}
                        <button
                          className={styles.addBatchButton}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddValidatedBatch();
                          }}
                          type="button"
                        >
                          Add Batch
                        </button>
                      </div>
                    )}

                    {!batchValidation.isValidating && batchValidation.isValid === false && scannedBatch.trim() && (
                      <div className={styles.validationMessage}>
                        <span className={styles.errorIcon}>❌</span>
                        {batchValidation.message}
                        <button
                          className={styles.addManuallyButton}
                          onClick={handleAddManually}
                          type="button"
                        >
                          Add Manually
                        </button>
                      </div>
                    )}

                    {!batchValidation.isValidating && !batchValidation.message && scannedBatch.trim() && (
                      <div className={styles.validationActions}>
                        <button
                          className={styles.validateButton}
                          onClick={handleValidateBatch}
                          type="button"
                        >
                          Validate Batch
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Added Batches Section */}
              <div className={styles.addedBatchesSection}>
                <h3 className={styles.sectionTitle}>Added batches</h3>
                <div className={styles.batchesList}>
                  {packageFormData.batches.length === 0 ? (
                    <p className={styles.noBatches}>No batches added yet</p>
                  ) : (
                    packageFormData.batches.map((batch, index) => (
                      <div key={index} className={styles.batchItem}>
                        <span className={styles.batchCode}>{batch}</span>
                        <button
                          className={styles.removeBatchButton}
                          onClick={() => handleRemoveBatch(batch)}
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Invoice ID Section */}
              <div className={styles.invoiceSection}>
                <input
                  type="text"
                  className={styles.invoiceInput}
                  value={packageFormData.invoiceId}
                  onChange={(e) => handlePackageInputChange('invoiceId', e.target.value)}
                  placeholder="add Invoice ID"
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.saveButton} onClick={handleSavePackage}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Package Modal */}
      {activePopup === 'viewPackage' && popupData?.package && (
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Package Details</h2>
            <button className={styles.closeButton} onClick={closePopup}>
              ×
            </button>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.packageViewSection}>
              <div className={styles.viewRow}>
                <span className={styles.viewLabel}>Package Name:</span>
                <span className={styles.viewValue}>{popupData.package.name}</span>
              </div>
              <div className={styles.viewRow}>
                <span className={styles.viewLabel}>Invoice ID:</span>
                <span className={styles.viewValue}>{popupData.package.invoiceId}</span>
              </div>
              <div className={styles.viewRow}>
                <span className={styles.viewLabel}>Total Batches:</span>
                <span className={styles.viewValue}>{popupData.package.totalBatches}</span>
              </div>
              <div className={styles.viewRow}>
                <span className={styles.viewLabel}>Status:</span>
                <span className={`${styles.viewValue} ${styles.statusBadge} ${styles[popupData.package.status.toLowerCase()]}`}>
                  {popupData.package.status}
                </span>
              </div>
              <div className={styles.viewRow}>
                <span className={styles.viewLabel}>Created Date:</span>
                <span className={styles.viewValue}>{popupData.package.createdDate}</span>
              </div>
              <div className={styles.viewRow}>
                <span className={styles.viewLabel}>Description:</span>
                <span className={styles.viewValue}>{popupData.package.description}</span>
              </div>
              <div className={styles.viewBatchesSection}>
                <span className={styles.viewLabel}>Batches:</span>
                <div className={styles.viewBatchesList}>
                  {popupData.package.batches.map((batch, index) => (
                    <span key={index} className={styles.viewBatchTag}>
                      {batch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner */}
      <QRScanner
        isActive={isQRScannerOpen}
        onScan={handleQRScan}
        onClose={handleCloseQRScanner}
      />

    </div>
  );
};

export default PopupManager;
