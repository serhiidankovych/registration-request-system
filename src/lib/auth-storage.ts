const clientSideDecode = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    return null;
  }
};

export const AuthStorage = {
  setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  },

  getPayload(): {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null {
    if (typeof window !== "undefined") {
      const token = this.getToken();
      if (token) {
        return clientSideDecode(token);
      }
    }
    return null;
  },

  clearAuth() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  },
};
