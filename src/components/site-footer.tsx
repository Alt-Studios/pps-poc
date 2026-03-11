const membershipLinks = [
  'The PPS Difference',
  'Profit-Share Account\u2122',
  'How Membership Works',
  'Eligibility',
  'Member Stories',
  'PPS Foundation',
]

const solutionsLinks = [
  'Protect My Income',
  'Grow My Wealth',
  'Protect My Assets',
  'Protect My Business',
  'Plan My Estate',
  'Explore by Profession',
  'Explore by Life Stage',
]

const supportLinks = [
  'Our Story',
  'Leadership',
  'Sustainability',
  'Careers',
  'Find an Adviser',
  'Submit Claim',
  'Track Claim',
  'Member Login',
  'Contact Us',
  'FAQs',
]

const disclaimerLinks = [
  'Insights',
  'Privacy Policy',
  'Terms & Conditions',
  'PAIA Manual',
  'Cookies Policy',
]

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p className="text-gold text-sm tracking-[0.04em] mb-6">{title}</p>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link}>
            <span className="text-white text-[13px] tracking-[0.04em] hover:text-gold/80 cursor-pointer transition-colors">
              {link}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-navy">
      <div className="mx-auto max-w-[1488px] px-4 sm:px-8 lg:px-14">
        {/* Logo + link columns */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 pt-20 sm:pt-28 pb-16">
          {/* Logo */}
          <div className="shrink-0">
            <img
              src="/pps-logo-white.svg"
              alt="PPS"
              className="h-20 sm:h-28 w-auto"
            />
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-20 flex-1">
            <FooterColumn title="Membership" links={membershipLinks} />
            <FooterColumn title="Solutions" links={solutionsLinks} />
            <FooterColumn title="About & Support" links={supportLinks} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-cream/20" />

        {/* Newsletter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 py-12">
          <div>
            <p className="text-gold text-2xl sm:text-[32px] tracking-[0.04em] leading-[1.2] mb-4">
              Sign up to our newsletter
            </p>
            <p className="text-white text-[13px] tracking-[0.04em]">
              Stay informed, get the latest financial insights and updates from PPS.
            </p>
          </div>
          <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none sm:w-[280px] h-12 rounded-full border border-white px-5 flex items-center">
              <span className="text-white/30 text-[13px] tracking-[0.04em]">Your email</span>
            </div>
            <button className="shrink-0 h-12 px-6 rounded-full border border-white/20 text-white text-[13px] tracking-[0.04em] hover:bg-white/5 transition-colors shadow-[0_0_17.5px_rgba(255,255,255,0.4)]">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="bg-navy-dark">
        <div className="mx-auto max-w-[1488px] px-4 sm:px-8 lg:px-14 py-6 flex flex-wrap justify-center gap-x-2 gap-y-1">
          {disclaimerLinks.map((link, i) => (
            <span key={link}>
              <span className="text-white text-[13px] tracking-[0.04em] hover:text-gold/80 cursor-pointer transition-colors">
                {link}
              </span>
              {i < disclaimerLinks.length - 1 && (
                <span className="text-white/40 mx-1">/</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
