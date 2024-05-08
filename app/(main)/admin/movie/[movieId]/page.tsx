import { Movie } from "@/app/components/admin/movie/movie"

export default function MovieIdPage({ 
  params 
}: { params: { movieId: number } }) {
  return (
  <>
    <Movie movieId={params.movieId}/>
  </>
)
}