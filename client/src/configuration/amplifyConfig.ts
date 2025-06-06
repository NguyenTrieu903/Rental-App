/**
 * Configure AWS Amplify with Cognito authentication settings
 * @see https://docs.amplify.aws/javascript/build-a-backend/auth/set-up-auth/
 */
export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolClientId:
        process.env.NEXT_PUBLIC_AWS_CONGNITO_USER_POOL_CLIENT_ID || "",
      userPoolId: process.env.NEXT_PUBLIC_AWS_CONGNITO_USER_POOL_ID || "",
    },
  },
};
