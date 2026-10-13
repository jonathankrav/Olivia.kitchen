import { Link } from '@tanstack/react-router'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { contact, content, localPages, type LocalPageKey } from '@/lib/content'
import { AreasSection, FaqSection, KashrutSection } from '@/components/Sections'

export function LocalPage({ pageKey }: { pageKey: LocalPageKey }) {
  const page = localPages[pageKey]
  const text = content.he
  const whatsappUrl = `https://wa.me/${contact.whatsappNumber.replace(/\D/g, '')}`
  return (
    <div className="site" dir="rtl">
      <a className="skip-link" href="#main">{text.skip}</a>
      <header className="header">
        <Link className="brand" to="/" aria-label="Olivia Kitchen"><span>Olivia<span className="brand-dot">.</span></span><small>THE PRIVATE KITCHEN</small></Link>
        <div className="header-actions">
          <Link to="/" hash="contact" className="button header-book">{text.book}<ArrowUpRight size={15} /></Link>
        </div>
      </header>

      <main id="main">
        <section className="local-hero section-wrap">
          <span className="eyebrow"><span className="small-line" />{page.eyebrow}</span>
          <h1>{page.heading}</h1>
          {page.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <div className="hero-actions">
            <Link className="button" to="/" hash="contact">{text.book}<ArrowUpRight size={18} /></Link>
            <a className="text-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} />{text.whatsapp}</a>
          </div>
        </section>

        <section className="kitchens section-wrap">
          <div className="section-heading"><div><span className="eyebrow">{text.kitchensLabel}</span><h2>{text.kitchensTitle}</h2></div><p>{text.kitchensIntro}</p></div>
          <div className="info-grid">{text.cuisineNames.map((name, index) => <article className="info-card" key={name}><h3>{name}</h3><span className="cuisine-note">{text.cuisineNotes[index]}</span><p>{text.cuisineDescriptions[index]}</p></article>)}</div>
        </section>

        <KashrutSection language="he" />
        <AreasSection language="he" />
        <FaqSection language="he" />

        <section className="local-cta section-wrap">
          <h2>{text.contactTitle}</h2>
          <p>{text.contactText}</p>
          <div className="hero-actions">
            <Link className="button" to="/" hash="contact">{text.send}<ArrowUpRight size={18} /></Link>
            <Link className="text-link" to={page.otherTo}>{page.otherLabel}<ArrowUpRight size={16} /></Link>
          </div>
        </section>
      </main>

      <footer><div className="footer-main"><Link to="/" className="brand footer-brand"><span>Olivia<span className="brand-dot">.</span></span><small>THE PRIVATE KITCHEN</small></Link><p>{text.footer}</p></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {text.rights}</span><span>{text.cuisineNames.join(' · ')}</span><a href={`mailto:${contact.email}`}>{contact.email}</a></div></footer>
    </div>
  )
}
