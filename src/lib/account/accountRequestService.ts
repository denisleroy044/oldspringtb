import { AccountRequest, AccountType, AccountRequestStatus, AdminNote } from '@/types/account'
import { addUserNotification } from '@/lib/auth/authService'
import { accountProducts } from './products'

// Store account requests (in production, use database)
const requestStore: Map<string, AccountRequest[]> = new Map()

// Get all pending requests (admin)
export const getPendingRequests = (): AccountRequest[] => {
  const allRequests: AccountRequest[] = []
  requestStore.forEach(requests => {
    allRequests.push(...requests.filter(r => r.status === 'pending'))
  })
  return allRequests.sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  )
}

// Get user's requests
export const getUserRequests = (userId: string): AccountRequest[] => {
  return requestStore.get(userId) || []
}

// Submit new account request
export const submitAccountRequest = (
  userId: string,
  userName: string,
  userEmail: string,
  type: AccountType,
  accountName: string,
  initialDeposit: number
): { success: boolean; request?: AccountRequest; message?: string } => {
  
  const product = accountProducts.find(p => p.type === type)
  if (!product) {
    return { success: false, message: 'Invalid account type' }
  }

  if (initialDeposit < product.minimumDeposit) {
    return { success: false, message: `Minimum deposit of $${product.minimumDeposit} required` }
  }

  const newRequest: AccountRequest = {
    id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userName,
    userEmail,
    type,
    accountName: accountName || `${product.name} - ${userName}`,
    initialDeposit,
    status: 'pending',
    submittedAt: new Date().toISOString()
  }

  const userRequests = requestStore.get(userId) || []
  userRequests.push(newRequest)
  requestStore.set(userId, userRequests)

  // Notify user
  addUserNotification(userId, {
    title: '📋 Account Request Submitted',
    message: `Your request to open a ${product.name} has been submitted for review. You'll hear back within 1-2 business days.`,
    type: 'info'
  })

  return { success: true, request: newRequest }
}

// Approve request (admin)
export const approveRequest = (
  requestId: string,
  userId: string,
  adminId: string,
  adminName: string,
  notes?: string
): { success: boolean; message?: string } => {
  
  // Find the request
  let foundRequest: AccountRequest | undefined
  let foundUserId: string | undefined

  for (const [uid, requests] of requestStore.entries()) {
    const req = requests.find(r => r.id === requestId)
    if (req) {
      foundRequest = req
      foundUserId = uid
      break
    }
  }

  if (!foundRequest || !foundUserId) {
    return { success: false, message: 'Request not found' }
  }

  // Update request status
  foundRequest.status = 'approved'
  foundRequest.reviewedAt = new Date().toISOString()
  foundRequest.reviewedBy = adminName

  if (notes) {
    if (!foundRequest.notes) foundRequest.notes = []
    foundRequest.notes.push({
      id: `note_${Date.now()}`,
      adminId,
      adminName,
      content: notes,
      createdAt: new Date().toISOString()
    })
  }

  // Save back to store
  const userRequests = requestStore.get(foundUserId) || []
  const index = userRequests.findIndex(r => r.id === requestId)
  if (index !== -1) {
    userRequests[index] = foundRequest
    requestStore.set(foundUserId, userRequests)
  }

  // Notify user
  addUserNotification(foundUserId, {
    title: '✅ Account Request Approved',
    message: `Your request to open a ${foundRequest.type} account has been approved! The account will be opened within 24 hours.`,
    type: 'success'
  })

  return { success: true }
}

// Reject request (admin)
export const rejectRequest = (
  requestId: string,
  userId: string,
  adminId: string,
  adminName: string,
  reason: string
): { success: boolean; message?: string } => {
  
  // Find the request
  let foundRequest: AccountRequest | undefined
  let foundUserId: string | undefined

  for (const [uid, requests] of requestStore.entries()) {
    const req = requests.find(r => r.id === requestId)
    if (req) {
      foundRequest = req
      foundUserId = uid
      break
    }
  }

  if (!foundRequest || !foundUserId) {
    return { success: false, message: 'Request not found' }
  }

  // Update request status
  foundRequest.status = 'rejected'
  foundRequest.reviewedAt = new Date().toISOString()
  foundRequest.reviewedBy = adminName
  foundRequest.rejectionReason = reason

  // Save back to store
  const userRequests = requestStore.get(foundUserId) || []
  const index = userRequests.findIndex(r => r.id === requestId)
  if (index !== -1) {
    userRequests[index] = foundRequest
    requestStore.set(foundUserId, userRequests)
  }

  // Notify user
  addUserNotification(foundUserId, {
    title: '❌ Account Request Rejected',
    message: `Your request to open a ${foundRequest.type} account was rejected. Reason: ${reason}`,
    type: 'warning'
  })

  return { success: true }
}

// Get request statistics (admin)
export const getRequestStats = () => {
  let pending = 0
  let approved = 0
  let rejected = 0

  requestStore.forEach(requests => {
    pending += requests.filter(r => r.status === 'pending').length
    approved += requests.filter(r => r.status === 'approved').length
    rejected += requests.filter(r => r.status === 'rejected').length
  })

  return { pending, approved, rejected }
}
