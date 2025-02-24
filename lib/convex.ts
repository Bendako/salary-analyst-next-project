import { ConvexHttpClient } from "convex/browser";

// Create a singleton instance of the Convex HTTP client
export const getConvexClient = () => {
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  // Note: Direct token manipulation is not recommended
  // Convex and Clerk integration should be handled through providers
  return client;
};
