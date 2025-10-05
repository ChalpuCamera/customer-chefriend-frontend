import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Development mode customer token
const DEV_CUSTOMER_TOKEN =
  "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI1IiwiZW1haWwiOiJjdXN0b21lckB0ZXN0LmNvbSIsInJvbGUiOiJST0xFX0NVU1RPTUVSIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc1ODg2NDc4MSwiZXhwIjoyMDc0MjI0NzgxfQ.WUH7e88fjaK3FtbtEc1SJZnTuFLEZqyXUzCFBOTarBbxyY9f9eO-1_2PTQ6btgpf";

const DEV_USER: User = {
  id: "5",
  email: "customer@test.com",
  name: "Dev Customer",
  role: "ROLE_CUSTOMER",
};

interface User {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}

interface AuthState {
  // State
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (token: string, refreshToken: string, user: User) => void;
  setTokens: (token: string, refreshToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  updateToken: (token: string) => void;
  checkAuth: () => Promise<boolean>;
  refreshAccessToken: () => Promise<boolean>;
}

// Initialize with dev token in development mode
const getInitialState = () => {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment) {
    return {
      token: DEV_CUSTOMER_TOKEN,
      refreshToken: "dev-refresh-token",
      user: DEV_USER,
      isAuthenticated: true,
      isLoading: false,
    };
  }

  return {
    token: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Initialize with development token if in dev mode
      const isDevelopment = process.env.NODE_ENV === "development";

      // Set dev token in localStorage on initialization (client-side only)
      if (isDevelopment && typeof window !== "undefined") {
        const devState = getInitialState();
        const storageData = {
          state: {
            token: devState.token,
            refreshToken: devState.refreshToken,
            user: devState.user,
            isAuthenticated: devState.isAuthenticated,
          },
          version: 0,
        };

        // Check if localStorage already has data
        const existingData = localStorage.getItem("auth-storage");
        if (!existingData) {
          localStorage.setItem("auth-storage", JSON.stringify(storageData));
        }
      }

      return {
        // Initial State - use dev token in development
        ...getInitialState(),

        // Set authentication data (refreshToken is now stored as httpOnly cookie)
        setAuth: (token: string, refreshToken: string, user: User) => {
          set({
            token,
            refreshToken: refreshToken || "", // Empty string if using httpOnly cookie
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        },

        // Set only tokens
        setTokens: (token: string, refreshToken: string) => {
          set({
            token,
            refreshToken,
            isAuthenticated: true,
          });
        },

        // Clear authentication
        clearAuth: () => {
          // In development mode, don't actually clear - just reset to dev token
          if (process.env.NODE_ENV === "development") {
            const devState = getInitialState();
            set(devState);
            return;
          }

          set({
            token: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          // Clear localStorage
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth-storage");
          }
        },

        // Set loading state
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        // Update access token
        updateToken: (token: string) => {
          set({ token });
        },

        // Check if authenticated (simplified - just check if token exists)
        checkAuth: async () => {
          const { token, clearAuth } = get();

          // In development mode, always return true
          if (process.env.NODE_ENV === "development") {
            return true;
          }

          if (!token) {
            clearAuth();
            return false;
          }

          // Token validation is handled by backend
          return true;
        },

        // Refresh access token using refresh token from cookie
        refreshAccessToken: async () => {
          const { clearAuth, updateToken } = get();

          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/refresh`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include", // Include cookies (refreshToken is in httpOnly cookie)
              }
            );

            if (!response.ok) {
              throw new Error("Token refresh failed");
            }

            const data = await response.json();

            // Update only access token (refresh token remains in httpOnly cookie)
            updateToken(data.result?.accessToken || data.accessToken);
            return true;
          } catch (error) {
            console.error("Token refresh failed:", error);
            clearAuth();
            return false;
          }
        },
      };
    },
    {
      name: "auth-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      skipHydration: false,
    }
  )
);

// Selectors for common use cases
// Note: For better performance and to avoid re-renders,
// use direct selectors like: useAuthStore((state) => state.user)
export const useAuth = () =>
  useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
  }));

export const useAuthActions = () =>
  useAuthStore((state) => ({
    setAuth: state.setAuth,
    clearAuth: state.clearAuth,
    checkAuth: state.checkAuth,
    refreshAccessToken: state.refreshAccessToken,
  }));

export const useUserRole = () => useAuthStore((state) => state.user?.role);
