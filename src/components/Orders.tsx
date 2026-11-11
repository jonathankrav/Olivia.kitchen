import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { createOrder, emailOrder, loginOrders, logoutOrders, removeOrder, updateOrder } from '@/lib/orders'
import { sections } from '@/lib/content'
import { todayISO } from '@/lib/form-validation'
import { cuisineLabel, cuisineOptions, eventDateISO, formatEventDate, orderExpenses, orderProfit, orderStatuses, type Order, type OrderPatch, type OrderStatus } from '@/lib/orders-types'

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

export function OrdersLogin({ title = 'Заявки' }: { title?: string }) {
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
        <h1>{title}</h1>
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

const menuCategories = sections.ru.menu.categories.map(category => ({ title: category.title, items: [...category.items] }))
const knownDishes = new Set(menuCategories.flatMap(category => category.items))
const ExtrasContext = createContext<{ ru: string; category: number }[]>([])

function MenuPicker({ title, selected, onChange, hint, onReset }: { title: string; selected: string[]; onChange: (list: string[]) => void; hint?: string; onReset?: () => void }) {
  const [custom, setCustom] = useState('')
  const siteExtras = useContext(ExtrasContext)
  const siteExtraNames = new Set(siteExtras.map(dish => dish.ru))
  const extras = selected.filter(name => !knownDishes.has(name) && !siteExtraNames.has(name))

  function toggle(name: string) {
    onChange(selected.includes(name) ? selected.filter(item => item !== name) : [...selected, name])
  }

  function addCustom() {
    const name = custom.trim().replace(/\s+/g, ' ')
    if (!name) return
    if (!selected.includes(name)) onChange([...selected, name])
    setCustom('')
  }

  return (
    <details className="ord-menu">
      <summary><span>{title}</span><span className="ord-menu-count">выбрано: {selected.length}</span></summary>
      <div className="ord-menu-body">
        {hint && <p className="ord-menu-hint">{hint}</p>}
        {menuCategories.map(category => <fieldset key={category.title}>
          <legend>{category.title}</legend>
          <div className="ord-menu-grid">{[...category.items, ...siteExtras.filter(dish => dish.category === menuCategories.indexOf(category)).map(dish => dish.ru)].map(name => <label className="ord-check" key={name}><input type="checkbox" checked={selected.includes(name)} onChange={() => toggle(name)} /><span>{name}</span></label>)}</div>
        </fieldset>)}
        <fieldset>
          <legend>Другое (не из меню на сайте)</legend>
          <div className="ord-menu-grid">{extras.map(name => <label className="ord-check" key={name}><input type="checkbox" checked onChange={() => toggle(name)} /><span>{name}</span></label>)}</div>
          <div className="ord-menu-add">
            <input value={custom} placeholder="Название блюда" onChange={event => setCustom(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addCustom() } }} />
            <button type="button" className="ord-secondary" onClick={addCustom}>Добавить</button>
          </div>
        </fieldset>
        {onReset && <button type="button" className="ord-secondary ord-menu-reset" onClick={onReset}>Вернуть как в предложенном</button>}
      </div>
    </details>
  )
}

