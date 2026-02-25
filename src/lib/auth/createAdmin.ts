import { loadUsers, saveUsers } from './authService'
import bcrypt from 'bcryptjs'

export async function createAdminIfNotExists() {
  try {
    // Check if admin already exists - AWAIT the Promise!
    const users = await loadUsers()
    const adminExists = users.some(u => u.role === 'ADMIN')
    
    if (!adminExists) {
      const adminUser = {
        id: `admin_${Date.now()}`,
        email: 'admin@oldspring.com',
        name: 'Admin User',
        role: 'ADMIN' as const,
        password: await bcrypt.hash('Admin123!', 10),
        twoFactorEnabled: false,
        balance: 0,
        notificationPreferences: {
          email: true,
          push: true,
          sms: false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedUsers = [...users, adminUser]
      await saveUsers(updatedUsers)
      console.log('✅ Admin user created successfully')
    }
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}
