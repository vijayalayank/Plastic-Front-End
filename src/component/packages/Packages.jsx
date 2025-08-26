import React, { useState } from 'react';
import { usePopup } from '../../context/PopupContext';
import TestQR from '../test-qr';
import styles from './Packages.module.css';

const Packages = () => {
  const { openPopup } = usePopup();
  const [searchTerm, setSearchTerm] = useState('');
  const [showTestQR, setShowTestQR] = useState(false);

  // Sample package data - packages are collections of batches
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: 'Package 1',
      invoiceId: 'INV-2024-001',
      batches: ['Batch Code 1', 'Batch Code 2', 'Batch Code 3'],
      totalBatches: 3,
      status: 'Active',
      createdDate: '2024-01-15',
      description: 'Collection of batches for January production'
    },
    {
      id: 2,
      name: 'Package 2',
      invoiceId: 'INV-2024-002',
      batches: ['Batch Code 4', 'Batch Code 5'],
      totalBatches: 2,
      status: 'Active',
      createdDate: '2024-01-20',
      description: 'Premium product batch collection'
    },
    {
      id: 3,
      name: 'Package 3',
      invoiceId: 'INV-2024-003',
      batches: ['Batch Code 6', 'Batch Code 7', 'Batch Code 8', 'Batch Code 9'],
      totalBatches: 4,
      status: 'Active',
      createdDate: '2024-02-01',
      description: 'Large batch collection for export'
    },
    {
      id: 4,
      name: 'Package 4',
      invoiceId: 'INV-2024-004',
      batches: ['Batch Code 10'],
      totalBatches: 1,
      status: 'Inactive',
      createdDate: '2024-02-10',
      description: 'Single batch package for testing'
    },
    {
      id: 5,
      name: 'Package 5',
      invoiceId: 'INV-2024-005',
      batches: ['Batch Code 11', 'Batch Code 12', 'Batch Code 13'],
      totalBatches: 3,
      status: 'Active',
      createdDate: '2024-02-15',
      description: 'Mid-month production package'
    },
    {
      id: 6,
      name: 'Package 6',
      invoiceId: 'INV-2024-006',
      batches: ['Batch Code 14', 'Batch Code 15'],
      totalBatches: 2,
      status: 'Active',
      createdDate: '2024-02-20',
      description: 'Special order batch collection'
    }
  ]);

  // Filter packages based on search term
  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.batches.some(batch => batch.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddPackage = () => {
    openPopup('addPackage', {
      isEdit: false
    });
  };

  const handleEditPackage = (packageData) => {
    openPopup('editPackage', {
      package: packageData,
      isEdit: true
    });
  };

  const handleViewPackage = (packageData) => {
    openPopup('viewPackage', {
      package: packageData
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Packaging</h1>
        <button className={styles.addButton} onClick={handleAddPackage}>
          Add Package
        </button>
      </div>

      <div className={styles.searchSection}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="🔍 Search packages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Test QR Generator Section */}
      <div className={styles.testSection}>
        <button
          className={styles.testToggleButton}
          onClick={() => setShowTestQR(!showTestQR)}
        >
          {showTestQR ? '🔼 Hide QR Test Generator' : '🔽 Show QR Test Generator'}
        </button>
        {showTestQR && (
          <div className={styles.testQRContainer}>
            <TestQR />
          </div>
        )}
      </div>

      <div className={styles.packagesGrid}>
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className={styles.packageCard}>
            <div className={styles.packageHeader}>
              <h3 className={styles.packageName}>{pkg.name}</h3>
              <span className={`${styles.status} ${styles[pkg.status.toLowerCase()]}`}>
                {pkg.status}
              </span>
            </div>
            
            <div className={styles.packageInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Invoice ID:</span>
                <span className={styles.value}>{pkg.invoiceId}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Total Batches:</span>
                <span className={styles.value}>{pkg.totalBatches}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Created:</span>
                <span className={styles.value}>{pkg.createdDate}</span>
              </div>
              <div className={styles.batchList}>
                <span className={styles.label}>Batches:</span>
                <div className={styles.batchTags}>
                  {pkg.batches.slice(0, 3).map((batch, index) => (
                    <span key={index} className={styles.batchTag}>
                      {batch}
                    </span>
                  ))}
                  {pkg.batches.length > 3 && (
                    <span className={styles.batchTag}>
                      +{pkg.batches.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.packageActions}>
              <button 
                className={styles.viewButton}
                onClick={() => handleViewPackage(pkg)}
              >
                View
              </button>
              <button 
                className={styles.editButton}
                onClick={() => handleEditPackage(pkg)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className={styles.noResults}>
          <p>No packages found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Packages;