function OrderCard({ order, onChange, onDelete }: { order: Order; onChange: (order: Order) => void; onDelete: (id: string) => void }) {
  const [cost, setCost] = useState(order.cost === null ? '' : String(order.cost))
  const [revenue, setRevenue] = useState(order.revenue === null ? '' : String(order.revenue))
  const [expectations, setExpectations] = useState(order.expectations)
  const [result, setResult] = useState(order.result)
  const [proposedMenu, setProposedMenu] = useState(order.proposedMenu)
  const [finalMenu, setFinalMenu] = useState(order.finalMenu)
  const finalShown = finalMenu ?? proposedMenu
  const [approvedAt, setApprovedAt] = useState(order.menuApprovedAt)
  const [mailState, setMailState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function sendExcel() {
    setMailState('sending')
    const result = await (emailOrder as unknown as Call<{ ok: boolean }>)({ data: { id: order.id } })
    setMailState(result.ok ? 'sent' : 'error')
  }
  const [confirmed, setConfirmed] = useState(order.confirmedGuests ?? order.guests)
  const [dishware, setDishware] = useState(order.dishware === null ? '' : String(order.dishware))
  const [other, setOther] = useState(order.other === null ? '' : String(order.other))
  const [otherNote, setOtherNote] = useState(order.otherNote)
  const [notes, setNotes] = useState(order.notes)
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const profit = orderProfit({ cost: parseAmount(cost), dishware: parseAmount(dishware), other: parseAmount(other), revenue: parseAmount(revenue) })
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
        <span className="ord-meta">{order.date ? formatEventDate(order.date) : formatCreated(order.createdAt)}{order.guests ? ` · ${order.guests} гост.` : ''}</span>
        <span className="ord-profit">{formatMoney(orderProfit(order))}</span>
      </summary>
      <div className="ord-body">
        <dl className="ord-info">
          <div><dt>Получена</dt><dd>{formatCreated(order.createdAt)}{order.source === 'manual' ? ' (добавлена вручную)' : ''}</dd></div>
          {order.phone && <div><dt>Телефон</dt><dd><a href={`tel:${order.phone}`}>{order.phone}</a>{digits && <> · <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer">WhatsApp</a></>}</dd></div>}
          {order.email && <div><dt>Email</dt><dd><a href={`mailto:${order.email}`}>{order.email}</a></dd></div>}
          {order.date && <div><dt>Дата события</dt><dd>{formatEventDate(order.date)}</dd></div>}
          {order.guests && <div><dt>Гостей по заявке</dt><dd>{order.guests}</dd></div>}
          {order.cuisine && <div><dt>Кухня</dt><dd>{cuisineLabel(order.cuisine)}</dd></div>}
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
          <label>Подтверждённое количество гостей
            <input inputMode="numeric" value={confirmed} placeholder={order.guests} onChange={event => setConfirmed(event.target.value)} onBlur={() => save({ confirmedGuests: confirmed.trim() === order.guests.trim() ? null : confirmed })} />
          </label>
          <label>Посуда, ₪
            <input inputMode="decimal" value={dishware} onChange={event => setDishware(event.target.value)} onBlur={() => save({ dishware: parseAmount(dishware) })} />
          </label>
          <label>Прочие расходы, ₪
            <input inputMode="decimal" value={other} onChange={event => setOther(event.target.value)} onBlur={() => save({ other: parseAmount(other) })} />
          </label>
          <label>Полученная сумма, ₪
            <input inputMode="decimal" value={revenue} onChange={event => setRevenue(event.target.value)} onBlur={() => save({ revenue: parseAmount(revenue) })} />
          </label>
          <label>Прибыль до налогов, ₪
            <output className="ord-output">{revenue.trim() === '' ? '—' : money.format(profit ?? 0)}</output>
          </label>
        </div>
        <label className="ord-text">Комментарий к прочим расходам
          <textarea rows={2} value={otherNote} onChange={event => setOtherNote(event.target.value)} onBlur={() => save({ otherNote })} />
        </label>
        <MenuPicker title="Предложенное меню" selected={proposedMenu} onChange={list => { setProposedMenu(list); save({ proposedMenu: list }) }} />
        <MenuPicker
          title="Окончательное меню"
          selected={finalShown}
          hint={finalMenu === null ? 'Пока совпадает с предложенным. Измените любую галочку, и список станет вашим.' : undefined}
          onChange={list => { setFinalMenu(list); save({ finalMenu: list }) }}
          onReset={finalMenu === null ? undefined : () => { setFinalMenu(null); save({ finalMenu: null }) }}
        />
        <div className="ord-tools">
          <Link to="/shopping/$orderId" params={{ orderId: order.id }} className="ord-work">Работаем с заявкой</Link>
          <button type="button" className="ord-secondary" onClick={() => exportExcel([order])}>Скачать Excel</button>
          <button type="button" className="ord-secondary" onClick={sendExcel} disabled={mailState === 'sending'}>{mailState === 'sending' ? 'Отправляю…' : 'Отправить Excel на почту'}</button>
          {mailState === 'sent' && <span className="ord-state">Отправлено на почту</span>}
          {mailState === 'error' && <span className="ord-state">Не удалось отправить</span>}
        </div>
        {order.shopping?.finished && order.shopping.estimate !== null && (
          <p className="ord-shopping-summary">Закупка завершена. Ориентир {formatMoney(order.shopping.estimate)}{parseAmount(order.shopping.actual) !== null ? `, факт ${formatMoney(parseAmount(order.shopping.actual) ?? 0)}, отклонение ${formatMoney((parseAmount(order.shopping.actual) ?? 0) - order.shopping.estimate)}` : ', факт не указан'}.</p>
        )}
        <div className="ord-approve">
          {approvedAt ? <>
            <span className="ord-approved">✓ Меню утверждено клиентом: {formatEventDate(approvedAt.slice(0, 10)).split(',')[0]}</span>
            <button type="button" className="ord-secondary" onClick={() => { setApprovedAt(null); save({ menuApprovedAt: null }) }}>Снять утверждение</button>
          </> : <>
            <button type="button" onClick={() => { setApprovedAt(new Date().toISOString()); save({ menuApprovedAt: new Date().toISOString() }) }} disabled={finalShown.length === 0}>Клиент утвердил меню</button>
            <span className="ord-state">{finalShown.length === 0 ? 'Сначала отметьте блюда в окончательном меню' : 'Нажмите, когда клиент согласовал окончательное меню'}</span>
          </>}
        </div>
        <label className="ord-text">Согласование ожиданий и заявки
          <textarea rows={4} value={expectations} onChange={event => setExpectations(event.target.value)} onBlur={() => save({ expectations })} />
        </label>
        <label className="ord-text">Окончательный результат
          <textarea rows={4} value={result} onChange={event => setResult(event.target.value)} onBlur={() => save({ result })} />
        </label>
        <label className="ord-text">Комментарий по заявке: как прошло, аллергии, отзывы, предпочтения клиента
          <textarea rows={6} value={notes} onChange={event => setNotes(event.target.value)} onBlur={() => save({ notes })} />
        </label>
        <div className="ord-actions">
          <button type="button" className="ord-save" onClick={() => save({ confirmedGuests: confirmed.trim() === order.guests.trim() ? null : confirmed, cost: parseAmount(cost), revenue: parseAmount(revenue), dishware: parseAmount(dishware), other: parseAmount(other), otherNote, expectations, result, notes })} disabled={state === 'saving'}>{state === 'saving' ? 'Сохраняю…' : 'Сохранить'}</button>
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
        <label>Дата события<input name="date" type="date" /></label>
        <label>Гостей<input name="guests" inputMode="numeric" /></label>
        <label>Кухня<select name="cuisine" defaultValue="inspiration">{cuisineOptions.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
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
  const { buildOrdersXlsx } = await import('@/lib/orders-export')
  const bytes = buildOrdersXlsx(orders)
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

const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const weekdayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

function OrdersCalendar({ orders, from, to, onPick }: { orders: Order[]; from: string; to: string; onPick: (day: string) => void }) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(true)
  useEffect(() => {
    try {
      if (localStorage.getItem('ord_calendar') === 'hidden') setOpen(false)
    } catch {}
    setMounted(true)
  }, [])
  const today = todayISO()
  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const order of orders) {
      if (order.status === 'cancelled') continue
      const day = eventDateISO(order.date)
      if (day) map.set(day, (map.get(day) ?? 0) + 1)
    }
    return map
  }, [orders])
  const now = new Date()
  const months = [0, 1].map(offset => {
    const first = new Date(Date.UTC(now.getFullYear(), now.getMonth() + offset, 1))
    const year = first.getUTCFullYear()
    const month = first.getUTCMonth()
    return { year, month, lead: first.getUTCDay(), days: new Date(Date.UTC(year, month + 1, 0)).getUTCDate() }
  })

  function toggle() {
    const next = !open
    setOpen(next)
    try {
      localStorage.setItem('ord_calendar', next ? 'shown' : 'hidden')
    } catch {}
  }

  if (!mounted) return null

  return (
    <section className="ord-cal" aria-label="Календарь заявок">
      <div className="ord-cal-bar">
        <button type="button" className="ord-secondary" onClick={toggle} aria-expanded={open}>{open ? 'Скрыть календарь' : 'Показать календарь'}</button>
        {open && <span className="ord-cal-legend"><i className="booked-future" /> заявка впереди <i className="booked-past" /> заявка в прошлом</span>}
      </div>
      {open && (
        <div className="ord-cal-months">
          {months.map(({ year, month, lead, days }) => (
            <div className="ord-cal-month" key={`${year}-${month}`}>
              <h3>{monthNames[month]} {year}</h3>
              <div className="ord-cal-grid">
                {weekdayNames.map(name => <span className="ord-cal-head" key={name}>{name}</span>)}
                {Array.from({ length: lead }, (_, index) => <span key={`e${index}`} />)}
                {Array.from({ length: days }, (_, index) => {
                  const day = index + 1
                  const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const count = counts.get(iso) ?? 0
                  const classes = ['ord-cal-day', iso < today ? 'past' : '', count ? 'booked' : '', iso === today ? 'today' : '', from === iso && to === iso ? 'picked' : ''].filter(Boolean).join(' ')
                  return count
                    ? <button type="button" className={classes} key={iso} title={`Заявок: ${count}`} onClick={() => onPick(iso)}>{day}</button>
                    : <span className={classes} key={iso}>{day}</span>
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export function OrdersApp({ initial, configured, extras }: { initial: Order[]; configured: boolean; extras: { ru: string; category: number }[] }) {
  const router = useRouter()
  const [orders, setOrders] = useState(initial)
  const [filter, setFilter] = useState<'all' | OrderStatus>('all')
  const [adding, setAdding] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const periodOn = from !== '' || to !== ''
  const undated = useMemo(() => (periodOn ? orders.filter(order => (filter === 'all' || order.status === filter) && eventDateISO(order.date) === null).length : 0), [orders, filter, periodOn])
  const shown = useMemo(() => orders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false
    if (!periodOn) return true
    const day = eventDateISO(order.date)
    if (day === null) return false
    return (from === '' || day >= from) && (to === '' || day <= to)
  }), [orders, filter, from, to, periodOn])

  function setMonth(offset: number) {
    const now = new Date()
    const start = new Date(Date.UTC(now.getFullYear(), now.getMonth() + offset, 1))
    const end = new Date(Date.UTC(now.getFullYear(), now.getMonth() + offset + 1, 0))
    setFrom(start.toISOString().slice(0, 10))
    setTo(end.toISOString().slice(0, 10))
  }
  const totals = useMemo(() => {
    let revenue = 0
    let cost = 0
    for (const order of shown) {
      if (order.revenue === null) continue
      revenue += order.revenue
      cost += orderExpenses(order)
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
          <button type="button" className="ord-secondary" onClick={() => exportExcel(shown)} disabled={shown.length === 0}>{periodOn || filter !== 'all' ? 'Скачать Excel (показанные)' : 'Скачать Excel'}</button>
          <Link to="/dishes" className="ord-link">Меню и рецепты</Link>
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
        <label>Период с (дата мероприятия)
          <input type="date" value={from} max={to || undefined} onChange={event => setFrom(event.target.value)} />
        </label>
        <label>Период по
          <input type="date" value={to} min={from || undefined} onChange={event => setTo(event.target.value)} />
        </label>
        <div><span>Получено</span><strong>{formatMoney(totals.revenue)}</strong></div>
        <div><span>Расходы</span><strong>{formatMoney(totals.cost)}</strong></div>
        <div><span>Прибыль до налогов</span><strong>{formatMoney(totals.profit)}</strong></div>
      </section>
      <OrdersCalendar orders={orders} from={from} to={to} onPick={day => { if (from === day && to === day) { setFrom(''); setTo('') } else { setFrom(day); setTo(day) } }} />
      <div className="ord-period">
        <button type="button" className="ord-secondary" onClick={() => setMonth(0)}>Этот месяц</button>
        <button type="button" className="ord-secondary" onClick={() => setMonth(-1)}>Прошлый месяц</button>
        {periodOn && <button type="button" className="ord-secondary" onClick={() => { setFrom(''); setTo('') }}>Сбросить период</button>}
        {periodOn && <span className="ord-state">Показано заявок: {shown.length}{undated > 0 ? `. Скрыто без даты мероприятия: ${undated}` : ''}</span>}
      </div>
      <div className="ord-list">
        {shown.length === 0 ? <p className="ord-empty">Заявок пока нет.</p> : shown.map(order => <OrderCard key={order.id} order={order} onChange={replace} onDelete={remove} />)}
      </div>
    </main>
  )
}
