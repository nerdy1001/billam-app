import Container from "@/app/_components/dashboard/container";
import AccountSettings from "@/app/_components/settings/account-settings";
import BusinessDetails from "@/app/_components/settings/business-details";
import SettingsHeader from "@/app/_components/settings/settings-header";
import { checkForExistingPhoneNumber } from "@/app/actions/phone-number.actions";
import { getBusinessDetails } from "@/app/actions/business.actions";
import { getServerSession } from "@/app/utils/server-session.util";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import PaymentMethods from "@/app/_components/settings/payment-methods";
import { getBusinessPaymentMethods } from "@/app/actions/payment-methods.actions";

export default async function SettingsPage() {

    const session = await getServerSession();

    if (!session) {
        redirect('/auth/login');
    }

    const { phoneNumber } = await checkForExistingPhoneNumber();

    // fetch business details to prefill form
    const businessResponse = await getBusinessDetails();
    // narrow the union before accessing `data`
    const initialBusinessData =
      businessResponse && "success" in businessResponse
        ? businessResponse.data
        : null;

    // fetch existing payment methods so we can populate the payment form
    const paymentResponse = await getBusinessPaymentMethods();
    const initialPaymentMethods =
      paymentResponse && "success" in paymentResponse
        ? paymentResponse.data
        : [];

    return (
        <Container>
            <main className="xl:max-w-4xl w-full mx-auto flex flex-col space-y-8 relative">
                <SettingsHeader username={session.user.name} email={session.user.email} />
                <Tabs 
                    defaultValue={"account-settings"} 
                    className="flex flex-col space-y-12"
                >
                    <TabsList variant="line" className="md:flex grid grid-cols-3 gap-4">
                        <TabsTrigger value="account-settings" className="cursor-pointer text-base">
                            Account Settings
                        </TabsTrigger>
                        <TabsTrigger value="business-details" className="cursor-pointer text-base">
                            Business Details
                        </TabsTrigger>
                        <TabsTrigger value="payment-methods" className="cursor-pointer text-base">
                            Payment Methods
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="account-settings">
                        <AccountSettings username={session.user.name} phoneNumber={phoneNumber} />
                    </TabsContent>
                    <TabsContent value="business-details">
                        <BusinessDetails initialData={initialBusinessData} />
                    </TabsContent>
                    <TabsContent value="payment-methods">
                        <PaymentMethods initialMethods={initialPaymentMethods} />
                    </TabsContent>
                </Tabs>
            </main>
        </Container>
    )
}