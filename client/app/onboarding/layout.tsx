import OnboardingContainer from "../_components/onboarding/onboarding-container"
import OnboardingSidebar from "../_components/onboarding/onboarding-sidebar"

export default function OnboardingLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-screen flex xl:flex-row flex-col">
            <div className="w-full xl:w-2/6">
                <OnboardingSidebar />
            </div>
            <OnboardingContainer>
                {children}
            </OnboardingContainer>
        </div>
    )
}