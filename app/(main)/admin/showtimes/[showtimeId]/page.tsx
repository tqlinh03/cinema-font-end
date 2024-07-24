import NewAndUpdateShowtime from "@/app/components/admin/showtimes/new.and.update.showtime";

export default function ShowtimeDetailPage({ 
  params 
}: { params: { showtimeId: number } }) {
  const { showtimeId } = params
  return (
  <>
    <NewAndUpdateShowtime showtimeId={+showtimeId}/>
  </>
)
}