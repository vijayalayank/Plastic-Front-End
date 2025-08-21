import React, { createContext, useContext, useState } from 'react';

const PopupContext = createContext();

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const PopupProvider = ({ children }) => {
  const [activePopup, setActivePopup] = useState(null);
  const [popupData, setPopupData] = useState(null);

  const openPopup = (popupType, data = null) => {
    setActivePopup(popupType);
    setPopupData(data);
  };

  const closePopup = () => {
    setActivePopup(null);
    setPopupData(null);
  };

  const value = {
    activePopup,
    popupData,
    openPopup,
    closePopup,
    isPopupOpen: !!activePopup
  };

  return (
    <PopupContext.Provider value={value}>
      {children}
    </PopupContext.Provider>
  );
};

export default PopupContext;
