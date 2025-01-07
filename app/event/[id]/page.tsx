"use client";

import EventCard from '@/components/EventCard';
import JoinQueue from '@/components/JoinQueue';
import Spinner from '@/components/Spinner';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useStorageUrl } from '@/lib/utils2';
import { SignInButton, useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { CalendarDays, MapPin, Ticket, Users } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';

export default function EventPage() {
  const { user } = useUser();
  const params = useParams();

  const event = useQuery(api.events.getById, {
    eventId: params.id as Id<'events'>,
  });

  const availability = useQuery(api.events.getEventAvailability, {
    eventId: params.id as Id<'events'>,
  });

  const imageUrl = useStorageUrl(event?.imageStorageId);

  const normalizeDate = (date: number) => (date < 1e12 ? date * 1000 : date);

  if (!event || !availability) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Event Image */}
          {imageUrl && (
            <div className="aspect-[21/9] relative w-full">
              <Image
                src={imageUrl}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Event Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {event.name}
                  </h1>
                  <p className="text-lg text-gray-600">{event.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <EventDetail
                    icon={CalendarDays}
                    label="Date"
                    value={new Date(normalizeDate(event.eventDate)).toLocaleDateString()}
                  />

                  <EventDetail
                    icon={MapPin}
                    label="Location"
                    value={event.location}
                  />

                  <EventDetail
                    icon={Ticket}
                    label="Price"
                    value={`$${event.price.toFixed(2)}`}
                  />

                  <EventDetail
                    icon={Users}
                    label="Availability"
                    value={`${availability.totalTickets - availability.purchasedCount} / ${availability.totalTickets} left`}
                  />
                </div>

                {/* Additional Info */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Event Information
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>- Please arrive 30 minutes before the event starts</li>
                    <li>- Tickets are non-refundable</li>
                    <li>- Age restriction: 18+</li>
                  </ul>
                </div>
              </div>

              {/* Right Column (placeholder for additional content, if needed) */}
              
              <div>
                <div className='sticky top-8 space-y-4'>
                    <EventCard eventId={params.id as Id<"events">}/>

                        {user ? (
                            <JoinQueue 
                            eventId={params.id as Id<"events">}
                            userId={user.id}
                            />

                        ):(
                            <SignInButton>
                                <button className='w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700  hover:to-blue-900 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg'>
                                    Sign to buy Tickets 
                                </button>
                            </SignInButton>
                        )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Component for rendering individual event details.
 * @param {Object} props - The component props.
 * @param {React.ComponentType} props.icon - Icon to display.
 * @param {string} props.label - Label for the detail.
 * @param {string} props.value - Value of the detail.
 */
function EventDetail({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
      <div className="flex items-center text-gray-600 mb-1">
        <Icon className="w-5 h-5 mr-2 text-blue-600" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-gray-900">{value}</p>
    </div>
  );
}
