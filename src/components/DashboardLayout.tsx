import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F0FAFA]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-56 pt-16 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
