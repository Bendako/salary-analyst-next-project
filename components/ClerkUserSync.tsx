"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function ClerkUserSync() {
  const { user } = useUser();
  const saveClerkUser = useMutation(api.testData.saveClerkUser);

  useEffect(() => {
    if (user) {
      saveClerkUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.fullName || user.username || 'Anonymous',
        imageUrl: user.imageUrl,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
      }).catch(console.error);
    }
  }, [user, saveClerkUser]);

  return null; // This component doesn't render anything
}
