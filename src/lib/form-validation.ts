export const nameMax = 60
export const messageMax = 2000

export function isEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}

export function normalizePhone(value: string) {
  const compact = value.replace(/[\s\-().]/g, '')
  return compact.startsWith('00') ? `+${compact.slice(2)}` : compact
}

export function isPhone(value: string) {
  const phone = normalizePhone(value)
  return /^\+[1-9]\d{7,14}$/.test(phone) || /^0\d{8,9}$/.test(phone)
}

export function isGuests(value: string) {
  return /^\d{1,3}$/.test(value) && Number(value) >= 1 && Number(value) <= 999
}

export function todayISO(date = new Date()) {
  const pad = (number: number) => String(number).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function isDateFromToday(value: string, today = todayISO()) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= today
}
