import { Link } from '@tanstack/react-router'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { contact, content, galleryPhotos, localGalleryFiles, localPages, sections, type LocalPageKey } from '@/lib/content'
import { AreasSection, FaqSection, KashrutSection, ServicesSection, VideoSection } from '@/components/Sections'

export function LocalPage({ pageKey }: { pageKey: LocalPageKey }) {
  const page = localPages[pageKey]
  const text = content.he
  const alts = sections.he.alts
  const cuisineKeys = ['israeli', 'italian', 'azerbaijani']
  const galleryPicks = localGalleryFiles.flatMap(file => galleryPhotos.filter(photo => photo.file === file))
  const whatsappUrl = `https://wa.me/${contact.whatsappNumber.replace(/\D/g, '')}`
  return (
    <div className="site" dir="rtl">
      <a className="skip-link" href="#main">{text.skip}</a>
      <header className="header">
        <Link className="brand" to="/" aria-label="Olivia’s Kitchen"><img className="brand-mark" src="/logo.svg" alt="" width="52" height="52" /><span className="brand-text"><span className="brand-name">Olivia’s Kitchen</span><small>{text.slogan}</small></span></Link>
        <div className="header-actions">
          <Link to="/" hash="contact" className="button header-book">{text.book}<ArrowUpRight size={15} /></Link>
        </div>
      </header>
      <p className="slogan-bar">{text.slogan}</p>

      <main id="main">
        <section className="local-hero section-wrap">
          <div className="local-hero-copy">
            <span className="eyebrow"><span className="small-line" />{page.eyebrow}</span>
            <h1>{page.heading}</h1>
            {page.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            <div className="hero-actions">
              <Link className="button" to="/" hash="contact">{text.book}<ArrowUpRight size={18} /></Link>
              <a className="text-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} />{text.whatsapp}</a>
            </div>
          </div>
          <figure className="local-hero-photo"><img src={`/img/${page.heroImage.file}.webp`} alt={alts[page.heroImage.altIndex]} width={page.heroImage.width} height={page.heroImage.height} fetchPriority="high" /></figure>
        </section>

        <ServicesSection language="he" contactHref="/#contact" />

        <section className="kitchens section-wrap">
          <div className="section-heading"><div><span className="eyebrow">{text.kitchensLabel}</span><h2>{text.kitchensTitle}</h2></div><p>{text.kitchensIntro}</p></div>
          <div className="cuisine-grid">{cuisineKeys.map((key, index) => <article className="cuisine-card" key={key}>
            <Link to="/" hash="contact" className="cuisine-image" aria-label={`${text.book} — ${text.cuisineNames[index]}`}><img src={`/img/${key}.webp`} alt={alts[index + 1]} loading="lazy" width="1120" height="1000" /><span className="cuisine-number">0{index + 1}</span><span className="round-arrow"><ArrowUpRight size={22} /></span></Link>
            <div className="cuisine-title"><h3>{text.cuisineNames[index]}</h3><span>✳</span></div><span className="cuisine-note">{text.cuisineNotes[index]}</span><p>{text.cuisineDescriptions[index]}</p>
          </article>)}</div>
        </section>

        <KashrutSection language="he" />

        <section className="local-gallery-section">
          <div className="section-wrap">
            <div className="section-heading"><div><span className="eyebrow">{text.galleryLabel}</span><h2>{text.galleryTitle}</h2></div><Link className="text-link" to="/" hash="gallery">{text.galleryMore}<ArrowUpRight size={16} /></Link></div>
            <div className="local-gallery">{galleryPicks.map(photo => <figure key={photo.file}><img src={`/img/${photo.file}-sm.webp`} alt={photo.captions.he} loading="lazy" width={photo.smWidth} height={photo.smHeight} /><figcaption>{photo.captions.he}</figcaption></figure>)}</div>
          </div>
        </section>

        <VideoSection language="he" />
        <AreasSection language="he" />
        <FaqSection language="he" />

        <section className="contacts section-wrap">
          <div className="contacts-heading"><span className="eyebrow">{text.contactsLabel}</span><h2>{text.contactsTitle}</h2><p>{text.contactsText}</p></div>
          <ul className="contacts-list">
            <li><span className="eyebrow">{text.callLabel}</span><a href={`tel:${contact.phoneE164}`} dir="ltr">{contact.phone}</a></li>
            <li><span className="eyebrow">{text.writeLabel}</span><a href={`mailto:${contact.email}`} dir="ltr">{contact.email}</a></li>
            <li><span className="eyebrow">WHATSAPP</span><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">{text.chatLabel}</a></li>
            <li><span className="eyebrow">{text.areaLabel}</span><span className="contacts-value">{text.areaValue}</span></li>
          </ul>
        </section>

        <section className="local-cta section-wrap">
          <h2>{text.contactTitle}</h2>
          <p>{text.contactText}</p>
          <div className="hero-actions">
            <Link className="button" to="/" hash="contact">{text.send}<ArrowUpRight size={18} /></Link>
            <Link className="text-link" to={page.otherTo}>{page.otherLabel}<ArrowUpRight size={16} /></Link>
          </div>
        </section>
      </main>

      <footer><div className="footer-main"><Link className="brand footer-brand" to="/"><img className="brand-mark" src="/logo.svg" alt="" width="52" height="52" /><span className="brand-text"><span className="brand-name">Olivia’s Kitchen</span><small>{text.slogan}</small></span></Link><p>{text.footer}</p></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {text.rights}</span><span>{text.cuisineNames.join(' · ')}</span><a href={`tel:${contact.phoneE164}`} dir="ltr">{contact.phone}</a><a href={`mailto:${contact.email}`}>{contact.email}</a></div></footer>
    </div>
  )
}
