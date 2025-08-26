import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import styles from './QRScanner.module.css';

const QRScanner = ({ onScan, onClose, isActive }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const codeReader = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isActive]);

  const startScanning = async () => {
    try {
      setError('');
      setIsScanning(true);

      // Initialize the code reader
      codeReader.current = new BrowserMultiFormatReader();

      // Get user media with better constraints
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          startContinuousScanning();
        };
      }
    } catch (err) {
      console.error('Failed to start camera:', err);
      setError('Failed to access camera. Please check permissions and try again.');
      setIsScanning(false);
    }
  };

  const startContinuousScanning = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Scan every 500ms
    scanIntervalRef.current = setInterval(async () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        try {
          // Draw current video frame to canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Get image data from canvas
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

          // Try to decode QR code from image data
          const result = await codeReader.current.decodeFromImageData(imageData);

          if (result) {
            const scannedText = result.getText();
            console.log('QR Code detected:', scannedText);
            onScan(scannedText);
            stopScanning();
          }
        } catch (err) {
          // NotFoundException is expected when no QR code is found
          if (!(err instanceof NotFoundException)) {
            console.error('Scanning error:', err);
          }
        }
      }
    }, 500);
  };

  const stopScanning = () => {
    // Clear scanning interval
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    // Stop video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Reset code reader
    if (codeReader.current) {
      codeReader.current.reset();
      codeReader.current = null;
    }

    setIsScanning(false);
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput('');
      setShowManualInput(false);
    }
  };

  const handleManualKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleManualSubmit();
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className={styles.scannerOverlay}>
      <div className={styles.scannerContainer}>
        <div className={styles.scannerHeader}>
          <h3 className={styles.scannerTitle}>Scan QR Code</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className={styles.videoContainer}>
          {error ? (
            <div className={styles.errorMessage}>
              <p>{error}</p>
              <button className={styles.retryButton} onClick={startScanning}>
                Try Again
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className={styles.video}
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
              <div className={styles.scannerFrame}>
                <div className={styles.corner}></div>
                <div className={styles.corner}></div>
                <div className={styles.corner}></div>
                <div className={styles.corner}></div>
              </div>
              {isScanning && (
                <div className={styles.scanningIndicator}>
                  <div className={styles.scanLine}></div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className={styles.scannerFooter}>
          <p className={styles.instruction}>
            {isScanning ? 'Point camera at QR code' : 'Initializing camera...'}
          </p>

          {showManualInput ? (
            <div className={styles.manualInputSection}>
              <input
                type="text"
                className={styles.manualInput}
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyPress={handleManualKeyPress}
                placeholder="Enter QR code data manually"
                autoFocus
              />
              <div className={styles.manualButtons}>
                <button className={styles.submitButton} onClick={handleManualSubmit}>
                  Submit
                </button>
                <button className={styles.backButton} onClick={() => setShowManualInput(false)}>
                  Back
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.footerButtons}>
              <button
                className={styles.manualButton}
                onClick={() => setShowManualInput(true)}
              >
                Enter Manually
              </button>
              <button className={styles.cancelButton} onClick={onClose}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
