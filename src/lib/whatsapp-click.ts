import { reportWhatsappClick } from '@/lib/notify'

const storageKey = 'ok_wa_click'
const quietMinutes = 10

export function trackWhatsapp() {
  try {
    const last = Number(window.sessionStorage.getItem(storageKey) ?? 0)
    if (Date.now() - last < quietMinutes * 60_000) return
    window.sessionStorage.setItem(storageKey, String(Date.now()))
  } catch {}
  try {
    const call = reportWhatsappClick as unknown as (options: { data: { page: string } }) => Promise<unknown>
    void call({ data: { page: window.location.pathname } }).catch(() => {})
  } catch {}
}
