import { contact } from '@/lib/content'

const labels: [string, string][] = [
  ['name', 'Имя'],
  ['phone', 'Телефон'],
  ['email', 'Email'],
  ['date', 'Дата'],
  ['guests', 'Гостей'],
  ['cuisine', 'Кухня'],
  ['language', 'Язык'],
  ['message', 'Сообщение'],
  ['origin', 'Откуда пришёл'],
]

function clean(value: unknown, limit: number) {
  return typeof value === 'string' ? value.replace(/\r\n/g, '\n').trim().slice(0, limit) : ''
}

export async function sendRequestEmail(input: unknown): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key || typeof input !== 'object' || input === null) return false
  const fields = input as Record<string, unknown>
  if (clean(fields._honey, 20)) return false
  const rows = labels
    .map(([name, label]) => [label, clean(fields[name], name === 'message' ? 3000 : 200)] as const)
    .filter(([, value]) => value)
  if (rows.length === 0) return false
  const replyTo = clean(fields.email, 200)
  const name = clean(fields.name, 80).replace(/[\r\n]/g, ' ')
  const date = clean(fields.date, 60).replace(/[\r\n]/g, ' ')
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'Olivia’s Kitchen <zayavki@olivia.kitchen>',
      to: [process.env.MAIL_TO || contact.email],
      ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo) ? { reply_to: replyTo } : {}),
      subject: `Новая заявка${name ? `: ${name}` : ''}${date ? `, ${date}` : ''}`,
      text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
    }),
  })
  return response.ok
}
