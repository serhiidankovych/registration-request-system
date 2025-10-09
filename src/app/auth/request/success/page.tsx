"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRegistrationStore } from "@/store/registrationStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Mail } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const { baseData, reset } = useRegistrationStore();
  const [isValid, setIsValid] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (isNavigating) return;

    if (!baseData?.email) {
      router.push("/auth/request");
      return;
    }
    setIsValid(true);
  }, [baseData, router, isNavigating]);

  const handleReturnHome = () => {
    setIsNavigating(true);
    reset();
    router.push("/");
  };

  if (!isValid || !baseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Verifying submission...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Request Submitted Successfully!
          </CardTitle>
          <CardDescription className="text-base">
            Your registration request has been received.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 animate-in slide-in-from-bottom-2 duration-500">
              <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Email Confirmation</p>
                <p className="text-sm text-muted-foreground">
                  A confirmation has been sent to{" "}
                  <strong className="text-foreground">{baseData.email}</strong>.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Don&apos;t see it? Check your spam folder.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Button onClick={handleReturnHome} className="w-full">
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
