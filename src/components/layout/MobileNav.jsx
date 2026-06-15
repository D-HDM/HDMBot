import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Smartphone, MessageSquare, Settings } from 'lucide-react'

const mobileLinks = [
  { to: '/', icon: LayoutDashboard },
  { to: '/devices', icon: Smartphone },
  { to: '/chats', icon: MessageSquare },
  { to: '/settings', icon: Settings },
]

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="flex justify-around">
        {mobileLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 px-3 text-xs ${
                isActive ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <link.icon size={20} />
            <span className="hidden sm:inline">{link.to === '/' ? 'Home' : link.to.slice(1).charAt(0).toUpperCase() + link.to.slice(2)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}