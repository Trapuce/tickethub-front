import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { Ticket } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ReleaseTicket from './ReleaseTicket';

export default function PurchasedTicket({ eventId }: { eventId: Id<'events'> }) {
  const router = useRouter();
  const { user } = useUser();

  // Fetch the user's queue position
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id || '',
  });

  const [timeRemaining, setTimeRemaining] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const offerExpiresAt = queuePosition?.offerExpiresAt || 0;
  const isExpired = Date.now() > offerExpiresAt;

  // Calculate the remaining time until the offer expires
  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (isExpired) {
        setTimeRemaining('Expired');
        return;
      }

      const diff = offerExpiresAt - Date.now();
      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (minutes > 0) {
        setTimeRemaining(`${minutes} minute${minutes === 1 ? '' : 's'} ${seconds} second${seconds === 1 ? '' : 's'}`);
      } else {
        setTimeRemaining(`${seconds} second${seconds === 1 ? '' : 's'}`);
      }
    };

    calculateTimeRemaining();

    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [offerExpiresAt, isExpired]);

  // Handle the ticket purchase process
  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      // Placeholder for the actual purchase logic (e.g., Stripe checkout)
      console.log('Redirecting to checkout...');
      // Simulate navigation to a payment page
      router.push('/checkout');
    } catch (error) {
      console.error('Error during purchase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !queuePosition || queuePosition.status !== 'offered') {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200">
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ticket Reserved</h3>
                <p className="text-sm text-gray-500">Expires in {timeRemaining}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              A ticket has been reserved for you. Complete your purchase before the timer expires to secure your spot at this event.
            </div>
          </div>
        </div>
        <button
          onClick={handlePurchase}
          disabled={isExpired || isLoading}
          className={`w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-lg font-bold shadow-md transition-all duration-200 transform hover:scale-105 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-lg ${
            isLoading ? 'opacity-70' : ''
          }`}
        >
          {isLoading ? 'Redirecting to checkout...' : 'Purchase Your Ticket Now →'}
        </button>

        <div className='mt-4'>
                <ReleaseTicket eventId={eventId} waitingListId={queuePosition._id} />
        </div>
      </div>
    </div>
  );
}