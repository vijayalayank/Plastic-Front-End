import React, { useState, useEffect } from 'react';
import styles from './ShiftDetails.module.css';

const ShiftDetails = ({ currentShift = 'all', currentDate = new Date() }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  // Define shift-specific data
  const getShiftData = (shift) => {
    const shiftDataMap = {
      morning: {
        operatorName: 'John Doe',
        qualityName: 'Premium Quality',
        supervisorName: 'Jane Smith',
        productGrams: '500g',
        runningCavity: '8 Cavity',
        noOfPcs: '1000',
        batchNoStarts: 'B001',
        batchNoEnds: 'B100',
        targetBagBox: '50 Boxes',
        timeSlots: {
          '6-7': { cycleTime: '30s', production: '120', rejection: '2', lumps: '1', runHours: '1.0', idleHours: '0.0' },
          '7-8': { cycleTime: '28s', production: '130', rejection: '1', lumps: '0', runHours: '1.0', idleHours: '0.0' },
          '8-9': { cycleTime: '32s', production: '115', rejection: '3', lumps: '2', runHours: '0.9', idleHours: '0.1' },
          '9-10': { cycleTime: '29s', production: '125', rejection: '2', lumps: '1', runHours: '1.0', idleHours: '0.0' },
          '10-11': { cycleTime: '31s', production: '118', rejection: '2', lumps: '1', runHours: '0.8', idleHours: '0.2' },
          '11-12': { cycleTime: '30s', production: '122', rejection: '1', lumps: '0', runHours: '1.0', idleHours: '0.0' },
          '12-13': { cycleTime: '33s', production: '110', rejection: '4', lumps: '2', runHours: '0.7', idleHours: '0.3' },
          '13-14': { cycleTime: '29s', production: '128', rejection: '1', lumps: '1', runHours: '1.0', idleHours: '0.0' }
        },
        summary: {
          runningHours: '7.30',
          idleHours: '0.30',
          rejectionKgs: '25 Kg',
          lumpsKgs: '0.3Kg'
        }
      },
      evening: {
        operatorName: 'Emily Davis',
        qualityName: 'High Grade',
        supervisorName: 'Robert Chen',
        productGrams: '750g',
        runningCavity: '12 Cavity',
        noOfPcs: '1500',
        batchNoStarts: 'E001',
        batchNoEnds: 'E150',
        targetBagBox: '75 Boxes',
        timeSlots: {
          '14-15': { cycleTime: '25s', production: '145', rejection: '1', lumps: '0', runHours: '1.0', idleHours: '0.0' },
          '15-16': { cycleTime: '27s', production: '140', rejection: '2', lumps: '1', runHours: '1.0', idleHours: '0.0' },
          '16-17': { cycleTime: '26s', production: '150', rejection: '1', lumps: '0', runHours: '1.0', idleHours: '0.0' },
          '17-18': { cycleTime: '28s', production: '135', rejection: '3', lumps: '1', runHours: '0.9', idleHours: '0.1' },
          '18-19': { cycleTime: '24s', production: '155', rejection: '1', lumps: '0', runHours: '1.0', idleHours: '0.0' },
          '19-20': { cycleTime: '26s', production: '148', rejection: '2', lumps: '1', runHours: '1.0', idleHours: '0.0' },
          '20-21': { cycleTime: '25s', production: '152', rejection: '1', lumps: '0', runHours: '1.0', idleHours: '0.0' },
          '21-22': { cycleTime: '27s', production: '142', rejection: '2', lumps: '1', runHours: '0.9', idleHours: '0.1' }
        },
        summary: {
          runningHours: '7.80',
          idleHours: '0.20',
          rejectionKgs: '18 Kg',
          lumpsKgs: '0.2Kg'
        }
      },
      night: {
        operatorName: 'Michael Torres',
        qualityName: 'Standard Quality',
        supervisorName: 'Anna Rodriguez',
        productGrams: '400g',
        runningCavity: '6 Cavity',
        noOfPcs: '800',
        batchNoStarts: 'N001',
        batchNoEnds: 'N080',
        targetBagBox: '40 Boxes',
        timeSlots: {
          '22-23': { cycleTime: '35s', production: '95', rejection: '4', lumps: '2', runHours: '0.8', idleHours: '0.2' },
          '23-0': { cycleTime: '38s', production: '88', rejection: '5', lumps: '3', runHours: '0.7', idleHours: '0.3' },
          '0-1': { cycleTime: '33s', production: '105', rejection: '3', lumps: '1', runHours: '0.9', idleHours: '0.1' },
          '1-2': { cycleTime: '36s', production: '92', rejection: '4', lumps: '2', runHours: '0.8', idleHours: '0.2' },
          '2-3': { cycleTime: '34s', production: '98', rejection: '3', lumps: '1', runHours: '0.9', idleHours: '0.1' },
          '3-4': { cycleTime: '37s', production: '85', rejection: '6', lumps: '3', runHours: '0.7', idleHours: '0.3' },
          '4-5': { cycleTime: '32s', production: '110', rejection: '2', lumps: '1', runHours: '1.0', idleHours: '0.0' },
          '5-6': { cycleTime: '35s', production: '102', rejection: '3', lumps: '2', runHours: '0.9', idleHours: '0.1' }
        },
        summary: {
          runningHours: '6.70',
          idleHours: '1.30',
          rejectionKgs: '42 Kg',
          lumpsKgs: '0.8Kg'
        }
      }
    };

    return shiftDataMap[shift] || shiftDataMap.morning;
  };

  // Main data state for display
  const [shiftData, setShiftData] = useState(getShiftData(currentShift));

  // Update shift data when currentShift changes
  useEffect(() => {
    setShiftData(getShiftData(currentShift));
  }, [currentShift]);





  // Form data state for editing (initialized with current data when modal opens)
  const [formData, setFormData] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTimeSlotChange = (timeSlot, field, value) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: {
        ...prev.timeSlots,
        [timeSlot]: {
          ...prev.timeSlots[timeSlot],
          [field]: value
        }
      }
    }));
  };

  const handleEdit = () => {
    // Initialize form data with current shift data
    setFormData({ ...shiftData });
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    // Update the main shift data with form data
    setShiftData({ ...formData });
    setIsEditMode(false);
    // Here you would typically save the data to a backend
    console.log('Saving data:', formData);
  };

  const handleCloseModal = () => {
    setIsEditMode(false);
  };



  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shift Details</h1>
        <button className={styles.editButton} onClick={handleEdit}>Edit</button>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailsSection}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Operator Name :</label>
            <span className={styles.displayValue}>{shiftData.operatorName}</span>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Quality Name :</label>
            <span className={styles.displayValue}>{shiftData.qualityName}</span>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Supervisor Name :</label>
            <span className={styles.displayValue}>{shiftData.supervisorName}</span>
          </div>
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Product / Grams:</label>
            <span className={styles.displayValue}>{shiftData.productGrams}</span>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Running Cavity:</label>
            <span className={styles.displayValue}>{shiftData.runningCavity}</span>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>No. Of Pcs :</label>
            <span className={styles.displayValue}>{shiftData.noOfPcs}</span>
          </div>
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Batch No. Starts :</label>
            <span className={styles.displayValue}>{shiftData.batchNoStarts}</span>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Batch No. Ends :</label>
            <span className={styles.displayValue}>{shiftData.batchNoEnds}</span>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Target Bag/Box :</label>
            <span className={styles.displayValue}>{shiftData.targetBagBox}</span>
          </div>
        </div>
      </div>

      <div className={styles.timeTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.timeHeader}>Time</th>
              <th className={styles.timeSlot}>6-7</th>
              <th className={styles.timeSlot}>7-8</th>
              <th className={styles.timeSlot}>8-9</th>
              <th className={styles.timeSlot}>9-10</th>
              <th className={styles.timeSlot}>10-11</th>
              <th className={styles.timeSlot}>11-12</th>
              <th className={styles.timeSlot}>12-13</th>
              <th className={styles.timeSlot}>13-14</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.rowLabel}>Cycle time</td>
              <td className={styles.cell}>{shiftData.timeSlots['6-7']?.cycleTime}</td>
              <td className={styles.cell}>{shiftData.timeSlots['7-8']?.cycleTime}</td>
              <td className={styles.cell}>{shiftData.timeSlots['8-9']?.cycleTime}</td>
              <td className={styles.cell}>{shiftData.timeSlots['9-10']?.cycleTime}</td>
              <td className={styles.cell}>{shiftData.timeSlots['10-11']?.cycleTime}</td>
              <td className={styles.cell}>{shiftData.timeSlots['11-12']?.cycleTime}</td>
              <td className={styles.cell}>{shiftData.timeSlots['12-13']?.cycleTime}</td>
              <td className={styles.cell}>{shiftData.timeSlots['13-14']?.cycleTime}</td>
            </tr>
            <tr>
              <td className={styles.rowLabel}>Production</td>
              <td className={styles.cell}>{shiftData.timeSlots['6-7']?.production}</td>
              <td className={styles.cell}>{shiftData.timeSlots['7-8']?.production}</td>
              <td className={styles.cell}>{shiftData.timeSlots['8-9']?.production}</td>
              <td className={styles.cell}>{shiftData.timeSlots['9-10']?.production}</td>
              <td className={styles.cell}>{shiftData.timeSlots['10-11']?.production}</td>
              <td className={styles.cell}>{shiftData.timeSlots['11-12']?.production}</td>
              <td className={styles.cell}>{shiftData.timeSlots['12-13']?.production}</td>
              <td className={styles.cell}>{shiftData.timeSlots['13-14']?.production}</td>
            </tr>
            <tr>
              <td className={styles.rowLabel}>Rejection</td>
              <td className={styles.cell}>{shiftData.timeSlots['6-7']?.rejection}</td>
              <td className={styles.cell}>{shiftData.timeSlots['7-8']?.rejection}</td>
              <td className={styles.cell}>{shiftData.timeSlots['8-9']?.rejection}</td>
              <td className={styles.cell}>{shiftData.timeSlots['9-10']?.rejection}</td>
              <td className={styles.cell}>{shiftData.timeSlots['10-11']?.rejection}</td>
              <td className={styles.cell}>{shiftData.timeSlots['11-12']?.rejection}</td>
              <td className={styles.cell}>{shiftData.timeSlots['12-13']?.rejection}</td>
              <td className={styles.cell}>{shiftData.timeSlots['13-14']?.rejection}</td>
            </tr>
            <tr>
              <td className={styles.rowLabel}>Lumps</td>
              <td className={styles.cell}>{shiftData.timeSlots['6-7']?.lumps}</td>
              <td className={styles.cell}>{shiftData.timeSlots['7-8']?.lumps}</td>
              <td className={styles.cell}>{shiftData.timeSlots['8-9']?.lumps}</td>
              <td className={styles.cell}>{shiftData.timeSlots['9-10']?.lumps}</td>
              <td className={styles.cell}>{shiftData.timeSlots['10-11']?.lumps}</td>
              <td className={styles.cell}>{shiftData.timeSlots['11-12']?.lumps}</td>
              <td className={styles.cell}>{shiftData.timeSlots['12-13']?.lumps}</td>
              <td className={styles.cell}>{shiftData.timeSlots['13-14']?.lumps}</td>
            </tr>
            <tr>
              <td className={styles.rowLabel}>Run Hours</td>
              <td className={styles.cell}>{shiftData.timeSlots['6-7']?.runHours}</td>
              <td className={styles.cell}>{shiftData.timeSlots['7-8']?.runHours}</td>
              <td className={styles.cell}>{shiftData.timeSlots['8-9']?.runHours}</td>
              <td className={styles.cell}>{shiftData.timeSlots['9-10']?.runHours}</td>
              <td className={styles.cell}>{shiftData.timeSlots['10-11']?.runHours}</td>
              <td className={styles.cell}>{shiftData.timeSlots['11-12']?.runHours}</td>
              <td className={styles.cell}>{shiftData.timeSlots['12-13']?.runHours}</td>
              <td className={styles.cell}>{shiftData.timeSlots['13-14']?.runHours}</td>
            </tr>
            <tr>
              <td className={styles.rowLabel}>Idle Hours</td>
              <td className={styles.cell}>{shiftData.timeSlots['6-7']?.idleHours}</td>
              <td className={styles.cell}>{shiftData.timeSlots['7-8']?.idleHours}</td>
              <td className={styles.cell}>{shiftData.timeSlots['8-9']?.idleHours}</td>
              <td className={styles.cell}>{shiftData.timeSlots['9-10']?.idleHours}</td>
              <td className={styles.cell}>{shiftData.timeSlots['10-11']?.idleHours}</td>
              <td className={styles.cell}>{shiftData.timeSlots['11-12']?.idleHours}</td>
              <td className={styles.cell}>{shiftData.timeSlots['12-13']?.idleHours}</td>
              <td className={styles.cell}>{shiftData.timeSlots['13-14']?.idleHours}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.bottomTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.expenseHeader}>Expense</th>
              <th className={styles.bottomCell}>Jobbing</th>
              <th className={styles.bottomCell}>M Box</th>
              <th className={styles.bottomCell}>Hold KGS</th>
              <th className={styles.bottomCell}>L Box</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.rowLabel}>Running Hours</td>
              <td className={styles.bottomCell}>{shiftData.summary?.runningHours}</td>
              <td className={styles.bottomCell}>Rejection KGS</td>
              <td className={styles.bottomCell}>{shiftData.summary?.rejectionKgs}</td>
            </tr>
            <tr>
              <td className={styles.rowLabel}>Idle Hours</td>
              <td className={styles.bottomCell}>{shiftData.summary?.idleHours}</td>
              <td className={styles.bottomCell}>Lumps KGS</td>
              <td className={styles.bottomCell}>{shiftData.summary?.lumpsKgs}</td>
            </tr>
            <tr>
              <td className={styles.rowLabel}>Shift Supervision Signature :</td>
              <td className={styles.bottomCell}></td>
              <td className={styles.bottomCell}></td>
              <td className={styles.bottomCell}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditMode && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Shift Details</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.editSection}>
                <div className={styles.editField}>
                  <label className={styles.editLabel}>Operator Name:</label>
                  <input
                    type="text"
                    className={styles.editInput}
                    value={formData.operatorName || ''}
                    onChange={(e) => handleInputChange('operatorName', e.target.value)}
                  />
                </div>
                <div className={styles.editField}>
                  <label className={styles.editLabel}>Quality Name:</label>
                  <input
                    type="text"
                    className={styles.editInput}
                    value={formData.qualityName || ''}
                    onChange={(e) => handleInputChange('qualityName', e.target.value)}
                  />
                </div>
                <div className={styles.editField}>
                  <label className={styles.editLabel}>Supervisor Name:</label>
                  <input
                    type="text"
                    className={styles.editInput}
                    value={formData.supervisorName || ''}
                    onChange={(e) => handleInputChange('supervisorName', e.target.value)}
                  />
                </div>
                <div className={styles.editField}>
                  <label className={styles.editLabel}>Product / Grams:</label>
                  <input
                    type="text"
                    className={styles.editInput}
                    value={formData.productGrams || ''}
                    onChange={(e) => handleInputChange('productGrams', e.target.value)}
                  />
                </div>
                <div className={styles.editField}>
                  <label className={styles.editLabel}>Running Cavity:</label>
                  <input
                    type="text"
                    className={styles.editInput}
                    value={formData.runningCavity || ''}
                    onChange={(e) => handleInputChange('runningCavity', e.target.value)}
                  />
                </div>
                <div className={styles.editField}>
                  <label className={styles.editLabel}>No. Of Pcs:</label>
                  <input
                    type="text"
                    className={styles.editInput}
                    value={formData.noOfPcs || ''}
                    onChange={(e) => handleInputChange('noOfPcs', e.target.value)}
                  />
                </div>
                <div className={styles.editField}>
                  <label className={styles.editLabel}>Target Bag/Box:</label>
                  <input
                    type="text"
                    className={styles.editInput}
                    value={formData.targetBagBox || ''}
                    onChange={(e) => handleInputChange('targetBagBox', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.timeSlotEdit}>
                {formData.timeSlots && Object.entries(formData.timeSlots).map(([timeSlot, data]) => (
                  <div key={timeSlot} className={styles.timeSlotSection}>
                    <h3 className={styles.timeSlotTitle}>{timeSlot}:</h3>
                    <div className={styles.timeSlotFields}>
                      <div className={styles.editField}>
                        <label className={styles.editLabel}>CycleTime:</label>
                        <input
                          type="text"
                          className={styles.editInput}
                          value={data?.cycleTime || ''}
                          onChange={(e) => handleTimeSlotChange(timeSlot, 'cycleTime', e.target.value)}
                        />
                      </div>
                      <div className={styles.editField}>
                        <label className={styles.editLabel}>Production:</label>
                        <input
                          type="text"
                          className={styles.editInput}
                          value={data?.production || ''}
                          onChange={(e) => handleTimeSlotChange(timeSlot, 'production', e.target.value)}
                        />
                      </div>
                      <div className={styles.editField}>
                        <label className={styles.editLabel}>Rejection:</label>
                        <input
                          type="text"
                          className={styles.editInput}
                          value={data?.rejection || ''}
                          onChange={(e) => handleTimeSlotChange(timeSlot, 'rejection', e.target.value)}
                        />
                      </div>
                      <div className={styles.editField}>
                        <label className={styles.editLabel}>Lumps:</label>
                        <input
                          type="text"
                          className={styles.editInput}
                          value={data?.lumps || ''}
                          onChange={(e) => handleTimeSlotChange(timeSlot, 'lumps', e.target.value)}
                        />
                      </div>
                      <div className={styles.editField}>
                        <label className={styles.editLabel}>Run Hours:</label>
                        <input
                          type="text"
                          className={styles.editInput}
                          value={data?.runHours || ''}
                          onChange={(e) => handleTimeSlotChange(timeSlot, 'runHours', e.target.value)}
                        />
                      </div>
                      <div className={styles.editField}>
                        <label className={styles.editLabel}>Idle Hours:</label>
                        <input
                          type="text"
                          className={styles.editInput}
                          value={data?.idleHours || ''}
                          onChange={(e) => handleTimeSlotChange(timeSlot, 'idleHours', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.summaryEdit}>
                <h3 className={styles.summaryTitle}>Summary:</h3>
                <div className={styles.summaryFields}>
                  <div className={styles.editField}>
                    <label className={styles.editLabel}>Running Hours:</label>
                    <input
                      type="text"
                      className={styles.editInput}
                      value={formData.summary?.runningHours || ''}
                      onChange={(e) => handleInputChange('summary', { ...formData.summary, runningHours: e.target.value })}
                    />
                  </div>
                  <div className={styles.editField}>
                    <label className={styles.editLabel}>Idle Hours:</label>
                    <input
                      type="text"
                      className={styles.editInput}
                      value={formData.summary?.idleHours || ''}
                      onChange={(e) => handleInputChange('summary', { ...formData.summary, idleHours: e.target.value })}
                    />
                  </div>
                  <div className={styles.editField}>
                    <label className={styles.editLabel}>Rejection KGS:</label>
                    <input
                      type="text"
                      className={styles.editInput}
                      value={formData.summary?.rejectionKgs || ''}
                      onChange={(e) => handleInputChange('summary', { ...formData.summary, rejectionKgs: e.target.value })}
                    />
                  </div>
                  <div className={styles.editField}>
                    <label className={styles.editLabel}>Lumps KGS:</label>
                    <input
                      type="text"
                      className={styles.editInput}
                      value={formData.summary?.lumpsKgs || ''}
                      onChange={(e) => handleInputChange('summary', { ...formData.summary, lumpsKgs: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.editActions}>
                <button className={styles.saveButton} onClick={handleSaveEdit}>
                  Save Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShiftDetails;
