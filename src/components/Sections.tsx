import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { sections, type Language } from '@/lib/content'

export function ServicesSection({ language }: { language: Language }) {
  const { services } = sections[language]
  return (
    <section id="services" className="services section-wrap">
      <div className="services-top">
        <div><span className="eyebrow">{services.label}</span><h2>{services.title}</h2></div>
        <div className="services-lead"><p>{services.intro}</p><div className="services-count"><strong>{services.guests[0]}</strong><span>{services.guests[1]}</span></div></div>
      </div>
      <div className="services-groups">{services.groups.map((group, index) => <div className="services-group" key={group.title}>
        <span className="services-index">0{index + 1}</span>
        <h3>{group.title}</h3>
        <ul>{group.items.map(item => <li key={item.title}><strong>{item.title}</strong><p>{item.text}</p></li>)}</ul>
      </div>)}</div>
      <div className="services-cta"><p>{services.note}</p><a className="button" href="#contact">{services.button}<ArrowRight size={17} /></a></div>
    </section>
  )
}

export function KashrutSection({ language }: { language: Language }) {
  const { kashrut } = sections[language]
  return (
    <section id="kashrut" className="kashrut section-wrap">
      <div className="section-heading"><div><span className="eyebrow">{kashrut.label}</span><h2>{kashrut.title}</h2></div><p>{kashrut.intro}</p></div>
      <div className="info-grid">{kashrut.options.map(option => <article className="info-card" key={option.title}><h3>{option.title}</h3><p>{option.text}</p></article>)}</div>
    </section>
  )
}

export function AreasSection({ language }: { language: Language }) {
  const { areas } = sections[language]
  return (
    <section id="areas" className="areas section-wrap">
      <div className="section-heading"><div><span className="eyebrow">{areas.label}</span><h2>{areas.title}</h2></div><p>{areas.text}</p></div>
      <ul className="area-list">{areas.cities.map(city => <li key={city}>{city}</li>)}</ul>
      {areas.links.length > 0 && <div className="area-links">{areas.links.map(link => <Link className="text-link" key={link.to} to={link.to}>{link.label}<ArrowUpRight size={16} /></Link>)}</div>}
    </section>
  )
}

export function FaqSection({ language }: { language: Language }) {
  const { faq } = sections[language]
  return (
    <section id="faq" className="faq section-wrap">
      <div className="section-heading"><div><span className="eyebrow">{faq.label}</span><h2>{faq.title}</h2></div></div>
      <div className="faq-list">{faq.items.map(item => <details className="faq-item" key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
    </section>
  )
}
