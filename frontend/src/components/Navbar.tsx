'use client';
import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LoginLink, LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import Subscribe from './Subscribe';

function Navbar() {
  const { isAuthenticated, user } = useKindeBrowserClient();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const email = user?.email;

  React.useEffect(() => {
    const checkSubscription = async () => {
      console.log('Checking subscription status...');
      if (isAuthenticated) {
        try {
          const response = await fetch(`/api/subscribed?email=${user?.email}`);
          const data = await response.json();
          console.log(data);

          if (data.subscription) {
            setIsSubscribed(true);
          } else {
            setIsSubscribed(false);
          }
        } catch (error) {
          console.error('Error fetching subscription status:', error);
        }
      }
    };

    checkSubscription();
  }, [isAuthenticated]);

  const unsubscribeUser = async (email: string) => {
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data.message); // Handle success message
        setIsSubscribed(false);
      } else {
        console.error(data.error); // Handle error message
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  };

  return (
    <div className="flex items-center justify-between w-full p-3 px-10 border-b shadow">
      <div className="text-xl font-semibold">Weather App</div>
      <div className="flex items-center gap-7 text-md">
        <Link href="/" className="hover:underline underline-offset-2">
          {' '}
          Home{' '}
        </Link>
        <Link href="/alerts" className="hover:underline underline-offset-2">
          {' '}
          Alerts{' '}
        </Link>
        <Link href="/summaries" className="hover:underline underline-offset-2">
          {' '}
          Weather Summaries{' '}
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated && !isSubscribed && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsOpen(true)}>
                Subscribe
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Subscribe to Weather App 🔔</DialogTitle>
                <DialogDescription>
                  provide your prefernces to get the latest weather updates.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <Subscribe
                  setIsOpen={setIsOpen}
                  setIsSubscribed={setIsSubscribed}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
        {isAuthenticated && isSubscribed && email && (
          <Button variant="outline" onClick={() => unsubscribeUser(email)}>
            Unsubscribe
          </Button>
        )}
        {!isAuthenticated ? (
          <LoginLink>
            <Button variant={'outline'}>Sign In</Button>
          </LoginLink>
        ) : (
          <LogoutLink>
            <Button variant={'outline'}>Sign Out</Button>
          </LogoutLink>
        )}
      </div>
    </div>
  );
}

export default Navbar;