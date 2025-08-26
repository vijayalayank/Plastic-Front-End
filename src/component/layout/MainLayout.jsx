import React, { useState } from 'react';
import Sidebar from '../sidebar';
import TopBar from '../topbar';
import Navbar from '../navbar';
import Filter from '../filter';
import Heading from '../heading';
import ShiftDetails from '../shift-details';
import Batches from '../batches';
import Packages from '../packages';
import PopupManager from '../popup/PopupManager';
import { PopupProvider, usePopup } from '../../context/PopupContext';
import styles from './MainLayout.module.css';

const MainContent = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('manufacturing');
  const [batchData, setBatchData] = useState([]);
  const [currentShift, setCurrentShift] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isPopupOpen } = usePopup();

  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId);
  };

  const handleBatchDataUpdate = (batches) => {
    setBatchData(batches);
  };

  const handleShiftChange = (shift, date) => {
    setCurrentShift(shift);
    setCurrentDate(date);
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'manufacturing':
        return (
          <div className={styles.manufacturingContent}>
            <ShiftDetails currentShift={currentShift} currentDate={currentDate} />
            <Batches
              currentShift={currentShift}
              currentDate={currentDate}
              onBatchDataUpdate={handleBatchDataUpdate}
            />
          </div>
        );
      case 'package':
        return <Packages />;
      case 'stocks':
        return (
          <div className={styles.contentPlaceholder}>
            <h2>Stock Management</h2>
            <p>Stock management content will be displayed here.</p>
          </div>
        );
      default:
        return (
          <div className={styles.manufacturingContent}>
            <ShiftDetails />
            <Batches />
          </div>
        );
    }
  };

  const getPageTitle = () => {
    switch (activeMenuItem) {
      case 'manufacturing':
        return 'Manufacturing';
      case 'package':
        return 'Packaging';
      case 'stocks':
        return 'Stocks';
      default:
        return 'Manufacturing';
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        activeItem={activeMenuItem}
        onItemClick={handleMenuItemClick}
      />

      <div className={`${styles.mainContent} ${isPopupOpen ? styles.blurred : ''}`}>
        <Navbar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} />
        <Heading title={getPageTitle()} />
        <Filter batches={batchData} onShiftChange={handleShiftChange} />

        <div className={styles.contentArea}>
          {renderContent()}
        </div>
      </div>

      <PopupManager
        batches={batchData}
        onBatchUpdate={(formData, popupData) => {
          // This will be handled by the Batches component directly
          // The popup manager is just for display
          console.log('Batch update:', formData, popupData);
        }}
      />
    </div>
  );
};

const MainLayout = () => {
  return (
    <PopupProvider>
      <MainContent />
    </PopupProvider>
  );
};

export default MainLayout;
