export interface User {
  id: string
  email: string
  full_name: string
  role: 'customer' | 'admin'
  is_active: boolean
}
