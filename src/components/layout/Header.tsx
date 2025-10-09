"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut } from "lucide-react";

interface UserPayload {
  name: string;
  email: string;
  role: string;
}

interface HeaderProps {
  user?: UserPayload | null;
  onLogout?: () => void;
}

const UserNav = ({
  user,
  onLogout,
}: {
  user: UserPayload;
  onLogout: () => void;
}) => (
  <div className="flex items-center space-x-4">
    <div className="flex items-center space-x-3">
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`}
          alt={user.name}
        />
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>
      <div className="hidden sm:block">
        <div className="font-semibold text-sm">{user.name}</div>
        <div className="text-xs text-muted-foreground">{user.email}</div>
      </div>
    </div>
    <Button variant="outline" size="sm" onClick={onLogout}>
      <LogOut className="h-4 w-4 sm:mr-2" />
      <span className="hidden sm:inline">Sign Out</span>
    </Button>
  </div>
);

const PublicNav = () => (
  <Link href="/auth/login">
    <Button variant="outline" size="sm">
      <LogIn className="mr-2 h-4 w-4" />
      Login
    </Button>
  </Link>
);

export const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
          >
            registration-request-system
          </Link>

          <nav>
            {user && onLogout ? (
              <UserNav user={user} onLogout={onLogout} />
            ) : (
              <PublicNav />
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
