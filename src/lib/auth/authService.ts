import { User, AuthResponse, LoginCredentials, SignupData } from '@/types/auth'

// Load users from localStorage
export const loadUsers = (): User[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem('bank_users')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading users:', error)
  }
  
  const initialUsers: User[] = []
  localStorage.setItem('bank_users', JSON.stringify(initialUsers))
  return initialUsers
}

// Save users
export const saveUsers = (users: User[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('bank_users', JSON.stringify(users))
}

// Generate account number with prefix
// 45 for personal accounts
// 60 for business accounts
// 70 for premium accounts
const generateAccountNumber = (accountType: string): string => {
  let prefix = '45' // Default for personal
  
  if (accountType === 'business') {
    prefix = '60'
  } else if (accountType === 'premium') {
    prefix = '70'
  }
  
  const middle = Math.floor(10000000 + Math.random() * 90000000).toString()
  const suffix = Math.floor(1000 + Math.random() * 9000).toString()
  
  // Format: XX XXXX XXXX XXXX
  return `${prefix}${middle.slice(0, 4)} ${middle.slice(4, 8)} ${suffix}`
}

// Sign up new user with account type
export const signUp = (data: SignupData & { accountType?: 'personal' | 'business' | 'premium' }): AuthResponse => {
  try {
    const users = loadUsers()
    
    const existingUser = users.find(u => u.email === data.email)
    if (existingUser) {
      return { success: false, message: 'Email already registered' }
    }
    
    if (data.password !== data.confirmPassword) {
      return { success: false, message: 'Passwords do not match' }
    }
    
    if (data.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' }
    }
    
    const accountType = data.accountType || 'personal'
    const accountNumber = generateAccountNumber(accountType)
    
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || '',
      password: data.password,
      accountNumber,
      accountName: `${data.firstName} ${data.lastName}`,
      accountStatus: 'active',
      accountType,
      balance: 0.00,
      avatar: '/assets/img/avatars/default-avatar.png',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isAdmin: false,
      notifications: []
    }
    
    users.push(newUser)
    saveUsers(users)
    
    if (typeof window !== 'undefined') {
      const { password, ...userWithoutPassword } = newUser
      localStorage.setItem('current_user', JSON.stringify(userWithoutPassword))
      document.cookie = `current_user=${JSON.stringify(userWithoutPassword)}; path=/; max-age=86400`;
    }
    
    return { success: true, user: newUser }
  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, message: 'An error occurred during signup' }
  }
}

// Login user
export const login = (credentials: LoginCredentials): AuthResponse => {
  try {
    const users = loadUsers()
    
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password)
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' }
    }
    
    user.lastLogin = new Date().toISOString()
    saveUsers(users)
    
    if (typeof window !== 'undefined') {
      const { password, ...userWithoutPassword } = user
      localStorage.setItem('current_user', JSON.stringify(userWithoutPassword))
      document.cookie = `current_user=${JSON.stringify(userWithoutPassword)}; path=/; max-age=86400`;
    }
    
    return { success: true, user }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, message: 'An error occurred during login' }
  }
}

// Get current user
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('current_user')
  return stored ? JSON.parse(stored) : null
}

// Logout
export const logout = () => {
  localStorage.removeItem('current_user')
  document.cookie = 'current_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
}

// Get user by ID
export const getUserById = (id: string) => {
  const users = loadUsers()
  return users.find(u => u.id === id)
}

// Update user balance
export const updateUserBalance = (userId: string, newBalance: number) => {
  const users = loadUsers()
  const index = users.findIndex(u => u.id === userId)
  if (index !== -1) {
    users[index].balance = newBalance
    saveUsers(users)
    
    const currentUser = getCurrentUser()
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...users[index] }
      const { password, ...userWithoutPassword } = updatedUser
      localStorage.setItem('current_user', JSON.stringify(userWithoutPassword))
    }
  }
}

// Add notification
export const addUserNotification = (userId: string, notification: any) => {
  const users = loadUsers()
  const index = users.findIndex(u => u.id === userId)
  if (index !== -1) {
    if (!users[index].notifications) {
      users[index].notifications = []
    }
    users[index].notifications.push({
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    })
    saveUsers(users)
  }
}
