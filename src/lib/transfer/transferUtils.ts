import { TransferDetails, TransferStatus } from '@/types/transfer';

// Mock database - In production, this would be your actual database
interface TransferStore {
  [key: string]: TransferStatus;
}

const transferStore: TransferStore = {};

// Security codes for different levels (in production, these would be generated dynamically)
const SECURITY_CODES = {
  1: '4356',
  2: '3624',
  3: '7534',
  4: '7658'
};

export function createTransfer(owner: string, details: TransferDetails): string {
  const transferId = `TR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  transferStore[transferId] = {
    id: transferId,
    owner,
    amount: details.amount,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    securityCodes: {
      level1: false,
      level2: false,
      level3: false,
      level4: false
    }
  };

  return transferId;
}

export function getPendingTransfer(owner: string): TransferStatus | null {
  const transfers = Object.values(transferStore);
  return transfers.find(t => t.owner === owner && t.status === 'pending') || null;
}

export function getTransferById(id: string): TransferStatus | null {
  return transferStore[id] || null;
}

export function updateTransferStatus(id: string, status: TransferStatus['status']): void {
  if (transferStore[id]) {
    transferStore[id].status = status;
    transferStore[id].updatedAt = new Date().toISOString();
  }
}

export function verifySecurityCode(level: number, code: string): boolean {
  return SECURITY_CODES[level as keyof typeof SECURITY_CODES] === code;
}

export function markSecurityCodeComplete(id: string, level: number): void {
  const transfer = transferStore[id];
  if (transfer && transfer.securityCodes) {
    const levelKey = `level${level}` as keyof typeof transfer.securityCodes;
    transfer.securityCodes[levelKey] = true;
  }
}

export function areAllSecurityCodesComplete(id: string): boolean {
  const transfer = transferStore[id];
  if (!transfer || !transfer.securityCodes) return false;
  
  return Object.values(transfer.securityCodes).every(completed => completed === true);
}

export function completeTransfer(id: string, userBalance: number): { success: boolean; newBalance: number } {
  const transfer = transferStore[id];
  
  if (!transfer || transfer.status !== 'pending') {
    return { success: false, newBalance: userBalance };
  }

  const newBalance = userBalance - transfer.amount;
  
  if (newBalance < 0) {
    return { success: false, newBalance: userBalance };
  }

  transferStore[id].status = 'completed';
  transferStore[id].updatedAt = new Date().toISOString();
  
  return { success: true, newBalance };
}
