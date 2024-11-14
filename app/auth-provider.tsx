"use client";

import { useState, useEffect } from "react";
import { AuthContext } from "./auth";

// Default user data for demo
const DEFAULT_USER = {
  uid: "demo-user-123",
  email: "demo@example.com",
  displayName: "Demo User",
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  providerData: [],
  refreshToken: "demo-token",
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => "demo-token",
  getIdTokenResult: async () => ({
    token: "demo-token",
    authTime: new Date().toISOString(),
    issuedAtTime: new Date().toISOString(),
    expirationTime: new Date(Date.now() + 3600000).toISOString(),
    signInProvider: "demo",
    claims: {},
  }),
  reload: async () => {},
  toJSON: () => ({}),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(DEFAULT_USER);
  const [loading, setLoading] = useState(false);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}