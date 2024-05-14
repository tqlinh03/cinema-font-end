
import { Booking } from '@/app/components/client/booking.ticket/booking';
import { callFetchMovie } from '@/app/config/api';
import { IMovie } from '@/app/types/backend';
import React from 'react';

export async function generateStaticParams() {
  // return [{ movieId: '1' }, { movieId: '2' }, { movieId: '3' }];
  const res = await callFetchMovie("limit=100&&page=1");
  return res.data.items.map((movie: IMovie) => ({
    movieId: movie._id.toString(),
  }));
}

export default function BookingTicketPage({
  params
}: {params: {movieId: number}}) { 
  const { movieId } = params
  return (
    <> 
      <Booking movieId={+movieId}/>
    </>
  );
}
