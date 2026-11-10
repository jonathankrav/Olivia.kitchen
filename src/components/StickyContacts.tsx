import { Link } from '@tanstack/react-router'
import { Mail, MessageCircle, Phone } from 'lucide-react'
import { contact, content, type Language } from '@/lib/content'
import { rememberScroll } from '@/lib/scroll-position'

const languageNames: Record<Language, string> = { en: 'English', he: 'עברית', ru: 'Русский' }

export function StickyContacts({ language, paths, whatsappUrl }: { language: Language; paths: Record<Language, string>; whatsappUrl: string }) {
  const text = content[language]
  return (
    <nav className="sticky-contacts" aria-label={text.contactsLabel}>
      <a href={`tel:${contact.phoneE164}`} aria-label={`${text.callLabel}: ${contact.phone}`}><Phone size={17} aria-hidden="true" /><span dir="ltr">{contact.phone}</span></a>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><MessageCircle size={17} aria-hidden="true" /><span>WhatsApp</span></a>
      <a href={`mailto:${contact.email}`} aria-label={`${text.writeLabel}: ${contact.email}`}><Mail size={17} aria-hidden="true" /><span dir="ltr">{contact.email}</span></a>
      <div className="languages" role="group" aria-label={text.language}>
        {(['en', 'he', 'ru'] as Language[]).map(option => <Link key={option} to={paths[option]} resetScroll={false} onClick={rememberScroll} hrefLang={option} lang={option} aria-label={languageNames[option]} aria-current={language === option ? 'page' : undefined}>{option === 'he' ? 'עב' : option.toUpperCase()}</Link>)}
      </div>
    </nav>
  )
}
