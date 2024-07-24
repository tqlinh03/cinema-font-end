export default function LayoutAuth({
  children
}: {children: React.ReactNode}) {
  return (
    <div className="bg-cyan-600 h-full flex items-center justify-center ">
      {children}
    </div>
  )
}