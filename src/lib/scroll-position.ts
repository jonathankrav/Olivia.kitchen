import { useEffect } from 'react'

const key = 'ok_scroll'

export function rememberScroll() {
  try {
    const sections = Array.from(document.querySelectorAll('main > section'))
    let index = -1
    let ratio = 0
    sections.forEach((section, position) => {
      const rect = section.getBoundingClientRect()
      if (rect.top <= 1 && rect.height > 0) {
        index = position
        ratio = Math.min(1, Math.max(0, -rect.top / rect.height))
      }
    })
    if (index < 0 || window.scrollY < 20) sessionStorage.removeItem(key)
    else sessionStorage.setItem(key, JSON.stringify({ index, ratio }))
  } catch {}
}

export function useRestoreScroll(language: string) {
  useEffect(() => {
    let saved: { index: number; ratio: number } | null = null
    try {
      const raw = sessionStorage.getItem(key)
      sessionStorage.removeItem(key)
      saved = raw ? JSON.parse(raw) : null
    } catch {}
    if (!saved) return
    const target = saved
    const apply = () => {
      const section = document.querySelectorAll('main > section')[target.index]
      if (!section) return
      const top = section.getBoundingClientRect().top + window.scrollY + target.ratio * section.getBoundingClientRect().height
      window.scrollTo({ top, behavior: 'instant' })
    }
    apply()
    const timers = [window.setTimeout(apply, 120), window.setTimeout(apply, 500)]
    return () => timers.forEach(window.clearTimeout)
  }, [language])
}
