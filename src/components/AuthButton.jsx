import { SignInButton, useUser } from '@clerk/clerk-react';

function AuthButton() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return null; // UserButton will be shown instead
  }

  return (
    <SignInButton mode="modal">
      <button className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 transition-all duration-200 font-medium">
        Login
      </button>
    </SignInButton>
  );
}

export default AuthButton;