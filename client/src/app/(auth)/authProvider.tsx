import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";

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
import { amplifyConfig } from "@/configuration/amplifyConfig";
import { authFormFields } from "@/utils/authFormFields";

Amplify.configure(amplifyConfig);

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

const SignInFooter = ({
  handleAuthNavigation,
}: {
  handleAuthNavigation: (path: string, action: () => void) => void;
}) => {
  const { toSignUp } = useAuthenticator();

  return (
    <View className="text-center mt-4">
      <p className="text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          onClick={() => handleAuthNavigation("/signup", toSignUp)}
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

const SignUpFooter = ({
  handleAuthNavigation,
}: {
  handleAuthNavigation: (path: string, action: () => void) => void;
}) => {
  const { toSignIn } = useAuthenticator();

  return (
    <View className="text-center mt-4">
      <p className="text-muted-foreground">
        Already have an account?{" "}
        <button
          onClick={() => handleAuthNavigation("/signin", toSignIn)}
          className="text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </View>
  );
};

const Auth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathName = usePathname();
  const [initialAuthState, setInitialAuthState] = useState<"signIn" | "signUp">(
    pathName.includes("signup") ? "signUp" : "signIn"
  );
  const isAuthPage = /^\/(signin|signup)$/.test(pathName);
  const isDashboardPage =
    pathName.startsWith("/manager") || pathName.startsWith("/tenants");

  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/");
    }
  }, [user, isAuthPage, router]);

  useEffect(() => {
    if (pathName.includes("signup") && initialAuthState !== "signUp") {
      setInitialAuthState("signUp");
    } else if (!pathName.includes("signup") && initialAuthState !== "signIn") {
      setInitialAuthState("signIn");
    }
  }, [pathName, initialAuthState]);

  const handleAuthNavigation = (path: string, authAction: () => void) => {
    window.history.pushState(null, "", path);
    setInitialAuthState(path.includes("signup") ? "signUp" : "signIn");
    authAction();
  };

  const authComponents = {
    Header: AuthHeader,
    SignIn: {
      Footer: () => (
        <SignInFooter handleAuthNavigation={handleAuthNavigation} />
      ),
    },
    SignUp: {
      FormFields: SignUpFormFields,
      Footer: () => (
        <SignUpFooter handleAuthNavigation={handleAuthNavigation} />
      ),
    },
  };

  if (!isAuthPage && !isDashboardPage) {
    return <>{children}</>;
  }
  return (
    <div className="h-full">
      <Authenticator
        initialState={initialAuthState}
        components={authComponents}
        formFields={authFormFields}
      >
        {() => <>{children}</>}
      </Authenticator>
    </div>
  );
};

export default Auth;
