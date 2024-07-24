import CreateRota from "@/app/components/admin/calendar/create-rota"

export default function MovieIdPage({ 
  params 
}: { params: { calendarId: number } }) {
  const { calendarId } = params
  return (
  <>
    <CreateRota calendarId={+calendarId}/>
  </>
)
}