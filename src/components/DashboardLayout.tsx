import Sidebar from './Sidebar'
import Navbar from './Navbar'
import AIAssistantPopup from './AIAssistantPopup'

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
        <main className="flex-1 ml-56 pt-16 min-h-screen relative">
          {children}
        </main>
      </div>
      <AIAssistantPopup />
    </div>
  )
}
