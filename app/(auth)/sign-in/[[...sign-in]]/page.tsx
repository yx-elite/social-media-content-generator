import AnimatedGalaxy from "@/components/AnimatedGalaxy";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <AnimatedGalaxy />
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-blue-500 hover:bg-blue-600 text-sm text-white border-none",
          },
        }}
      />
    </div>
  );
};

export default SignInPage;
