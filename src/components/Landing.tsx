import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Leaf, Mail, Menu, MessageCircle, Plus, Utensils, X } from 'lucide-react'
import { AreasSection, FaqSection, KashrutSection } from '@/components/Sections'
import { contact, content, galleryPhotos, sections, type Language } from '@/lib/content'

const cuisineKeys = ['israeli', 'italian', 'azerbaijani']
const imageUrl = (name: string) => `/img/${name}.webp`
const galleryFilters = ['all', 'savoury', 'desserts'] as const
type GalleryFilter = (typeof galleryFilters)[number]

const languagePaths: Record<Language, string> = { en: '/en', he: '/', ru: '/ru' }

export function Landing({ language }: { language: Language }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState<GalleryFilter>('all')
  const [activeImage, setActiveImage] = useState<number | null>(null)
  const [whatsappNotice, setWhatsappNotice] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [siteUrl, setSiteUrl] = useState('')
  const galleryDialog = useRef<HTMLDialogElement>(null)
  const whatsappDialog = useRef<HTMLDialogElement>(null)
  const text = content[language]
  const alts = sections[language].alts
  const visiblePhotos = galleryPhotos.map((photo, index) => ({ photo, index })).filter(({ photo }) => filter === 'all' || photo.group === filter)
  const direction = language === 'he' ? 'rtl' : 'ltr'

  useEffect(() => {
    setSiteUrl(window.location.origin)
  }, [])

  useEffect(() => {
    const dialog = galleryDialog.current
    if (activeImage !== null) dialog?.showModal()
    else dialog?.close()
  }, [activeImage])

  useEffect(() => {
    if (whatsappNotice) whatsappDialog.current?.showModal()
    else whatsappDialog.current?.close()
  }, [whatsappNotice])

  useEffect(() => {
    if (activeImage === null && !whatsappNotice) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [activeImage, whatsappNotice])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (formState === 'sending') return
    const form = event.currentTarget
    const fields = Object.fromEntries(new FormData(form).entries())
    setFormState('sending')
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${contact.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...fields, _template: 'table', _captcha: 'false' }),
      })
      const result = await response.json()
      if (!response.ok || String(result.success) !== 'true') throw new Error('Submission failed')
      setFormState('success')
      form.reset()
    } catch {
      setFormState('error')
    }
  }

  const whatsappDigits = contact.whatsappNumber.replace(/\D/g, '')
  const whatsappUrl = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent('Hello Olivia, I would love to plan a private dining experience.')}`
    : null

  return (
    <div className="site" dir={direction}>
      <a className="skip-link" href="#main">{text.skip}</a>
      <header className="header">
        <a className="brand" href="#" aria-label="Olivia Kitchen"><span>Olivia<span className="brand-dot">.</span></span><small>THE PRIVATE KITCHEN</small></a>
        <nav className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label={text.menu}>
          {text.nav.map((label, index) => <a key={label} href={`#${['experience', 'kitchens', 'gallery'][index]}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <div className="languages" role="group" aria-label={text.language}>
            {(['en', 'he', 'ru'] as Language[]).map(option => <Link key={option} to={languagePaths[option]} hrefLang={option} lang={option} aria-label={{ en: 'English', he: 'עברית', ru: 'Русский' }[option]} aria-current={language === option ? 'page' : undefined}>{option === 'he' ? 'עב' : option.toUpperCase()}</Link>)}
          </div>
          <a href="#contact" className="button header-book">{text.book}<ArrowUpRight size={15} /></a>
          <button className="menu-toggle icon-button" aria-label={text.menu} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><span className="small-line" />{text.eyebrow}</span>
            <h1>{text.hero[0]}<br /><em>{text.hero[1]}</em></h1>
            <p>{text.intro}</p>
            <div className="hero-actions"><a className="button" href="#contact">{text.book}<ArrowUpRight size={18} /></a><a className="text-link" href="#kitchens">{text.explore}<ArrowRight size={16} /></a></div>
            <a className="scroll-note" href="#experience"><span><ArrowDown size={17} /></span>{text.scroll}</a>
          </div>
          <div className="hero-visual">
            <img src={imageUrl('hero')} alt={alts[0]} fetchPriority="high" width="1600" height="1143" />
            <div className="photo-label"><span className="star-flower">✳</span><span>{text.photoNote}</span></div>
            <div className="hero-stamp"><Utensils size={22} strokeWidth={1.2} /><span>{text.stamp[0]}<br />{text.stamp[1]}</span></div>
          </div>
        </section>

        <div className="values-strip">{text.ribbon.map((value, index) => <span key={value}>{index === 0 ? <Leaf size={17} /> : <span className="value-star">✧</span>}{value}</span>)}</div>

        <section id="experience" className="experience section-wrap">
          <div className="experience-heading"><span className="eyebrow">{text.experienceLabel}</span><h2>{text.experienceTitle}</h2></div>
          <div className="experience-copy"><p>{text.experienceText}</p><p className="experience-end">{text.experienceEnd}</p><span className="signature">{text.signature}</span></div>
        </section>

        <section id="kitchens" className="kitchens section-wrap">
          <div className="section-heading"><div><span className="eyebrow">{text.kitchensLabel}</span><h2>{text.kitchensTitle}</h2></div><p>{text.kitchensIntro}</p></div>
          <div className="cuisine-grid">{cuisineKeys.map((key, index) => <article className="cuisine-card" key={key}>
            <a href="#contact" className="cuisine-image" aria-label={`${text.book} — ${text.cuisineNames[index]}`}><img src={imageUrl(key)} alt={alts[index + 1]} loading="lazy" width="1120" height="1000" /><span className="cuisine-number">0{index + 1}</span><span className="round-arrow"><ArrowUpRight size={22} /></span></a>
            <div className="cuisine-title"><h3>{text.cuisineNames[index]}</h3><span>✳</span></div><span className="cuisine-note">{text.cuisineNotes[index]}</span><p>{text.cuisineDescriptions[index]}</p>
          </article>)}</div>
        </section>

        <KashrutSection language={language} />

        <section id="gallery" className="gallery-section">
          <div className="section-wrap">
            <div className="section-heading"><div><span className="eyebrow">{text.galleryLabel}</span><h2>{text.galleryTitle}</h2><p>{text.galleryText}</p></div><div className="gallery-filters" role="group" aria-label={text.galleryTitle}>{galleryFilters.map(key => <button key={key} aria-pressed={filter === key} className={filter === key ? 'active' : ''} onClick={() => setFilter(key)}>{key === 'all' ? text.all : text[key]}</button>)}</div></div>
            <div className="gallery-grid">
              {visiblePhotos.map(({ photo, index }) => <button className="gallery-item" key={photo.file} onClick={() => setActiveImage(index)} aria-label={`${text.viewImage}: ${photo.captions[language]}`}><img src={imageUrl(`${photo.file}-sm`)} alt={photo.captions[language]} loading="lazy" width={photo.smWidth} height={photo.smHeight} /><span className="gallery-caption">{photo.captions[language]}<Plus size={21} /></span></button>)}
            </div>
            <p className="image-disclosure">{text.imageDisclosure}</p>
          </div>
        </section>

        <AreasSection language={language} />
        <FaqSection language={language} />

        <section id="contact" className="contact-section section-wrap">
          <div className="contact-copy"><span className="eyebrow">{text.contactLabel}</span><h2>{text.contactTitle}</h2><p>{text.contactText}</p><div className="contact-email"><span className="eyebrow">{text.emailLabel}</span><a href={`mailto:${contact.email}`}>{contact.email}<ArrowUpRight size={20} /></a></div>
            {whatsappUrl ? <a className="whatsapp-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} />{text.whatsapp}<ArrowUpRight size={15} /></a> : <button className="whatsapp-link" onClick={() => setWhatsappNotice(true)}><MessageCircle size={19} />{text.whatsapp}<ArrowUpRight size={15} /></button>}
            <span className="contact-flower" aria-hidden="true">✳</span>
          </div>
          <div className="form-panel">
            {formState === 'success' ? <div className="form-success" role="status"><span className="success-icon"><Check size={30} /></span><h3>{text.success}</h3><p>{text.successText}</p><button className="button" onClick={() => setFormState('idle')}>{text.another}<ArrowRight size={17} /></button></div> : <form onSubmit={handleSubmit}>
              <input type="hidden" name="language" value={language} /><input type="hidden" name="_subject" value="New private dining inquiry — Olivia Kitchen" />
              <div hidden><label>Leave this empty<input name="_honey" tabIndex={-1} autoComplete="off" /></label></div>
              <div className="form-grid">
                <label>{text.name}<span className="required">*</span><input name="name" autoComplete="name" placeholder={text.namePlaceholder} required maxLength={100} /></label>
                <label>{text.email}<span className="required">*</span><input type="email" name="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} dir="ltr" /></label>
                <label>{text.phone}<small>({text.optional})</small><input type="tel" name="phone" autoComplete="tel" placeholder={text.phonePlaceholder} maxLength={40} dir="ltr" /></label>
                <label>{text.date}<small>({text.optional})</small><input type="date" name="date" /></label>
                <label>{text.guests}<small>({text.optional})</small><input type="number" name="guests" min="1" max="1000" placeholder="8" /></label>
                <label>{text.cuisine}<select name="cuisine" defaultValue="inspiration"><option value="inspiration">{text.choose}</option>{text.cuisineNames.map((name, index) => <option value={cuisineKeys[index]} key={name}>{name}</option>)}</select></label>
                <label className="full-width">{text.message}<textarea name="message" rows={4} placeholder={text.messagePlaceholder} maxLength={5000} /></label>
              </div>
              {formState === 'error' && <p className="form-error" role="alert">{text.error}</p>}
              <button type="submit" className="button submit-button" disabled={formState === 'sending'}>{formState === 'sending' ? text.sending : text.send}<ArrowUpRight size={19} /></button>
              <p className="privacy-note">{text.privacy}</p>
            </form>}
          </div>
        </section>
      </main>

      <footer><div className="footer-main"><a href="#" className="brand footer-brand"><span>Olivia<span className="brand-dot">.</span></span><small>THE PRIVATE KITCHEN</small></a><p>{text.footer}</p><a className="back-top" href="#" aria-label={text.top}><ArrowUpRight size={23} /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {text.rights}</span><span>{text.cuisineNames.join(' · ')}</span><a href={`mailto:${contact.email}`}>{contact.email}</a></div></footer>

      <dialog ref={galleryDialog} className="lightbox" onCancel={() => setActiveImage(null)} onClick={event => { if (event.target === event.currentTarget) setActiveImage(null) }} aria-label={text.galleryTitle} onKeyDown={event => { if (event.key === 'ArrowRight' && activeImage !== null) setActiveImage((activeImage + 1) % galleryPhotos.length); if (event.key === 'ArrowLeft' && activeImage !== null) setActiveImage((activeImage + galleryPhotos.length - 1) % galleryPhotos.length) }}>
        {activeImage !== null && <div className="lightbox-inner"><button autoFocus className="lightbox-close icon-button" onClick={() => setActiveImage(null)} aria-label={text.close}><X /></button><img src={imageUrl(galleryPhotos[activeImage].file)} alt={galleryPhotos[activeImage].captions[language]} width={galleryPhotos[activeImage].width} height={galleryPhotos[activeImage].height} /><div className="lightbox-bottom"><button className="icon-button" onClick={() => setActiveImage((activeImage + galleryPhotos.length - 1) % galleryPhotos.length)} aria-label={language === 'he' ? 'הקודם' : language === 'ru' ? 'Назад' : 'Previous image'}><ChevronLeft /></button><p>{galleryPhotos[activeImage].captions[language]}</p><button className="icon-button" onClick={() => setActiveImage((activeImage + 1) % galleryPhotos.length)} aria-label={language === 'he' ? 'הבא' : language === 'ru' ? 'Далее' : 'Next image'}><ChevronRight /></button></div></div>}
      </dialog>
      <dialog ref={whatsappDialog} className="contact-dialog" onCancel={() => setWhatsappNotice(false)} onClick={event => { if (event.target === event.currentTarget) setWhatsappNotice(false) }} aria-labelledby="whatsapp-title"><button autoFocus className="dialog-close icon-button" aria-label={text.close} onClick={() => setWhatsappNotice(false)}><X /></button><MessageCircle size={32} /><h3 id="whatsapp-title">{text.whatsapp}</h3><p>{text.whatsappUnavailable}</p><a href={`mailto:${contact.email}`} className="button"><Mail size={18} />{contact.email}</a><a className="share-link" href={`https://wa.me/?text=${encodeURIComponent(`Olivia Kitchen — Israeli, Italian & Azerbaijani private dining. ${siteUrl}`)}`} target="_blank" rel="noopener noreferrer">{text.share}<ArrowUpRight size={16} /></a></dialog>
    </div>
  )
}
