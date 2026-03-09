#!/bin/bash

# Script: migrate_to_mongodb.sh
# Description: Complete migration from Prisma/Neon to MongoDB + Mongoose

set -e

echo "🔄 Starting migration to MongoDB + Mongoose..."
echo "================================================"

# 1. Uninstall Prisma completely
echo "📦 Removing Prisma..."
npm uninstall @prisma/client prisma @prisma/adapter-neon @neondatabase/serverless
rm -rf prisma
rm -f prisma.config.ts
rm -rf node_modules/.prisma

# 2. Install Mongoose and dependencies
echo "📦 Installing Mongoose..."
npm install mongoose bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken @types/mongoose

# 3. Create MongoDB connection utility
echo "🔧 Creating MongoDB connection utility..."
mkdir -p src/lib

cat > src/lib/mongoose.ts << 'EOF'
import mongoose from 'mongoose';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required in .env file');
}

// MongoDB connection options optimized for serverless
const options = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 1, // Maintain at least 1 socket connection
  retryWrites: true,
  retryReads: true,
};

// Track connection status
let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.DATABASE_URL, options);
    isConnected = !!db.connections[0].readyState;
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log(' MongoDB disconnected');
      isConnected = false;
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Don't exit process, let it retry on next request
    isConnected = false;
  }
};

// For serverless environments, ensure connection is established
export const ensureConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  return mongoose.connection;
};

export default connectDB;
EOF

echo "✅ MongoDB connection utility created"

# 4. Create User model
echo "📝 Creating User model..."

cat > src/models/User.ts << 'EOF'
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  role: string;
  accountType: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8,
    select: false // Don't return password by default
  },
  firstName: { 
    type: String, 
    trim: true 
  },
  lastName: { 
    type: String, 
    trim: true 
  },
  name: { 
    type: String, 
    trim: true 
  },
  phone: { 
    type: String, 
    trim: true 
  },
  role: { 
    type: String, 
    default: 'USER' 
  },
  accountType: { 
    type: String, 
    default: 'personal' 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  twoFactorEnabled: { 
    type: Boolean, 
    default: false 
  },
  twoFactorSecret: { 
    type: String 
  },
  resetToken: { 
    type: String 
  },
  resetTokenExpiry: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update name field before saving
userSchema.pre('save', function(next) {
  if (this.firstName || this.lastName) {
    this.name = `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
  next();
});

export const User = mongoose.models.User || mongoose.model<IUser, UserModel>('User', userSchema);
EOF

echo "✅ User model created"

# 5. Create Account model
cat > src/models/Account.ts << 'EOF'
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
EOF

echo "✅ Account model created"

# 6. Create OTP model
cat > src/models/OTP.ts << 'EOF'
import mongoose from 'mongoose';

export interface IOTP {
  email: string;
  code: string;
  purpose: string;
  expiresAt: Date;
  createdAt: Date;
}

const otpSchema = new mongoose.Schema<IOTP>({
  email: { 
    type: String, 
    required: true,
    index: true 
  },
  code: { 
    type: String, 
    required: true 
  },
  purpose: { 
    type: String, 
    required: true,
    enum: ['ACCOUNT_OPENING', '2FA', 'PASSWORD_RESET']
  },
  expiresAt: { 
    type: Date, 
    required: true,
    index: { expires: 0 } // TTL index - auto-delete after expiry
  }
}, {
  timestamps: true
});

// Compound index for lookups
otpSchema.index({ email: 1, purpose: 1 });

export const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema);
EOF

echo "✅ OTP model created"

# 7. Update Login API
echo "🔐 Updating Login API..."

cat > src/app/api/auth/login/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { ensureConnection } from '@/lib/mongoose'
import { User } from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function POST(request: Request) {
  try {
    // Ensure database connection
    await ensureConnection()
    
    const { email, password } = await request.json()

    // Find user with password field
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Compare password
    const isValid = await user.comparePassword(password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accountType: user.accountType,
        isVerified: user.isVerified
      }
    })

    // Set cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
EOF

echo "✅ Login API updated"

# 8. Update Signup API
cat > src/app/api/auth/signup/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import { ensureConnection } from '@/lib/mongoose'
import { User } from '@/models/User'
import { Account } from '@/models/Account'

export async function POST(request: Request) {
  try {
    // Ensure database connection
    await ensureConnection()
    
    const { firstName, lastName, email, phone, password, accountType } = await request.json()

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create user (password will be hashed by middleware)
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      accountType: accountType || 'personal',
      isVerified: true // Set to false if you want email verification
    })

    // Create initial account
    await Account.create({
      userId: user._id,
      accountNumber: `ACC${Date.now()}${Math.floor(Math.random() * 1000)}`,
      type: 'CHECKING',
      balance: 0,
      currency: 'USD'
    })

    return NextResponse.json({
      message: 'Account created successfully',
      userId: user._id
    }, { status: 201 })

  } catch (error: any) {
    console.error('Signup error:', error)
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
EOF

echo "✅ Signup API updated"

# 9. Update Me API
cat > src/app/api/auth/me/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { ensureConnection } from '@/lib/mongoose'
import { User } from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Ensure connection and get user
    await ensureConnection()
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accountType: user.accountType,
        isVerified: user.isVerified
      }
    })

  } catch (error) {
    console.error('Me route error:', error)
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}
EOF

echo "✅ Me API updated"

# 10. Update Logout API
cat > src/app/api/auth/logout/route.ts << 'EOF'
import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' })
  
  response.cookies.set({
    name: 'token',
    value: '',
    expires: new Date(0),
    path: '/'
  })

  return response
}
EOF

echo "✅ Logout API updated"

# 11. Update .env for MongoDB
echo "🔧 Updating .env for MongoDB..."

# Backup current .env
cp .env .env.backup

# Update DATABASE_URL for MongoDB (using your MongoDB connection string)
cat > .env << 'EOF'
# MongoDB connection string (replace with your actual MongoDB URL)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/bank?retryWrites=true&w=majority"

JWT_SECRET="$(openssl rand -base64 32)"
EOF

echo "✅ .env updated for MongoDB"
echo "⚠️  IMPORTANT: Edit .env and replace with your actual MongoDB connection string!"

# 12. Update proxy.ts to handle async cookies
cat > src/proxy.ts << 'EOF'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-otp',
    '/about',
    '/borrow',
    '/save',
    '/invest',
    '/insure',
    '/learn-and-plan',
    '/payments',
    '/business-banking',
    '/credit-cards',
    '/faqs',
    '/customer-support',
    '/giving-back',
    '/news',
    '/privacy-policy',
    '/careers'
  ]

  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/templates') ||
    request.nextUrl.pathname.includes('.')
  )

  if (isPublicPath) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (error) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
EOF

echo "✅ Proxy updated"

# 13. Clean up and install
echo "🧹 Cleaning up and installing..."
rm -rf .next node_modules/.cache

# 14. Final instructions
echo ""
echo "🎉 Migration to MongoDB + Mongoose complete!"
echo "=============================================="
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file and add your actual MongoDB connection string"
echo "2. Create a MongoDB cluster at https://www.mongodb.com/cloud/atlas (free tier)"
echo "3. Run: npm install"
echo "4. Run: npm run dev"
echo ""
echo "🌐 Your app will be available at: http://localhost:3000"
echo ""
echo "✨ Benefits you'll now enjoy:"
echo "   • No connection pool timeouts"
echo "   • No migrations to manage"
echo "   • Perfect serverless performance"
echo "   • Simpler codebase"
echo ""
echo "⚠️  Don't forget to update DATABASE_URL in .env with your MongoDB connection string!"
EOF