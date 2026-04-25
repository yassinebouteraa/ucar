'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Building2,
  Bot,
  BarChart3,
  Upload,
  Scale,
  LogOut,
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { label: 'Tableau de Bord', href: '/dashboard', icon: Home },
  { label: 'Institutions', href: '/dashboard/institutions', icon: Building2 },
  { label: 'Comparer', href: '/dashboard/comparison', icon: Scale },
  { label: 'Assistant EchoGarden', href: '/dashboard/ai-assistant', icon: Bot },
  { label: 'Rapports', href: '/dashboard/reports', icon: BarChart3 },
  { label: 'Ingestion', href: '/dashboard/data-integration', icon: Upload },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-white border-r border-slate-200 w-56 min-h-screen fixed left-0 top-0 pt-16 flex flex-col z-40">
      <nav className="flex-1 px-0 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 w-full transition-colors",
                    isActive 
                      ? "bg-cyan-50 text-cyan-600 border-r-2 border-cyan-500 font-semibold" 
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <item.icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold">
            PU
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-700">Présidente UCAR</span>
            <span className="text-xs text-slate-500">rectorat@ucar.tn</span>
          </div>
        </div>
        <Link 
          href="/login"
          className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
        >
          <LogOut size={16} />
          <span className="text-sm font-medium">Déconnexion</span>
        </Link>
      </div>
    </aside>
  )
}
