'use client'

const OnboardingContainer = ({children}: { children: React.ReactNode}) => {
    return ( 
        <div className="lg:max-w-3xl max-w-2xl lg:p-12 px-4 py-6 text-[#3c3c3c] w-full h-full mx-auto my-auto flex flex-col gap-4">
            {children}
        </div>
     );
}
 
export default OnboardingContainer;