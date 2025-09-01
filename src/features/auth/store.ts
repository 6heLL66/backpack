import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserDto, TokenDto } from '../../api'

interface AuthState {
  user: UserDto | null
  tokens: TokenDto | null
  isAuthenticated: boolean
}

interface AuthActions {
  login: (user: UserDto, tokens: TokenDto) => Promise<void>
  logout: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,

      login: async (user: UserDto, tokens: TokenDto) => {
        set({ user, tokens, isAuthenticated: true })
      },

      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
