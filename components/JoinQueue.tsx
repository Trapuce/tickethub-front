import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel'
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from 'convex/react';
import React from 'react'

export default function JoinQueue({
    eventId,
    userId
}:{
    eventId:Id<"events">,
    userId:Id<"users">
}) {

    const {toast} = useToast();
   // const joinwaitingList = useMutation(api.events.joinWaitingList)
    const queuePosition = useQuery(api.waitingList.getQueuePosition,{
        eventId,
        userId
    })

  return (
    <div>JoinQueue</div>
  )
}
