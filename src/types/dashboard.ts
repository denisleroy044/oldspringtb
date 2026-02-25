export interface User {
  id: string;
  name: string;
  email: string;
  accountName: string;
  accountStatus: string;
  lastLogin: string;
  avatar: string;
  personalAccount: {
    number: string;
    balance: number;
  };
  checkingAccount: {
    number: string;
    balance: number;
  };
}

export interface Transaction {
  id: number;
  accountName: string;
  accountNumber: string;
  bankName: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  type: 'credit' | 'debit';
}
