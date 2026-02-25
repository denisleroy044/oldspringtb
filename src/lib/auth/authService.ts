// Auth service with secure user updates
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  balance: number;
  twoFactorEnabled: boolean;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  avatar?: string;
}

// Mock user data
let users: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Test User',
    role: 'USER',
    balance: 5000,
    twoFactorEnabled: false,
    notificationPreferences: {
      email: true,
      push: true,
      sms: false
    }
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN',
    balance: 10000,
    twoFactorEnabled: true,
    notificationPreferences: {
      email: true,
      push: true,
      sms: true
    }
  }
];

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  return users[0];
};

// Secure update - prevents privilege escalation
export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  // Fields that users are NEVER allowed to update themselves
  const forbiddenFields = ['role', 'balance', 'twoFactorEnabled', 'id'];
  
  // Filter out any forbidden fields
  const safeData = Object.fromEntries(
    Object.entries(data).filter(([key]) => !forbiddenFields.includes(key))
  );
  
  // Update user (in production, this would be a database update)
  users[0] = { ...users[0], ...safeData };
  
  // Log security-relevant changes (for audit)
  if (Object.keys(safeData).length !== Object.keys(data).length) {
    console.warn('Security: Attempted to update forbidden fields', {
      attempted: Object.keys(data),
      allowed: Object.keys(safeData),
      userId: users[0].id
    });
  }
  
  return users[0];
};

// Admin-only function to update user role
export const updateUserRole = async (userId: string, newRole: 'USER' | 'ADMIN'): Promise<User> => {
  // This should only be callable from admin routes with proper authentication
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  
  user.role = newRole;
  return user;
};

// Admin-only function to update user balance
export const updateUserBalance = async (userId: string, newBalance: number): Promise<User> => {
  // This should only be callable from admin routes with proper authentication
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  
  user.balance = newBalance;
  return user;
};

// Rest of your auth functions...
export const logout = async (): Promise<void> => {
  console.log('User logged out');
};

export const login = async (email: string, password: string): Promise<User> => {
  const user = users.find(u => u.email === email);
  if (!user) throw new Error('User not found');
  return user;
};

export const getUserById = async (id: string): Promise<User | null> => {
  return users.find(u => u.id === id) || null;
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
  return true;
};

export const toggleTwoFactor = async (enabled: boolean): Promise<boolean> => {
  users[0].twoFactorEnabled = enabled;
  return enabled;
};

export const addUserNotification = async (userId: string, notification: any): Promise<void> => {
  // Notification logic here
};

export const updateNotificationPreferences = async (prefs: any): Promise<any> => {
  users[0].notificationPreferences = prefs;
  return prefs;
};

export const updateAvatar = async (file: File): Promise<{ url: string }> => {
  return { url: '/avatars/default.png' };
};

// Admin functions
export const loadUsers = async (): Promise<User[]> => {
  return users;
};

export const saveUsers = async (updatedUsers: User[]): Promise<void> => {
  users = updatedUsers;
};
