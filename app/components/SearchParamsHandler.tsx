"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const SearchParamsHandler = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const authModal = searchParams.get('authModal');
    const attemptedRoute = searchParams.get('attemptedRoute');

    if (authModal === 'true') {
      // Dispatch a custom event that the parent component can listen to
      const event = new CustomEvent('openAuthModal', { 
        detail: { 
          attemptedRoute: attemptedRoute || undefined 
        } 
      });
      window.dispatchEvent(event);

      // Clear the search params to prevent repeated triggers
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.delete('authModal');
      currentParams.delete('attemptedRoute');
      router.replace(`/?${currentParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  return null;
};

export default SearchParamsHandler;
