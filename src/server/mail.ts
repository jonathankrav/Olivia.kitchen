import { contact } from '@/lib/content'
import { cuisineLabel, formatEventDate } from '@/lib/orders-types'

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

function shown(key: string, value: string) {
  if (key === 'date' && value) return formatEventDate(value)
  if (key === 'cuisine' && value) return cuisineLabel(value)
  return value
}

function clean(value: unknown, limit: number) {
  return typeof value === 'string' ? value.replace(/\r\n/g, '\n').trim().slice(0, limit) : ''
}

export async function sendRequestEmail(input: unknown): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key || typeof input !== 'object' || input === null) return false
  const fields = input as Record<string, unknown>
  if (clean(fields._honey, 20)) return false
  const rows = labels
    .map(([name, label]) => [label, shown(name, clean(fields[name], name === 'message' ? 3000 : 200))] as const)
    .filter(([, value]) => value)
  if (rows.length === 0) return false
  const replyTo = clean(fields.email, 200)
  const name = clean(fields.name, 80).replace(/[\r\n]/g, ' ')
  const date = clean(fields.date, 60).replace(/[\r\n]/g, ' ')
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'Olivia’s Kitchen <orders@olivia.kitchen>',
      to: [process.env.MAIL_TO || contact.email],
      ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo) ? { reply_to: replyTo } : {}),
      subject: `Новая заявка${name ? `: ${name}` : ''}${date ? `, ${date}` : ''}`,
      text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
    }),
  })
  return response.ok
}

type Reply = { subject: string; greeting: (name: string) => string; lines: string[]; recap: string; date: string; guests: string; closing: string[]; signature: string; dir: 'ltr' | 'rtl'; lang: string }

const replies: Record<string, Reply> = {
  ru: {
    subject: 'Получила вашу заявку',
    greeting: name => `Здравствуйте${name ? `, ${name}` : ''}!`,
    lines: ['Спасибо, что написали мне. Ваша заявка пришла, я прочитаю её и отвечу лично.', 'Обычно отвечаю в течение дня. Если вопрос срочный, напишите мне в WhatsApp или позвоните.'],
    recap: 'Что вы мне прислали:', date: 'Дата', guests: 'Гостей',
    closing: ['Пока можно посмотреть примерное меню на сайте. Окончательное меню мы составим вместе, под вашу компанию и ваш вечер.'],
    signature: 'Оливия', dir: 'ltr', lang: 'ru',
  },
  en: {
    subject: 'I received your inquiry',
    greeting: name => `Hello${name ? ` ${name}` : ''},`,
    lines: ['Thank you for writing to me. Your inquiry has arrived, and I will read it and reply personally.', 'I usually answer within a day. If it is urgent, message me on WhatsApp or call.'],
    recap: 'What you sent me:', date: 'Date', guests: 'Guests',
    closing: ['In the meantime you can look at the sample menu on the site. We will shape the final menu together around your guests and your evening.'],
    signature: 'Olivia', dir: 'ltr', lang: 'en',
  },
  he: {
    subject: 'קיבלתי את הפנייה שלכם',
    greeting: name => `שלום${name ? ` ${name}` : ''},`,
    lines: ['תודה שכתבתם לי. הפנייה הגיעה, אקרא אותה ואחזור אליכם באופן אישי.', 'בדרך כלל אני עונה תוך יום. אם זה דחוף, כתבו לי בוואטסאפ או התקשרו.'],
    recap: 'מה ששלחתם לי:', date: 'תאריך', guests: 'אורחים',
    closing: ['בינתיים אפשר להסתכל על התפריט לדוגמה באתר. את התפריט הסופי נבנה יחד, לפי האורחים והערב שלכם.'],
    signature: 'אוליביה', dir: 'rtl', lang: 'he',
  },
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function plainDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  return match ? `${match[3]}.${match[2]}.${match[1]}` : value
}

export async function sendClientReply(input: unknown): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key || typeof input !== 'object' || input === null) return false
  const fields = input as Record<string, unknown>
  if (clean(fields._honey, 20)) return false
  const to = clean(fields.email, 200)
  if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(to)) return false
  const language = clean(fields.language, 5)
  const copy = replies[language] ?? replies.he
  const name = clean(fields.name, 60).replace(/[\r\n<>]/g, ' ')
  const date = plainDate(clean(fields.date, 20))
  const guests = clean(fields.guests, 10)
  const base = (language === 'en' ? '/en' : language === 'ru' ? '/ru' : '/')
  const site = `https://olivia.kitchen${base === '/' ? '' : base}#menu`
  const whatsapp = `https://wa.me/${contact.whatsappNumber.replace(/\D/g, '')}`
  const recap = [date ? `${copy.date}: ${date}` : '', guests ? `${copy.guests}: ${guests}` : ''].filter(Boolean)
  const text = [copy.greeting(name), '', ...copy.lines, '', ...(recap.length ? [copy.recap, ...recap, ''] : []), ...copy.closing, site, '', `WhatsApp: ${whatsapp}`, `${contact.phone}`, '', copy.signature, 'Olivia’s Kitchen'].join('\n')
  const html = `<div dir="${copy.dir}" lang="${copy.lang}" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#2a3326;max-width:560px">`
    + `<p>${escapeHtml(copy.greeting(name))}</p>${copy.lines.map(line => `<p>${escapeHtml(line)}</p>`).join('')}`
    + (recap.length ? `<p>${escapeHtml(copy.recap)}<br>${recap.map(escapeHtml).join('<br>')}</p>` : '')
    + `${copy.closing.map(line => `<p>${escapeHtml(line)}</p>`).join('')}<p><a href="${site}">olivia.kitchen</a></p>`
    + `<p><a href="${whatsapp}">WhatsApp</a> · <span dir="ltr">${escapeHtml(contact.phone)}</span></p><p>${escapeHtml(copy.signature)}<br>Olivia’s Kitchen</p></div>`
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'Olivia’s Kitchen <orders@olivia.kitchen>',
      to: [to],
      reply_to: contact.email,
      subject: copy.subject,
      text,
      html,
    }),
  })
  return response.ok
}
