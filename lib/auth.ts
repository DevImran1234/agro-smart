const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface User {
  id: string
  username: string
  email: string
  role: "farmer" | "employee" | "admin"
}

export interface AuthResponse {
  token: string
  user: User
}

export class AuthService {
  static async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    return response.json()
  }

  static async signup(userData: {
    username: string
    email: string
    password: string
    encryptionKey: string
    role: "farmer" | "employee" | "admin"
  }): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Signup failed")
    }

    return response.json()
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to send reset email")
    }

    return response.json()
  }

  static async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Password reset failed")
    }

    return response.json()
  }

  static setToken(token: string) {
    localStorage.setItem("auth_token", token)
  }

  static getToken(): string | null {
    return localStorage.getItem("auth_token")
  }

  static removeToken() {
    localStorage.removeItem("auth_token")
  }

  static setUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user))
  }

  static getUser(): User | null {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }

  static removeUser() {
    localStorage.removeItem("user")
  }

  static logout() {
    this.removeToken()
    this.removeUser()
  }
}
