import Link from "next/link";
import { Button } from "@/components/ui/button";

import { ArrowRight, UserPlus } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Secure Registration & Access Management
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
              This application provides a secure, multi-step registration
              process for different user roles, complete with administrative
              oversight and email notifications.
            </p>
          </div>

          <div className="mt-10 flex justify-center items-center gap-4">
            <Link href="/auth/request">
              <Button size="lg" className="shadow-lg">
                <UserPlus className="mr-2 h-5 w-5" />
                Request Access
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="secondary">
                Admin & User Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
