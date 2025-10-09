"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  baseRegistrationSchema,
  BaseRegistrationData,
} from "@/types/registration";
import { useRegistrationStore } from "@/store/registrationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function RegistrationRequestPage() {
  const router = useRouter();
  const { setBaseData, setStep } = useRegistrationStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<BaseRegistrationData>({
    resolver: zodResolver(baseRegistrationSchema),
    defaultValues: {
      consentGiven: false,
      requestedRole: "user",
    },
  });

  const consentGiven = watch("consentGiven");

  const onSubmit = (data: BaseRegistrationData) => {
    setBaseData(data);
    setStep(2);
    router.push("/auth/request/type");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">
            Registration Request
          </CardTitle>
          <CardDescription className="text-base">
            Fill out the form below to request access to the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="John Doe"
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="john.doe@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                {...register("phoneNumber")}
                placeholder="+1 (555) 123-4567"
                aria-invalid={!!errors.phoneNumber}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About Yourself *</Label>
              <Textarea
                id="about"
                {...register("about")}
                placeholder="Tell us about your background, interests, and why you'd like to join the platform..."
                rows={5}
                aria-invalid={!!errors.about}
              />
              {errors.about && (
                <p className="text-sm text-red-500">{errors.about.message}</p>
              )}
            </div>

            <div className="flex items-start space-x-3 rounded-md border p-4">
              <Checkbox
                id="consent"
                checked={consentGiven}
                onCheckedChange={(checked) =>
                  setValue("consentGiven", checked as boolean)
                }
                aria-invalid={!!errors.consentGiven}
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor="consent"
                  className="text-sm font-medium leading-relaxed cursor-pointer"
                >
                  I agree to the terms and conditions *
                </Label>
                <p className="text-sm text-muted-foreground">
                  By checking this box, you agree to our terms of service and
                  privacy policy.
                </p>
              </div>
            </div>
            {errors.consentGiven && (
              <p className="text-sm text-red-500">
                {errors.consentGiven.message}
              </p>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
