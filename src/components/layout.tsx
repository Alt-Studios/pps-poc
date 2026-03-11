import { Outlet } from 'react-router-dom'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ThemeToggle } from '@/components/theme-toggle'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <ThemeToggle />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
