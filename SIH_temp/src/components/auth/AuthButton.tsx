import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";

export default function AuthButton() {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Hello, {user.firstName || user.emailAddresses[0].emailAddress}
        </span>
        <SignOutButton>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Sign In
      </button>
    </SignInButton>
  );
}
