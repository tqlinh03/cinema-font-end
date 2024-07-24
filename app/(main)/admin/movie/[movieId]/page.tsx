import { Movie } from "@/app/components/admin/movie/movie"

export default function MovieIdPage({ 
  params 
}: { params: { movieId: number } }) {
  const { movieId } = params
  return (
  <>
    <Movie movieId={+movieId}/>
  </>
)
}