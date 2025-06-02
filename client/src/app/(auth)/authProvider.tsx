import React from "react";
import { Amplify } from "aws-amplify";

import {
  Authenticator,
  Heading,
  Placeholder,
  useAuthenticator,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

// https://docs.amplify.aws/gen1/javascript/tools/libraries/configure-categories/
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId:
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
    },
  },
});

const components = {
  Header() {
    return (
      <View className="mt-4 mb-7">
        <Heading level={3} className="!text-2xl !font-bold">
          RENT
          <span className="font-light text-rose-400 hover:!text-primary-300">
            IFUL
          </span>
        </Heading>
        <p className="text-black mt-2">
          <span className="font-bold">Welcome!</span>Please sign in to continue
        </p>
      </View>
    );
  },
};

const formFields = {
  signIn: {
    username: {
      placeholder: "Enter your email",
      label: "Email",
      isRequired: true,
    },
    password: {
      placeholder: "Enter your password",
      label: "Password",
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      placeholder: "Choose a username",
      label: "Username",
      isRequired: true,
    },
    email: {
      order: 2,
      placeholder: "Enter your email address",
      label: "Email",
      isRequired: true,
    },
    password: {
      order: 3,
      placeholder: "Create a password",
      label: "Password",
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      isRequired: true,
    },
  },
};
const Auth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  return (
    <div className="h-full">
      <Authenticator components={components} formFields={formFields}>
        {() => <>{children}</>}
      </Authenticator>
    </div>
  );
};

export default Auth;
