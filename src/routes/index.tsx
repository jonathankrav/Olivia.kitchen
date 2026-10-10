import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Leaf, Mail, Menu, MessageCircle, Plus, Utensils, X } from 'lucide-react'
import { contact, content, type Language } from '@/lib/content'

export const Route = createFileRoute('/')({ component: OliviaKitchen })

const cuisineKeys = ['israeli', 'italian', 'azerbaijani']
const dishes = ['table', ...cuisineKeys]
const imageUrl = (name: string, width = 1000) => `/.netlify/images?url=/img/${name}.png&w=${width}&fm=webp&q=85`

function OliviaKitchen() {
  const [language, setLanguage] = useState<Language>('en')
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [activeImage, setActiveImage] = useState<number | null>(null)
  const [whatsappNotice, setWhatsappNotice] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const galleryDialog = useRef<HTMLDialogElement>(null)
  const whatsappDialog = useRef<HTMLDialogElement>(null)
  const text = content[language]
  const direction = language === 'he' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction
  }, [language, direction])

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
    const fields = new FormData(form)
    const body = new URLSearchParams()
    fields.forEach((value, key) => body.append(key, String(value)))
    setFormState('sending')
    try {
      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      if (!response.ok) throw new Error('Submission failed')
      setFormState('success')
      form.reset()
    } catch {
      setFormState('error')
    }
  }

  const whatsappUrl = contact.whatsappNumber
    ? `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent('Hello Olivia, I would love to plan a private dining experience.')}`
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
            {(['en', 'he', 'ru'] as Language[]).map(option => <button key={option} lang={option} aria-label={{ en: 'English', he: 'עברית', ru: 'Русский' }[option]} aria-pressed={language === option} onClick={() => setLanguage(option)}>{option === 'he' ? 'עב' : option.toUpperCase()}</button>)}
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
            <img src={imageUrl('table', 1400)} srcSet={`${imageUrl('table', 800)} 800w, ${imageUrl('table', 1400)} 1400w`} sizes="(max-width: 760px) 100vw, 55vw" alt={text.dishes[0]} fetchPriority="high" width="1400" height="1000" />
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
            <a href="#contact" className="cuisine-image" aria-label={`${text.book} — ${text.cuisineNames[index]}`}><img src={imageUrl(key, 700)} alt={text.dishes[index + 1]} loading="lazy" width="700" height="700" /><span className="cuisine-number">0{index + 1}</span><span className="round-arrow"><ArrowUpRight size={22} /></span></a>
            <div className="cuisine-title"><h3>{text.cuisineNames[index]}</h3><span>✳</span></div><span className="cuisine-note">{text.cuisineNotes[index]}</span><p>{text.cuisineDescriptions[index]}</p>
          </article>)}</div>
        </section>

        <section id="gallery" className="gallery-section">
          <div className="section-wrap">
            <div className="section-heading"><div><span className="eyebrow">{text.galleryLabel}</span><h2>{text.galleryTitle}</h2><p>{text.galleryText}</p></div><div className="gallery-filters" role="group" aria-label={text.galleryTitle}>{['all', ...cuisineKeys].map((key, index) => <button key={key} aria-pressed={filter === key} className={filter === key ? 'active' : ''} onClick={() => setFilter(key)}>{index === 0 ? text.all : text.cuisineNames[index - 1]}</button>)}</div></div>
            <div className={`gallery-grid ${filter !== 'all' ? 'filtered' : ''}`}>
              {dishes.map((dish, index) => (filter === 'all' || filter === dish) && <button className={`gallery-item gallery-item-${index}`} key={dish} onClick={() => setActiveImage(index)} aria-label={`${text.viewImage}: ${text.dishes[index]}`}><img src={imageUrl(dish, index === 0 ? 1100 : 700)} alt={text.dishes[index]} loading="lazy" width="900" height="700" /><span className="gallery-caption">{text.dishes[index]}<Plus size={21} /></span></button>)}
            </div>
            <p className="image-disclosure">{text.imageDisclosure}</p>
          </div>
        </section>

        <section id="contact" className="contact-section section-wrap">
          <div className="contact-copy"><span className="eyebrow">{text.contactLabel}</span><h2>{text.contactTitle}</h2><p>{text.contactText}</p><div className="contact-email"><span className="eyebrow">{text.emailLabel}</span><a href={`mailto:${contact.email}`}>{contact.email}<ArrowUpRight size={20} /></a></div>
            {whatsappUrl ? <a className="whatsapp-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} />{text.whatsapp}<ArrowUpRight size={15} /></a> : <button className="whatsapp-link" onClick={() => setWhatsappNotice(true)}><MessageCircle size={19} />{text.whatsapp}<ArrowUpRight size={15} /></button>}
            <span className="contact-flower" aria-hidden="true">✳</span>
          </div>
          <div className="form-panel">
            {formState === 'success' ? <div className="form-success" role="status"><span className="success-icon"><Check size={30} /></span><h3>{text.success}</h3><p>{text.successText}</p><button className="button" onClick={() => setFormState('idle')}>{text.another}<ArrowRight size={17} /></button></div> : <form name="chef-inquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmit}>
              <input type="hidden" name="form-name" value="chef-inquiry" /><input type="hidden" name="language" value={language} /><input type="hidden" name="subject" value="New private dining inquiry — Olivia Kitchen" />
              <div hidden><label>Leave this empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></div>
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

      <footer><div className="footer-main"><a href="#" className="brand footer-brand"><span>olivia<span className="brand-dot">.</span></span><small>THE PRIVATE KITCHEN</small></a><p>{text.footer}</p><a className="back-top" href="#" aria-label={text.top}><ArrowUpRight size={23} /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {text.rights}</span><span>{text.cuisineNames.join(' · ')}</span><a href={`mailto:${contact.email}`}>{contact.email}</a></div></footer>

      <dialog ref={galleryDialog} className="lightbox" onCancel={() => setActiveImage(null)} onClick={event => { if (event.target === event.currentTarget) setActiveImage(null) }} aria-label={text.galleryTitle} onKeyDown={event => { if (event.key === 'ArrowRight' && activeImage !== null) setActiveImage((activeImage + 1) % dishes.length); if (event.key === 'ArrowLeft' && activeImage !== null) setActiveImage((activeImage + dishes.length - 1) % dishes.length) }}>
        {activeImage !== null && <div className="lightbox-inner"><button autoFocus className="lightbox-close icon-button" onClick={() => setActiveImage(null)} aria-label={text.close}><X /></button><img src={imageUrl(dishes[activeImage], 1600)} alt={text.dishes[activeImage]} /><div className="lightbox-bottom"><button className="icon-button" onClick={() => setActiveImage((activeImage + dishes.length - 1) % dishes.length)} aria-label={language === 'he' ? 'הקודם' : language === 'ru' ? 'Назад' : 'Previous image'}><ChevronLeft /></button><p>{text.dishes[activeImage]}</p><button className="icon-button" onClick={() => setActiveImage((activeImage + 1) % dishes.length)} aria-label={language === 'he' ? 'הבא' : language === 'ru' ? 'Далее' : 'Next image'}><ChevronRight /></button></div></div>}
      </dialog>
      <dialog ref={whatsappDialog} className="contact-dialog" onCancel={() => setWhatsappNotice(false)} onClick={event => { if (event.target === event.currentTarget) setWhatsappNotice(false) }} aria-labelledby="whatsapp-title"><button autoFocus className="dialog-close icon-button" aria-label={text.close} onClick={() => setWhatsappNotice(false)}><X /></button><MessageCircle size={32} /><h3 id="whatsapp-title">{text.whatsapp}</h3><p>{text.whatsappUnavailable}</p><a href={`mailto:${contact.email}`} className="button"><Mail size={18} />{contact.email}</a><a className="share-link" href={`https://wa.me/?text=${encodeURIComponent('Olivia Kitchen — Israeli, Italian & Azerbaijani private dining. https://super-conkies-52d942.netlify.app')}`} target="_blank" rel="noopener noreferrer">{text.share}<ArrowUpRight size={16} /></a></dialog>
    </div>
  )
}
