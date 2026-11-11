import { contact } from '@/lib/content'
import { formatEventDate, type Order } from '@/lib/orders-types'

export async function emailOrderFile(order: Order): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  const { buildOrdersXlsx } = await import('@/lib/orders-export')
  const label = `${order.name || 'без имени'}, ${formatEventDate(order.date) || 'без даты'}`
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'Olivia’s Kitchen <zayavki@olivia.kitchen>',
      to: [process.env.MAIL_TO || contact.email],
      subject: `Заявка: ${label}`,
      text: `Заявка в приложенном файле: ${label}.`,
      attachments: [{ filename: `zayavka-${order.id.slice(0, 8)}.xlsx`, content: Buffer.from(buildOrdersXlsx([order])).toString('base64') }],
    }),
  })
  return response.ok
}

export async function runOrdersBackup(): Promise<{ ok: boolean; orders: number; emailed: boolean }> {
  const store = await import('@/server/orders-store')
  if (!store.storeConfigured()) return { ok: false, orders: 0, emailed: false }
  const orders = await store.listOrders()
  const key = process.env.RESEND_API_KEY
  if (!key || orders.length === 0 || !(await store.claimBackupSlot())) return { ok: true, orders: orders.length, emailed: false }
  const { buildOrdersXlsx } = await import('@/lib/orders-export')
  const today = new Date().toISOString().slice(0, 10)
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'Olivia’s Kitchen <zayavki@olivia.kitchen>',
      to: [process.env.MAIL_TO || contact.email],
      subject: `Копия заявок Olivia’s Kitchen, ${today}`,
      text: `Автоматическая резервная копия: ${orders.length} заявок в приложенном файле.`,
      attachments: [{ filename: `zayavki-${today}.xlsx`, content: Buffer.from(buildOrdersXlsx(orders)).toString('base64') }],
    }),
  })
  return { ok: true, orders: orders.length, emailed: response.ok }
}
