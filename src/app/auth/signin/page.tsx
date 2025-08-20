import { getProviders } from "next-auth/react";
import SignInButton from "@/components/atomic/SignInButton";

export const dynamic = 'force-dynamic';

export default async function SignIn() {
  const providers = await getProviders();

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "left",
      }}
    >
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg flex flex-col items-center gap-6">
        <h3 className="text-2xl font-bold text-center">
          Sign in to your account
        </h3>
        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name} className="mt-4">
              <SignInButton provider={provider} />
            </div>
          ))}
      </div>
    </div>
  );
}
