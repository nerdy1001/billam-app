import OnboardingForm from "@/app/_components/onboarding/onboarding-form";
import { getCurrentBusiness } from "@/app/utils/get-current-business.util";
import { redirect } from "next/navigation";

export default async function OnboardingSteps() {

    const business = await getCurrentBusiness();

    if (business) {
        redirect(`/dashboard/${business.id}`)
    }

    return (
        <div>
            <OnboardingForm />
        </div>
    )
}