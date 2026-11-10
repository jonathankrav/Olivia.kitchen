import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'
import type { Language } from '@/lib/content'
import { rememberScroll } from '@/lib/scroll-position'

const hints: Record<'en' | 'ru', { text: string; go: string; close: string }> = {
  en: { text: 'This site is in Hebrew. Would you like to view it in English?', go: 'View in English', close: 'Close' },
  ru: { text: 'Сайт открыт на иврите. Хотите посмотреть его на русском?', go: 'Русская версия', close: 'Закрыть' },
}

const storageKey = 'ok_lang_hint'

export function LanguageHint({ language, paths }: { language: Language; paths: Record<Language, string> }) {
  const [device, setDevice] = useState<'en' | 'ru' | null>(null)

  useEffect(() => {
    if (language !== 'he') return
    try {
      if (localStorage.getItem(storageKey)) return
    } catch {}
    const preferred = (navigator.languages?.length ? navigator.languages : [navigator.language]).map(item => String(item).toLowerCase().slice(0, 2))
    const first = preferred.find(item => item === 'he' || item === 'en' || item === 'ru')
    if (first === 'en' || first === 'ru') setDevice(first)
  }, [language])

  if (language !== 'he' || !device) return null
  const hint = hints[device]

  function close() {
    try {
      localStorage.setItem(storageKey, '1')
    } catch {}
    setDevice(null)
  }

  return (
    <div className="lang-hint" role="region" aria-label={hint.go} lang={device} dir="ltr">
      <span>{hint.text}</span>
      <Link to={paths[device]} resetScroll={false} onClick={() => { rememberScroll(); try { localStorage.setItem(storageKey, '1') } catch {} }}>{hint.go}</Link>
      <button type="button" onClick={close} aria-label={hint.close}><X size={16} aria-hidden="true" /></button>
    </div>
  )
}
