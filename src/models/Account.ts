import mongoose from 'mongoose';

export interface IAccount {
  userId: mongoose.Types.ObjectId;
  accountNumber: string;
  type: string;
  balance: number;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new mongoose.Schema<IAccount>({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  accountNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  type: { 
    type: String, 
    default: 'CHECKING' 
  },
  balance: { 
    type: Number, 
    default: 0 
  },
  currency: { 
    type: String, 
    default: 'USD' 
  },
  status: { 
    type: String, 
    default: 'ACTIVE' 
  }
}, {
  timestamps: true
});

export const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);
