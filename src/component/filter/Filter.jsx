import React, { useState } from 'react';
import jsPDF from 'jspdf';
import QRCode from 'react-qr-code';
import styles from './Filter.module.css';

const Filter = ({ batches = [], onShiftChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date('2025-08-01'));
  const [selectedShift, setSelectedShift] = useState('all');

  const formatDateForDisplay = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleDateInputChange = (e) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setCurrentDate(newDate);
    }
  };

  const handleDateDisplayClick = () => {
    // Trigger the hidden date input
    const dateInput = document.querySelector(`.${styles.dateInput}`);
    if (dateInput) {
      dateInput.style.opacity = '1';
      dateInput.style.pointerEvents = 'auto';
      dateInput.focus();
      dateInput.showPicker?.(); // Modern browsers

      // Hide after selection or blur
      const hideInput = () => {
        dateInput.style.opacity = '0';
        dateInput.style.pointerEvents = 'none';
        dateInput.removeEventListener('blur', hideInput);
        dateInput.removeEventListener('change', hideInput);
      };

      dateInput.addEventListener('blur', hideInput);
      dateInput.addEventListener('change', hideInput);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePreviousDay();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNextDay();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDateDisplayClick();
    }
  };

  const handleShiftChange = (e) => {
    const newShift = e.target.value;
    setSelectedShift(newShift);
    if (onShiftChange) {
      onShiftChange(newShift, currentDate);
    }
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

  const generateQRCodeCanvas = (batch) => {
    return new Promise((resolve) => {
      // Create a temporary container for the QR code
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '200px';
      tempContainer.style.height = '200px';
      document.body.appendChild(tempContainer);

      // Import React and ReactDOM for rendering
      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(tempContainer);
        root.render(
          React.createElement(QRCode, {
            size: 200,
            value: generateQRData(batch),
            level: 'M',
            style: { height: "200px", width: "200px" }
          })
        );

        // Wait for rendering to complete
        setTimeout(() => {
          const svg = tempContainer.querySelector('svg');
          if (svg) {
            // Convert SVG to canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = 200;

            const svgData = new XMLSerializer().serializeToString(svg);
            const img = new Image();
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = function() {
              // Draw white background
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              // Draw the QR code
              ctx.drawImage(img, 0, 0);

              const imageData = canvas.toDataURL('image/png');
              URL.revokeObjectURL(url);
              document.body.removeChild(tempContainer);
              resolve(imageData);
            };

            img.onerror = function() {
              URL.revokeObjectURL(url);
              document.body.removeChild(tempContainer);
              resolve(null);
            };

            img.src = url;
          } else {
            document.body.removeChild(tempContainer);
            resolve(null);
          }
        }, 500);
      });
    });
  };

  const downloadAllQRCodes = async () => {
    if (batches.length === 0) {
      alert('No batches available to download');
      return;
    }

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const qrSize = 60;
      const spacing = 10;
      const cols = 2;
      const rows = 3;

      let currentPage = 0;
      let currentRow = 0;
      let currentCol = 0;

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];

        // Add new page if needed
        if (i > 0 && currentRow === 0 && currentCol === 0) {
          pdf.addPage();
          currentPage++;
        }

        // Calculate position
        const x = margin + currentCol * (qrSize + spacing + 30);
        const y = margin + currentRow * (qrSize + spacing + 30);

        // Add batch number title
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${batch.name}`, x + qrSize/2, y - 5, { align: 'center' });

        // Add batch code
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Code: ${batch.batchCode}`, x + qrSize/2, y + qrSize + 8, { align: 'center' });

        // Generate real QR code and add to PDF
        const qrImageData = await generateQRCodeCanvas(batch);
        if (qrImageData) {
          pdf.addImage(qrImageData, 'PNG', x, y, qrSize, qrSize);
        } else {
          // Fallback: create a placeholder if QR generation fails
          pdf.setFillColor(240, 240, 240);
          pdf.rect(x, y, qrSize, qrSize, 'F');
          pdf.setFontSize(8);
          pdf.text('QR Error', x + qrSize/2, y + qrSize/2, { align: 'center' });
        }

        // Add border around QR code
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.rect(x, y, qrSize, qrSize);

        // Update position
        currentCol++;
        if (currentCol >= cols) {
          currentCol = 0;
          currentRow++;
          if (currentRow >= rows) {
            currentRow = 0;
          }
        }
      }

      // Save the PDF
      const fileName = `Batch_QR_Codes_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className={styles.filter}>
      <div className={styles.navigationControls}>
        <button className={styles.navButton} onClick={handlePreviousDay} title="Previous Day">
          <span className={styles.navIcon}>‹‹</span>
        </button>

        <div
          className={styles.dateSection}
          onClick={handleDateDisplayClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`Current date: ${formatDateForDisplay(currentDate)}. Use arrow keys to navigate or press Enter to open date picker.`}
        >
          <input
            type="date"
            value={formatDateForInput(currentDate)}
            onChange={handleDateInputChange}
            className={styles.dateInput}
            aria-hidden="true"
          />
          <div className={styles.dateDisplay}>
            {formatDateForDisplay(currentDate)}
          </div>
          <button className={styles.calendarButton} type="button" tabIndex={-1}>
            <span className={styles.calendarIcon}>📅</span>
          </button>
        </div>

        <button className={styles.navButton} onClick={handleNextDay} title="Next Day">
          <span className={styles.navIcon}>››</span>
        </button>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.actionButton} onClick={downloadAllQRCodes}>
          <span className={styles.buttonText}>qr download</span>
        </button>
        
        <div className={styles.filterDropdown}>
          <select
            className={styles.filterSelect}
            value={selectedShift}
            onChange={handleShiftChange}
          >
            <option value="all">All</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
          <div className={styles.dropdownArrow}>▼</div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
