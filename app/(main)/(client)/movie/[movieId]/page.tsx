import { MovieDetail } from '@/app/components/client/movie/movie.detail';
import React from 'react';

export default function MovieIdPage({ 
  params 
} : { params: { movieId: number }}) {
  return ( 
    <>
    <div className='w-[100%]'>

      <MovieDetail movieId = {params.movieId}/>
    </div>
    </>
  );
}
