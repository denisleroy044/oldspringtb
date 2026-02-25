// Auth service with all required functions
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

// Notification storage
let notifications: any[] = [];

// Auth functions
export const getCurrentUser = async (): Promise<User | null> => {
  return users[0];
};

export const logout = async (): Promise<void> => {
  console.log('User logged out');
};

export const login = async (email: string, password: string): Promise<User> => {
  const user = users.find(u => u.email === email);
  if (!user) throw new Error('User not found');
  return user;
};

// User management
export const getUserById = async (id: string): Promise<User | null> => {
  return users.find(u => u.id === id) || null;
};

export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  users[0] = { ...users[0], ...data };
  return users[0];
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
  return true;
};

export const updateUserBalance = async (userId: string, newBalance: number): Promise<User> => {
  const user = users.find(u => u.id === userId);
  if (user) {
    user.balance = newBalance;
  }
  return user!;
};

// 2FA
export const toggleTwoFactor = async (enabled: boolean): Promise<boolean> => {
  users[0].twoFactorEnabled = enabled;
  return enabled;
};

// Notifications
export const addUserNotification = async (userId: string, notification: any): Promise<void> => {
  notifications.push({
    id: Date.now().toString(),
    userId,
    ...notification,
    createdAt: new Date()
  });
};

export const updateNotificationPreferences = async (prefs: any): Promise<any> => {
  users[0].notificationPreferences = prefs;
  return prefs;
};

export const getUserNotifications = async (userId: string): Promise<any[]> => {
  return notifications.filter(n => n.userId === userId);
};

// Avatar
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

export const createUser = async (userData: any): Promise<User> => {
  const newUser = {
    id: (users.length + 1).toString(),
    ...userData,
    balance: 0,
    twoFactorEnabled: false,
    notificationPreferences: {
      email: true,
      push: true,
      sms: false
    }
  };
  users.push(newUser);
  return newUser;
};
