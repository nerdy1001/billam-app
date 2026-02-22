'use client';

import { useFormPersistence } from '@/hooks/use-form-persistence';
import { OnboardingFormValues, onboardingSchema } from '@/lib/validations/onboarding.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import OnboardingWelcome from './onboarding-welcome';
import OnboardingStepOne from './onboarding-step-one';
import OnboardingStepTwo from './onboarding-step-two';
import OnboardingStepThree from './onboarding-step-three';
import OnboardingComplete from './onboarding-complete';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MoveLeft, MoveRight } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { createBusiness } from '@/app/actions/onboarding.actions';

const OnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [businessId, setBusinessId] = useState<string | undefined>(undefined)
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      businessName: "",
      businessAddress: "",
      businessEmail: "",
      phoneNumber1: "",
      phoneNumber2: "",
      mobileMoneyNumber: "",
      orangeMoneyNumber: "",
      cardNumber: ""
    }
  });

  const { clearPersistedData } = useFormPersistence(form);
  
  const totalSteps = 5;

  const animateTransition = (direction: "left" | "right", newStep: number) => {
    setSlideDirection(direction);
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentStep(newStep);
      setIsAnimating(false);
    }, 150);
  };

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 2) {
      isValid = await form.trigger(["businessType", "industry"]);
    } else if (currentStep === 3) {
      isValid = await form.trigger(["businessName", "businessEmail", "phoneNumber1", "phoneNumber1", "logo"]);
    } else if (currentStep === 4) {
      isValid = await form.trigger(["paymentMethods"]);
    } else {
      isValid = true;
    }

    if (!isValid) {
      return;
    }

    if (currentStep < totalSteps) {
      animateTransition("left", currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      animateTransition("right", currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingWelcome />;
      case 2:
        return <OnboardingStepOne form={form} />;
      case 3:
        return <OnboardingStepTwo form={form} />;
      case 4:
        return <OnboardingStepThree form={form} />;
      case 5:
        return <OnboardingComplete businessId={businessId} />;
      default:
        return null;
    }
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    try {
      const result = await createBusiness(data);

      if (result.error) {
        return toast.error(result.message);
      }

      setBusinessId(result.res);

      toast.success(result.message);

      clearPersistedData();
      setCurrentStep(5);

    } catch (error: any) {
      console.log(error)
    }    
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-16'>
        <div
          className={cn(
            "transition-all duration-150 ease-out",
            isAnimating && slideDirection === "left" && "opacity-0 -translate-x-4",
            isAnimating && slideDirection === "right" && "opacity-0 translate-x-4",
            !isAnimating && "opacity-100 translate-x-0"
          )}
        >
          {renderStep()}
        </div>
        <div className={cn("flex gap-3", currentStep === 1 || currentStep === 5 ? " items-center justify-center" : "items-start")}>
          {currentStep > 1 && currentStep < 5 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="min-w-25 rounded-full h-10 cursor-pointer"
            >
              <MoveLeft />
              Back
            </Button>
          )}

          {currentStep > 1 && currentStep < 4 && (
            <Button type="button" onClick={handleNext} className="min-w-25 rounded-full bg-[#1E3A8A] h-10 cursor-pointer">
              Next
            </Button>
          )}

          {currentStep === 1 && (
            <Button type="button" onClick={handleNext} className="min-w-25 rounded-full bg-[#1E3A8A] h-10 cursor-pointer">
              Get Started
              <MoveRight />
            </Button>
          )}

          {currentStep === 4  && (
            <Button type="submit" className="min-w-25 rounded-full bg-[#1E3A8A] h-10 cursor-pointer">
              Submit
            </Button>
          )}

          {currentStep === 5 && (
            <Button type="submit" className="min-w-25 rounded-full bg-[#1E3A8A] h-10 cursor-pointer">
              Head to your dashboard
              <MoveRight />
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

export default OnboardingForm