// eslint-disable-next-line import/no-anonymous-default-export
export default {
  providers: [
    {
      // domain: process.env.CLERK_ISSUER_URL!,
      domain: "https://native-yeti-82.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
