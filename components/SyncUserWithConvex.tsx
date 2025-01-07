"use client";
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useEffect } from 'react';

export default function SyncUserWithConvex() {
  const { user } = useUser();
  const updateUserMutation = useMutation(api.users.updateUser);

  useEffect(() => {
    if (!user) return;

    const syncUserData = async () => {
      try {
        await updateUserMutation({
          userId: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.emailAddresses[0]?.emailAddress || ""
        });
      } catch (error) {
        console.error('Error syncing user data:', error);
      }
    };

    syncUserData();
  }, [user, updateUserMutation]);

  return null;
}