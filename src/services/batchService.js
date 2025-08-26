// Mock batch database - in a real app, this would be an API call
const mockBatches = [
  {
    id: 1,
    batchCode: 'Batch Code 1',
    batchName: 'Premium Bottle Batch A',
    performWeight: '25.5',
    neckSize: '28mm',
    numberOfPieces: '1000',
    qcPassed: 'Yes',
    createdDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 2,
    batchCode: 'Batch Code 2',
    batchName: 'Standard Container Batch B',
    performWeight: '30.2',
    neckSize: '32mm',
    numberOfPieces: '750',
    qcPassed: 'Yes',
    createdDate: '2024-01-16',
    status: 'Active'
  },
  {
    id: 3,
    batchCode: 'Batch Code 3',
    batchName: 'Eco-Friendly Jar Batch C',
    performWeight: '22.8',
    neckSize: '25mm',
    numberOfPieces: '1200',
    qcPassed: 'Yes',
    createdDate: '2024-01-17',
    status: 'Active'
  },
  {
    id: 4,
    batchCode: 'Batch Code 4',
    batchName: 'Large Bottle Batch D',
    performWeight: '45.0',
    neckSize: '38mm',
    numberOfPieces: '500',
    qcPassed: 'Yes',
    createdDate: '2024-01-18',
    status: 'Active'
  },
  {
    id: 5,
    batchCode: 'Batch Code 5',
    batchName: 'Small Container Batch E',
    performWeight: '15.3',
    neckSize: '20mm',
    numberOfPieces: '2000',
    qcPassed: 'Yes',
    createdDate: '2024-01-19',
    status: 'Active'
  },
  {
    id: 6,
    batchCode: 'Batch Code 6',
    batchName: 'Specialty Tube Batch F',
    performWeight: '8.7',
    neckSize: '15mm',
    numberOfPieces: '3000',
    qcPassed: 'Yes',
    createdDate: '2024-01-20',
    status: 'Active'
  },
  {
    id: 7,
    batchCode: 'Batch Code 7',
    batchName: 'Industrial Container Batch G',
    performWeight: '55.2',
    neckSize: '45mm',
    numberOfPieces: '300',
    qcPassed: 'Yes',
    createdDate: '2024-01-21',
    status: 'Active'
  },
  {
    id: 8,
    batchCode: 'Batch Code 8',
    batchName: 'Medical Bottle Batch H',
    performWeight: '18.9',
    neckSize: '22mm',
    numberOfPieces: '1500',
    qcPassed: 'Yes',
    createdDate: '2024-01-22',
    status: 'Active'
  },
  {
    id: 9,
    batchCode: 'Batch Code 9',
    batchName: 'Food Grade Jar Batch I',
    performWeight: '28.4',
    neckSize: '30mm',
    numberOfPieces: '800',
    qcPassed: 'Yes',
    createdDate: '2024-01-23',
    status: 'Active'
  },
  {
    id: 10,
    batchCode: 'Batch Code 10',
    batchName: 'Export Quality Batch J',
    performWeight: '35.6',
    neckSize: '35mm',
    numberOfPieces: '600',
    qcPassed: 'Yes',
    createdDate: '2024-01-24',
    status: 'Active'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const batchService = {
  // Find batch by code or name
  async findBatch(searchTerm) {
    await delay(300); // Simulate API call
    
    const batch = mockBatches.find(b => 
      b.batchCode.toLowerCase() === searchTerm.toLowerCase() ||
      b.batchName.toLowerCase() === searchTerm.toLowerCase()
    );
    
    return batch || null;
  },

  // Get all batches
  async getAllBatches() {
    await delay(200);
    return mockBatches;
  },

  // Parse QR code data (assuming QR contains batch information)
  parseQRData(qrData) {
    try {
      // Try to parse as JSON first (if QR contains structured data)
      const parsed = JSON.parse(qrData);
      if (parsed.batchCode || parsed.batchId) {
        return {
          batchCode: parsed.batchCode || `Batch Code ${parsed.batchId}`,
          batchName: parsed.batchName || null
        };
      }
    } catch (e) {
      // If not JSON, treat as plain text batch code
      return {
        batchCode: qrData.trim(),
        batchName: null
      };
    }
    
    return null;
  }
};
