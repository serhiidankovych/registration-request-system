"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  researcherRegistrationSchema,
  ResearcherRegistrationData,
} from "@/types/registration";
import { useRegistrationStore } from "@/store/registrationStore";
import { useSubmitRegistrationRequest } from "@/hooks/useRegistrationRequest";
import { useApiError } from "@/hooks/useApiError";
import { ApiErrorAlert } from "@/components/common/ApiErrorAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, Shield, Info, User, Mail } from "lucide-react";

export default function ResearcherRequestPage() {
  const router = useRouter();
  const { baseData, setResearcherData } = useRegistrationStore();
  const submitMutation = useSubmitRegistrationRequest();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResearcherRegistrationData>({
    resolver: zodResolver(researcherRegistrationSchema),
    defaultValues: {
      ...baseData,
      requestedRole: "researcher",
    },
  });

  const { errorState, handleError, clearError } = useApiError();

  useEffect(() => {
    if (!baseData || baseData.requestedRole !== "researcher") {
      router.push("/auth/request");
    }
  }, [baseData, router]);

  const onSubmit = async (data: ResearcherRegistrationData) => {
    try {
      clearError();
      setResearcherData(data);
      await submitMutation.mutateAsync(data);
      router.push("/auth/request/success");
    } catch (error: unknown) {
      handleError(error, { email: data.email });
    }
  };
  if (!baseData) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl animate-in fade-in duration-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <CardTitle className="text-3xl font-bold">
                Researcher Verification
              </CardTitle>
              <CardDescription className="text-base">
                Additional information is required for researcher access.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errorState && (
              <ApiErrorAlert errorState={errorState} onClear={clearError} />
            )}
            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Review Your Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{baseData.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{baseData.email}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passportNumber">Passport Number</Label>
                <Input
                  id="passportNumber"
                  {...register("passportNumber")}
                  placeholder="e.g., AB1234567"
                  disabled={submitMutation.isPending}
                  aria-invalid={!!errors.passportNumber}
                />
                {errors.passportNumber && (
                  <p className="text-sm text-red-500">
                    {errors.passportNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="passportIssuedBy">Issuing Authority</Label>
                <Input
                  id="passportIssuedBy"
                  {...register("passportIssuedBy")}
                  placeholder="e.g., Government of Example Country"
                  disabled={submitMutation.isPending}
                  aria-invalid={!!errors.passportIssuedBy}
                />
                {errors.passportIssuedBy && (
                  <p className="text-sm text-red-500">
                    {errors.passportIssuedBy.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="passportIssueDate">Issue Date</Label>
                <Input
                  id="passportIssueDate"
                  type="date"
                  {...register("passportIssueDate")}
                  disabled={submitMutation.isPending}
                  aria-invalid={!!errors.passportIssueDate}
                />
                {errors.passportIssueDate && (
                  <p className="text-sm text-red-500">
                    {errors.passportIssueDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="directorApprovalLetterUrl">
                  Director&apos;s Approval Letter URL
                </Label>
                <Input
                  id="directorApprovalLetterUrl"
                  type="url"
                  {...register("directorApprovalLetterUrl")}
                  placeholder="https://drive.google.com/..."
                  disabled={submitMutation.isPending}
                  aria-invalid={!!errors.directorApprovalLetterUrl}
                />
                {errors.directorApprovalLetterUrl && (
                  <p className="text-sm text-red-500">
                    {errors.directorApprovalLetterUrl.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Provide a public link to the signed approval letter (e.g.,
                  Google Drive, Dropbox).
                </p>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                All information will be securely stored and verified. You will
                receive an email once your request is reviewed.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitMutation.isPending}
                className="w-full"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Verification"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
