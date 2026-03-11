import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'Membership', href: 'https://www.pps.co.za/membership' },
  { label: 'Solutions', href: 'https://www.pps.co.za/solutions' },
  { label: 'Insights', href: 'https://www.pps.co.za/insights' },
  { label: 'About PPS', href: 'https://www.pps.co.za/about' },
  { label: 'Get Advice', href: 'https://www.pps.co.za/get-advice' },
  { label: 'Support', href: 'https://www.pps.co.za/support' },
]

const rightLinks = [
  { label: 'Login', href: 'https://www.pps.co.za/login' },
  { label: 'Join PPS', href: 'https://www.pps.co.za/join' },
]

export function SiteHeader() {
  return (
    <header className="bg-navy border-b border-white/10">
      <div className="mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-8 lg:px-14">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img
            src="/pps-logo-white.svg"
            alt="PPS"
            className="h-10 sm:h-14 w-auto"
          />
        </Link>

        {/* Centre nav - hidden on mobile */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm tracking-[0.04em] hover:text-gold transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right nav - hidden on mobile */}
        <div className="hidden lg:flex items-center gap-6">
          {rightLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm tracking-[0.04em] hover:text-gold transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Mobile: just show a compact right side */}
        <div className="flex lg:hidden items-center gap-4">
          <a
            href="https://www.pps.co.za/login"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-sm tracking-[0.04em] hover:text-gold transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    </header>
  )
}
