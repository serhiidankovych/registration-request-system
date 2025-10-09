"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRegistrationStore } from "@/store/registrationStore";
import { useSubmitRegistrationRequest } from "@/hooks/useRegistrationRequest";
import { useApiError } from "@/hooks/useApiError";
import { ApiErrorAlert } from "@/components/common/ApiErrorAlert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  FlaskConical,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { baseData, setBaseData, reset } = useRegistrationStore();
  const [selectedRole, setSelectedRole] = useState<
    "user" | "researcher" | null
  >(null);
  const submitMutation = useSubmitRegistrationRequest();
  const { errorState, handleError, clearError } = useApiError();

  useEffect(() => {
    if (!baseData) {
      router.push("/auth/request");
    }
  }, [baseData, router]);

  const handleRoleSelect = (role: "user" | "researcher") => {
    setSelectedRole(role);
    clearError();
  };

  const handleContinue = async () => {
    if (!selectedRole || !baseData) return;

    if (selectedRole === "researcher") {
      setBaseData({ ...baseData, requestedRole: "researcher" });
      router.push("/auth/request/researcher");
    } else {
      try {
        clearError();
        await submitMutation.mutateAsync({
          ...baseData,
          requestedRole: "user",
          fullName: baseData.fullName || "",
          email: baseData.email || "",
          phoneNumber: baseData.phoneNumber || "",
          about: baseData.about || "",
          consentGiven: baseData.consentGiven || false,
        });
        reset();
        router.push("/auth/request/success");
      } catch (error: unknown) {
        handleError(error, { email: baseData.email });
      }
    }
  };

  if (!baseData) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Select Your Role</CardTitle>
          <CardDescription className="text-base">
            Choose the type of access you need
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {errorState && (
            <ApiErrorAlert errorState={errorState} onClear={clearError} />
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedRole === "user"
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleRoleSelect("user")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <User className="h-10 w-10 text-primary" />
                  {selectedRole === "user" && (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  )}
                </div>
                <CardTitle className="text-2xl">Regular User</CardTitle>
                <CardDescription>Standard platform access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">{/* ... */}</CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedRole === "researcher"
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleRoleSelect("researcher")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <FlaskConical className="h-10 w-10 text-primary" />
                  {selectedRole === "researcher" && (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  )}
                </div>
                <CardTitle className="text-2xl">Researcher</CardTitle>
                <CardDescription>Enhanced academic access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">{/* ... */}</CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => router.push("/auth/request")}
              className="w-full"
              disabled={submitMutation.isPending}
            >
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedRole || submitMutation.isPending}
              className="w-full"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
