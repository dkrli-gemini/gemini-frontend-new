import { getProviders, signIn } from "next-auth/react";

export default async function SignIn() {
  const providers = await getProviders();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center">Sign in to your account</h3>
        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name} className="mt-4">
              <button
                onClick={() => signIn(provider.id)}
                className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
