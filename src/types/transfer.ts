export interface TransferDetails {
  id?: string;
  recipientAccountNumber: string;
  recipientAccountName: string;
  amount: number;
  bankName: string;
  swiftCode: string;
  routingNumber: string;
  description?: string;
}

export interface TransferStatus {
  id: string;
  owner: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  securityCodes?: {
    level1: boolean;
    level2: boolean;
    level3: boolean;
    level4: boolean;
  };
}

export interface TransferProgress {
  percentage: number;
  currentStep: number;
  totalSteps: number;
  message: string;
  securityCodeRequired?: boolean;
  securityCodeLevel?: number;
}
