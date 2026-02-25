// Run this file once to create the admin user
import { loadUsers, saveUsers } from './authService'

export function createAdminUser() {
  const users = loadUsers()
  
  // Check if admin already exists
  const adminExists = users.some(u => u.isAdmin === true)
  
  if (!adminExists) {
    const adminUser = {
      id: 'admin_' + Date.now(),
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@oldspring.com',
      phone: '+1 (555) 000-0000',
      password: 'admin123',
      accountNumber: 'ADMIN001',
      accountName: 'System Administrator',
      accountStatus: 'active',
      accountType: 'business',
      balance: 0,
      avatar: '/assets/img/avatars/admin-avatar.png',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isAdmin: true,
      notifications: []
    }
    
    users.push(adminUser)
    saveUsers(users)
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@oldspring.com')
    console.log('🔑 Password: admin123')
  } else {
    console.log('ℹ️ Admin user already exists')
  }
  
  return adminExists ? 'Admin exists' : 'Admin created'
}
