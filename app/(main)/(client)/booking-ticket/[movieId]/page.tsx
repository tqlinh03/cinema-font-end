
import { Booking } from '@/app/components/client/booking.ticket/booking';

import React from 'react';

export default function BookingTicketPage({
  params
}: {params: {movieId: number}}) { 
  const { movieId } = params

  return ( 
    <> 
      <Booking 
        movieId={+movieId}  
      />
    </>
  );
}
