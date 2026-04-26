'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Building2,
  Scale,
  BarChart3,
  Upload,
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { motion } from 'framer-motion'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { label: 'Tableau de Bord', href: '/dashboard', icon: Home },
  { label: 'Institutions', href: '/dashboard/institutions', icon: Building2 },
  { label: 'Comparer', href: '/dashboard/comparison', icon: Scale },
  { label: 'Rapports', href: '/dashboard/reports', icon: BarChart3 },
  { label: 'Ingestion', href: '/dashboard/data-integration', icon: Upload },
]

export default function Sidebar() {
  const pathname = usePathname()

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 70 } }
  }

  return (
    <aside className="bg-white border-r border-slate-200 w-56 min-h-screen fixed left-0 top-0 pt-16 flex flex-col z-40">
      <nav className="flex-1 px-0 py-4">
        <motion.ul 
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="space-y-1"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <motion.li variants={itemVariants} key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 w-full transition-all relative group overflow-hidden",
                    isActive 
                      ? "bg-cyan-50 text-cyan-700 font-bold" 
                      : "text-slate-600 hover:bg-slate-50 font-medium"
                  )}
                >
                  {/* Active Indicator Line */}
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav-indicator"
                      className="absolute right-0 top-0 bottom-0 w-1.5 bg-cyan-500 rounded-l-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }} 
                    whileTap={{ scale: 0.95 }}
                    className={isActive ? "text-cyan-600" : "text-slate-400 group-hover:text-slate-600"}
                  >
                    <item.icon size={18} />
                  </motion.div>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </nav>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="p-4 border-t border-slate-100 mt-auto"
      >
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-cyan-600/20">
            PU
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">Présidente UCAR</span>
            <span className="text-xs font-medium text-slate-500">rectorat@ucar.tn</span>
          </div>
        </div>
      </motion.div>
    </aside>
  )
}
