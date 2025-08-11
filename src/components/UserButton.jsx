import { UserButton as ClerkUserButton, useUser } from '@clerk/clerk-react';

function UserButton() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return null;
  }

  return (
    <ClerkUserButton 
      appearance={{
        elements: {
          avatarBox: "w-8 h-8",
          userButtonPopoverCard: "bg-gray-800 border border-gray-700",
          userButtonPopoverActions: "bg-gray-800",
          userButtonPopoverActionButton: "text-white hover:bg-gray-700",
          userButtonPopoverActionButtonText: "text-white",
          userButtonPopoverFooter: "bg-gray-800 border-t border-gray-700"
        }
      }}
    />
  );
}

export default UserButton;