import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from '@tanstack/react-router'
import { createOrder, loginOrders, logoutOrders, removeOrder, updateOrder } from '@/lib/orders'
import { orderProfit, orderStatuses, type Order, type OrderPatch, type OrderStatus } from '@/lib/orders-types'

type Call<T> = (options: { data: Record<string, unknown> }) => Promise<T>

const money = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 })

function formatMoney(value: number | null) {
  return value === null ? '—' : `${money.format(value)} ₪`
}

function formatCreated(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('ru-RU', { timeZone: 'Asia/Jerusalem', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusLabel(status: OrderStatus) {
  return orderStatuses.find(item => item.value === status)?.label ?? status
}

export function OrdersLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(false)
    const result = await (loginOrders as unknown as Call<{ ok: boolean }>)({ data: { password } })
    setBusy(false)
    if (result.ok) await router.invalidate()
    else setError(true)
  }

  return (
    <main className="book-login" dir="ltr" lang="ru">
      <form className="book-login-card" onSubmit={submit}>
        <p className="book-login-mark">Olivia’s Kitchen</p>
        <h1>Заявки</h1>
        <p>Эта страница личная. Введите пароль.</p>
        <input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} aria-label="Пароль" required autoFocus />
        {error && <p className="book-login-error" role="alert">Пароль не подошёл. Попробуйте ещё раз.</p>}
        <button type="submit" disabled={busy}>{busy ? 'Проверяю…' : 'Открыть'}</button>
      </form>
    </main>
  )
}

function parseAmount(value: string): number | null {
  const cleaned = value.replace(/\s/g, '').replace(',', '.')
  if (cleaned === '') return null
  const number = Number(cleaned)
  return Number.isFinite(number) ? number : null
}

