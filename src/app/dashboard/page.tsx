"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthStorage } from "@/lib/auth-storage";

import { Loader2 } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

interface UserPayload {
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    setIsClient(true);
    const payload = AuthStorage.getPayload();
    if (!payload) {
      router.push("/auth/login");
    } else {
      setUser(payload);
    }
  }, [router]);

  const handleLogout = () => {
    AuthStorage.clearAuth();
    router.push("/auth/login");
  };

  if (!isClient || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Welcome back, {user.name}!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
