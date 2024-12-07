import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <SignUp
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

export default SignUpPage;
