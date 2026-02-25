// Account request service for tracking account opening requests

export interface AccountRequest {
  id: string
  userId: string
  accountType: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

// In-memory store (replace with database in production)
const requestStore = new Map<string, AccountRequest[]>()

export async function createAccountRequest(data: Omit<AccountRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<AccountRequest> {
  const request: AccountRequest = {
    ...data,
    id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  if (!requestStore.has(data.userId)) {
    requestStore.set(data.userId, [])
  }
  
  requestStore.get(data.userId)!.push(request)
  return request
}

export async function getAccountRequestsByUser(userId: string): Promise<AccountRequest[]> {
  return requestStore.get(userId) || []
}

export async function getAllAccountRequests(): Promise<AccountRequest[]> {
  const allRequests: AccountRequest[] = []
  
  // Use Array.from instead of direct iteration to avoid downlevelIteration issue
  Array.from(requestStore.entries()).forEach(([_, requests]) => {
    allRequests.push(...requests)
  })
  
  return allRequests
}

export async function getAccountRequestById(requestId: string): Promise<AccountRequest | null> {
  let foundRequest: AccountRequest | null = null
  
  // Use Array.from instead of direct iteration
  Array.from(requestStore.entries()).forEach(([_, requests]) => {
    const req = requests.find(r => r.id === requestId)
    if (req) {
      foundRequest = req
    }
  })
  
  return foundRequest
}

export async function updateAccountRequestStatus(
  requestId: string, 
  status: 'approved' | 'rejected'
): Promise<AccountRequest | null> {
  let updatedRequest: AccountRequest | null = null
  let foundUserId: string | undefined

  // Use Array.from instead of direct iteration
  Array.from(requestStore.entries()).forEach(([uid, requests]) => {
    const req = requests.find(r => r.id === requestId)
    if (req) {
      updatedRequest = { ...req, status, updatedAt: new Date() }
      const index = requests.findIndex(r => r.id === requestId)
      if (index !== -1) {
        requestStore.get(uid)![index] = updatedRequest
      }
    }
  })

  return updatedRequest
}

export async function deleteAccountRequest(requestId: string): Promise<boolean> {
  let deleted = false
  let foundUserId: string | undefined

  // Use Array.from instead of direct iteration
  Array.from(requestStore.entries()).forEach(([uid, requests]) => {
    const index = requests.findIndex(r => r.id === requestId)
    if (index !== -1) {
      requests.splice(index, 1)
      deleted = true
      if (requests.length === 0) {
        requestStore.delete(uid)
      }
    }
  })

  return deleted
}
