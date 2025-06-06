import React, { useEffect } from "react";

import {
  Authenticator,
  Heading,
  Radio,
  RadioGroupField,
  useAuthenticator,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter, usePathname } from "next/navigation";
import { configureAmplify } from "@/configuration/amplifyConfig";
import { authFormFields } from "@/utils/authFormFields";

configureAmplify();

// UI Components for Authenticator
const AuthHeader = () => (
  <View className="mt-4 mb-7">
    <Heading level={3} className="!text-2xl !font-bold">
      RENT
      <span className="text-secondary-500 font-light hover:!text-primary-300">
        IFUL
      </span>
    </Heading>
    <p className="text-muted-foreground mt-2">
      <span className="font-bold">Welcome!</span> Please sign in to continue
    </p>
  </View>
);

const SignInFooter = () => {
  const router = useRouter();
  const { toSignUp } = useAuthenticator();

  const handleSignUp = () => {
    router.push("/signup");
    toSignUp();
  };

  return (
    <View className="text-center mt-4">
      <p className="text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          onClick={handleSignUp}
          className="text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
        >
          Sign up here
        </button>
      </p>
    </View>
  );
};

const SignUpFormFields = () => {
  const { validationErrors } = useAuthenticator();

  return (
    <>
      <Authenticator.SignUp.FormFields />
      <RadioGroupField
        legend="Role"
        name="custom:role"
        errorMessage={validationErrors?.["custom:role"]}
        hasError={!!validationErrors?.["custom:role"]}
        isRequired
      >
        <Radio value="tenant">Tenant</Radio>
        <Radio value="manager">Manager</Radio>
      </RadioGroupField>
    </>
  );
};

const SignUpFooter = () => {
  const router = useRouter();
  const { toSignIn } = useAuthenticator();

  const handleSignIn = () => {
    router.push("/signin");
    toSignIn();
  };

  return (
    <View className="text-center mt-4">
      <p className="text-muted-foreground">
        Already have an account?{" "}
        <button
          onClick={handleSignIn}
          className="text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </View>
  );
};

// Authenticator components configuration
const components = {
  Header: AuthHeader,
  SignIn: {
    Footer: SignInFooter,
  },
  SignUp: {
    FormFields: SignUpFormFields,
    Footer: SignUpFooter,
  },
};

const Auth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathName = usePathname();
  const isAuthPage = /^\/(signin|signup)$/.test(pathName);
  const isDashboardPage =
    pathName.startsWith("/manager") || pathName.startsWith("/tenants");

  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/");
    }
  }, [user, isAuthPage, router]);

  if (!isAuthPage && !isDashboardPage) {
    return <>{children}</>;
  }
  return (
    <div className="h-full">
      <Authenticator
        initialState={pathName.includes("signup") ? "signUp" : "signIn"}
        components={components}
        formFields={authFormFields}
      >
        {() => <>{children}</>}
      </Authenticator>
    </div>
  );
};

export default Auth;
