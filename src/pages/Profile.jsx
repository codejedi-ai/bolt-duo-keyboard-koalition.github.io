import { UserProfile } from '@clerk/clerk-react';

function Profile() {
  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <UserProfile 
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: '#FFA500',
              colorBackground: '#111827',
              colorInputBackground: '#1F2937',
              colorInputText: '#FFFFFF',
              colorText: '#FFFFFF',
              colorTextSecondary: '#9CA3AF',
              colorNeutral: '#374151',
              colorDanger: '#EF4444',
              colorSuccess: '#10B981',
              colorWarning: '#F59E0B',
              borderRadius: '0.375rem',
              spacingUnit: '1rem'
            },
            elements: {
              card: "bg-gray-900 border border-gray-800 shadow-xl",
              headerTitle: "text-white text-2xl font-bold",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "bg-gray-800 border border-gray-700 text-white hover:bg-gray-700",
              socialButtonsBlockButtonText: "text-white",
              dividerLine: "bg-gray-700",
              dividerText: "text-gray-400",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-primary",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-black font-medium",
              footerActionText: "text-gray-400",
              footerActionLink: "text-primary hover:text-primary/80",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-primary hover:text-primary/80",
              navbar: "bg-gray-800 border-gray-700",
              navbarButton: "text-gray-300 hover:text-white hover:bg-gray-700",
              navbarButtonIcon: "text-gray-400",
              pageScrollBox: "bg-gray-900",
              page: "bg-gray-900",
              profileSectionTitle: "text-white",
              profileSectionContent: "bg-gray-800 border-gray-700",
              badge: "bg-primary/20 text-primary",
              accordionTriggerButton: "text-white hover:bg-gray-800",
              accordionContent: "bg-gray-800",
              tableHead: "bg-gray-800 text-gray-300",
              tableBody: "bg-gray-900",
              tableCell: "border-gray-700 text-gray-300"
            }
          }}
        />
      </div>
    </section>
  );
}

export default Profile;