function OrderCard({ order, onChange, onDelete }: { order: Order; onChange: (order: Order) => void; onDelete: (id: string) => void }) {
  const [cost, setCost] = useState(order.cost === null ? '' : String(order.cost))
  const [revenue, setRevenue] = useState(order.revenue === null ? '' : String(order.revenue))
  const [expectations, setExpectations] = useState(order.expectations)
  const [result, setResult] = useState(order.result)
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const profit = orderProfit({ cost: parseAmount(cost), revenue: parseAmount(revenue) })
  const digits = order.phone.replace(/\D/g, '')

  async function save(patch: OrderPatch) {
    setState('saving')
    const response = await (updateOrder as unknown as Call<{ order: Order | null }>)({ data: { id: order.id, patch } })
    if (response.order) {
      onChange(response.order)
      setState('saved')
    } else setState('error')
  }

  return (
    <details className="ord-card">
      <summary>
        <span className="ord-name">{order.name || order.phone || 'Без имени'}</span>
        <span className={`ord-badge ord-${order.status}`}>{statusLabel(order.status)}</span>
        <span className="ord-meta">{order.date || formatCreated(order.createdAt)}{order.guests ? ` · ${order.guests} гост.` : ''}</span>
        <span className="ord-profit">{formatMoney(orderProfit(order))}</span>
      </summary>
      <div className="ord-body">
        <dl className="ord-info">
          <div><dt>Получена</dt><dd>{formatCreated(order.createdAt)}{order.source === 'manual' ? ' (добавлена вручную)' : ''}</dd></div>
          {order.phone && <div><dt>Телефон</dt><dd><a href={`tel:${order.phone}`}>{order.phone}</a>{digits && <> · <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer">WhatsApp</a></>}</dd></div>}
          {order.email && <div><dt>Email</dt><dd><a href={`mailto:${order.email}`}>{order.email}</a></dd></div>}
          {order.date && <div><dt>Дата события</dt><dd>{order.date}</dd></div>}
          {order.guests && <div><dt>Гостей</dt><dd>{order.guests}</dd></div>}
          {order.cuisine && <div><dt>Кухня</dt><dd>{order.cuisine}</dd></div>}
          {order.language && <div><dt>Язык</dt><dd>{order.language}</dd></div>}
        </dl>
        {order.message && <p className="ord-message">{order.message}</p>}
        <div className="ord-fields">
          <label>Статус
            <select value={order.status} onChange={event => save({ status: event.target.value as OrderStatus })}>
              {orderStatuses.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label>Себестоимость, ₪
            <input inputMode="decimal" value={cost} onChange={event => setCost(event.target.value)} onBlur={() => save({ cost: parseAmount(cost) })} />
          </label>
          <label>Полученная сумма, ₪
            <input inputMode="decimal" value={revenue} onChange={event => setRevenue(event.target.value)} onBlur={() => save({ revenue: parseAmount(revenue) })} />
          </label>
          <label>Прибыль до налогов, ₪
            <output className="ord-output">{revenue.trim() === '' ? '—' : money.format(profit ?? 0)}</output>
          </label>
        </div>
        <label className="ord-text">Согласование ожиданий и заявки
          <textarea rows={4} value={expectations} onChange={event => setExpectations(event.target.value)} onBlur={() => save({ expectations })} />
        </label>
        <label className="ord-text">Окончательный результат
          <textarea rows={4} value={result} onChange={event => setResult(event.target.value)} onBlur={() => save({ result })} />
        </label>
        <div className="ord-actions">
          <span className="ord-state" role="status">{state === 'saving' ? 'Сохраняю…' : state === 'saved' ? 'Сохранено' : state === 'error' ? 'Не удалось сохранить' : ''}</span>
          <button type="button" className="ord-delete" onClick={() => { if (window.confirm('Удалить эту заявку без возможности восстановления?')) onDelete(order.id) }}>Удалить</button>
        </div>
      </div>
    </details>
  )
}

function NewOrderForm({ onCreated, onClose }: { onCreated: (order: Order) => void; onClose: () => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = Object.fromEntries(new FormData(form).entries())
    setBusy(true)
    setError(false)
    const response = await (createOrder as unknown as Call<{ order: Order | null }>)({ data: fields })
    setBusy(false)
    if (response.order) {
      onCreated(response.order)
      onClose()
    } else setError(true)
  }

  return (
    <form className="ord-form" onSubmit={submit}>
      <h2>Новая заявка</h2>
      <div className="ord-fields">
        <label>Имя<input name="name" /></label>
        <label>Телефон<input name="phone" inputMode="tel" /></label>
        <label>Email<input name="email" type="email" /></label>
        <label>Дата события<input name="date" /></label>
        <label>Гостей<input name="guests" inputMode="numeric" /></label>
        <label>Кухня<input name="cuisine" /></label>
      </div>
      <label className="ord-text">Что просит клиент<textarea name="message" rows={3} /></label>
      {error && <p className="ord-error" role="alert">Не получилось сохранить. Укажите хотя бы имя, телефон или текст.</p>}
      <div className="ord-actions">
        <button type="button" className="ord-secondary" onClick={onClose}>Отмена</button>
        <button type="submit" disabled={busy}>{busy ? 'Сохраняю…' : 'Добавить'}</button>
      </div>
    </form>
  )
}

async function exportExcel(orders: Order[]) {
  const { buildXlsx } = await import('@/lib/xlsx')
  const header = ['Получена', 'Статус', 'Имя', 'Телефон', 'Email', 'Дата события', 'Гостей', 'Кухня', 'Язык', 'Запрос клиента', 'Согласование ожиданий и заявки', 'Окончательный результат', 'Себестоимость, ₪', 'Полученная сумма, ₪', 'Прибыль до налогов, ₪']
  const rows = orders.map((order, index) => {
    const row = index + 2
    const profit = orderProfit(order)
    return [
      formatCreated(order.createdAt), statusLabel(order.status), order.name, order.phone, order.email, order.date, order.guests, order.cuisine, order.language, order.message, order.expectations, order.result,
      order.cost, order.revenue,
      order.revenue === null ? null : { formula: `N${row}-M${row}`, value: profit },
    ]
  })
  const bytes = buildXlsx([header, ...rows], [18, 15, 20, 18, 24, 18, 9, 16, 9, 40, 40, 40, 16, 18, 20], [12, 13, 14])
  const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `zayavki-${new Date().toISOString().slice(0, 10)}.xlsx`
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function OrdersApp({ initial, configured }: { initial: Order[]; configured: boolean }) {
  const router = useRouter()
  const [orders, setOrders] = useState(initial)
  const [filter, setFilter] = useState<'all' | OrderStatus>('all')
  const [adding, setAdding] = useState(false)

  const shown = useMemo(() => orders.filter(order => filter === 'all' || order.status === filter), [orders, filter])
  const totals = useMemo(() => {
    let revenue = 0
    let cost = 0
    for (const order of shown) {
      if (order.revenue === null) continue
      revenue += order.revenue
      cost += order.cost ?? 0
    }
    return { revenue, cost, profit: revenue - cost }
  }, [shown])

  function replace(updated: Order) {
    setOrders(list => list.map(order => (order.id === updated.id ? updated : order)))
  }

  async function remove(id: string) {
    const response = await (removeOrder as unknown as Call<{ ok: boolean }>)({ data: { id } })
    if (response.ok) setOrders(list => list.filter(order => order.id !== id))
  }

  async function leave() {
    await (logoutOrders as unknown as () => Promise<unknown>)()
    await router.invalidate()
  }

  return (
    <main className="ord-page" dir="ltr" lang="ru">
      <header className="ord-top">
        <h1>Заявки</h1>
        <div className="ord-top-actions">
          <button type="button" onClick={() => setAdding(true)} disabled={!configured}>Добавить</button>
          <button type="button" className="ord-secondary" onClick={() => exportExcel(orders)} disabled={orders.length === 0}>Скачать Excel</button>
          <button type="button" className="ord-secondary" onClick={leave}>Выйти</button>
        </div>
      </header>
      {!configured && <p className="ord-warning">Хранилище заявок ещё не подключено в Vercel, поэтому новые заявки не сохраняются. Telegram и почта работают как раньше.</p>}
      {adding && <NewOrderForm onCreated={order => setOrders(list => [order, ...list])} onClose={() => setAdding(false)} />}
      <section className="ord-summary" aria-label="Итоги">
        <label>Показывать
          <select value={filter} onChange={event => setFilter(event.target.value as 'all' | OrderStatus)}>
            <option value="all">Все ({orders.length})</option>
            {orderStatuses.map(item => <option key={item.value} value={item.value}>{item.label} ({orders.filter(order => order.status === item.value).length})</option>)}
          </select>
        </label>
        <div><span>Получено</span><strong>{formatMoney(totals.revenue)}</strong></div>
        <div><span>Себестоимость</span><strong>{formatMoney(totals.cost)}</strong></div>
        <div><span>Прибыль до налогов</span><strong>{formatMoney(totals.profit)}</strong></div>
      </section>
      <div className="ord-list">
        {shown.length === 0 ? <p className="ord-empty">Заявок пока нет.</p> : shown.map(order => <OrderCard key={order.id} order={order} onChange={replace} onDelete={remove} />)}
      </div>
    </main>
  )
}
