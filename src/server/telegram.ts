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

const recent: number[] = []

function clean(value: unknown, limit: number) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, limit) : ''
}

export async function sendRequestNotification(input: unknown): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId || typeof input !== 'object' || input === null) return false
  const fields = input as Record<string, unknown>
  if (clean(fields._honey, 20)) return false
  const lines = labels
    .map(([key, label]) => [label, clean(fields[key], key === 'message' ? 1500 : 200)] as const)
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
  if (lines.length === 0) return false
  const now = Date.now()
  while (recent.length > 0 && now - recent[0] > 60_000) recent.shift()
  if (recent.length >= 8) return false
  recent.push(now)
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: `Новая заявка с olivia.kitchen\n\n${lines.join('\n')}`, disable_web_page_preview: true }),
  })
  return response.ok
}

export async function sendMailProblem(detail: unknown): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return false
  const text = `Внимание: письмо с заявкой на почту не отправилось.\n${clean(detail, 400)}`
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
  return response.ok
}
