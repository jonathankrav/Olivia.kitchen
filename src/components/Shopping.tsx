import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { updateOrder } from '@/lib/orders'
import { formatEventDate, type Order, type Shopping } from '@/lib/orders-types'
import { parseNumber, type Recipe } from '@/lib/dishes-types'
import { buildShoppingList, displayQty } from '@/lib/shopping-calc'

type Call<T> = (options: { data: Record<string, unknown> }) => Promise<T>

function money(value: number) {
  return `${(Math.round(value * 100) / 100).toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₪`
}

export function ShoppingApp({ order, recipes }: { order: Order | null; recipes: Record<string, Recipe> }) {
  if (!order) {
    return (
      <main className="ord-page shop-page" dir="ltr" lang="ru">
        <header className="ord-top"><h1>Закупка</h1><div className="ord-top-actions"><Link to="/orders" className="ord-link">К заявкам</Link></div></header>
        <p className="ord-empty">Заявка не найдена.</p>
      </main>
    )
  }
  return <ShoppingList order={order} recipes={recipes} />
}

function ShoppingList({ order, recipes }: { order: Order; recipes: Record<string, Recipe> }) {
  const list = useMemo(() => buildShoppingList(order, recipes), [order, recipes])
  const [saved, setSaved] = useState<Shopping>(order.shopping ?? { checked: [], actual: '', finished: false, estimate: null, finishedAt: null })
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const latest = useRef(saved)
  const timer = useRef<number | null>(null)
  const dirty = useRef(false)

  const estimate = list.lines.reduce((sum, line) => sum + (line.cost ?? 0), 0)
  const unpriced = list.lines.filter(line => line.unpriced).length
  const shownEstimate = saved.finished && saved.estimate !== null ? saved.estimate : estimate
  const actual = parseNumber(saved.actual)
  const bought = list.lines.filter(line => saved.checked.includes(line.key)).length

  async function persist(next: Shopping) {
    setState('saving')
    dirty.current = false
    const result = await (updateOrder as unknown as Call<{ order: Order | null }>)({ data: { id: order.id, patch: { shopping: next } } })
    setState(result.order ? 'saved' : 'error')
  }

  function change(next: Shopping, immediate = false) {
    latest.current = next
    dirty.current = true
    setSaved(next)
    setState('idle')
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => persist(latest.current), immediate ? 0 : 600)
  }

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    if (dirty.current) void persist(latest.current)
  }, [])

  function toggle(key: string) {
    if (saved.finished) return
    change({ ...saved, checked: saved.checked.includes(key) ? saved.checked.filter(item => item !== key) : [...saved.checked, key] })
  }

  function finish() {
    if (!window.confirm('Завершить закупку? Список уйдёт в архив заявки, а сумма и отклонение сохранятся в карточке.')) return
    change({ ...saved, finished: true, estimate: Math.round(estimate * 100) / 100, finishedAt: new Date().toISOString() }, true)
  }

  function reopen() {
    change({ ...saved, finished: false, finishedAt: null }, true)
  }

  const deviation = actual !== null ? actual - shownEstimate : null
  const title = `${order.name || 'Без имени'}${order.date ? `, ${formatEventDate(order.date)}` : ''}`
  const menuUsed = order.finalMenu ? 'окончательное меню' : 'предложенное меню'

  return (
    <main className="ord-page shop-page" dir="ltr" lang="ru">
      <header className="ord-top">
        <h1>Закупка</h1>
        <div className="ord-top-actions"><Link to="/orders" className="ord-link">К заявкам</Link></div>
      </header>
      <section className="shop-head">
        <strong>{title}</strong>
        <span>Гостей: {list.guests ?? 'не указано'} ({order.confirmedGuests ? 'подтверждено' : 'из заявки'}). Список по: {menuUsed}.</span>
        {saved.finished && <span className="shop-archive">Закупка завершена{saved.finishedAt ? `, ${new Date(saved.finishedAt).toLocaleDateString('ru-RU', { timeZone: 'Asia/Jerusalem' })}` : ''}. Список в архиве, менять нельзя.</span>}
      </section>
      {list.guests === null && <p className="ord-warning">В заявке не указано число гостей, поэтому количества посчитать нельзя. Укажите «подтверждённое количество гостей» в заявке.</p>}
      {list.missing.length > 0 && (
        <p className="ord-warning">Не вошли в список: {list.missing.map(item => `${item.dish} (${item.reason})`).join('; ')}. Заполните рецепты на странице «Меню и рецепты».</p>
      )}
      {list.lines.length === 0 ? <p className="ord-empty">Пока нечего закупать.</p> : (
        <ul className="shop-list">
          {list.lines.map(line => {
            const checked = saved.checked.includes(line.key)
            return (
              <li key={line.key} className={checked ? 'done' : ''}>
                <label>
                  <input type="checkbox" checked={checked} disabled={saved.finished} onChange={() => toggle(line.key)} />
                  <span className="shop-name"><b>{line.name}</b><small>{line.dishes.join(', ')}</small></span>
                  <span className="shop-qty">{displayQty(line)}</span>
                  <span className="shop-cost">{line.cost !== null ? money(line.cost) : 'нет цены'}</span>
                </label>
              </li>
            )
          })}
        </ul>
      )}
      <section className="shop-total" aria-label="Итого">
        <div className="shop-total-row"><span>Куплено</span><strong>{bought} из {list.lines.length}</strong></div>
        <div className="shop-total-row"><span>Итого ориентировочно{unpriced > 0 && !saved.finished ? ` (без цены: ${unpriced})` : ''}</span><strong>{money(shownEstimate)}</strong></div>
        <label className="shop-total-row">
          <span>Фактически, ₪</span>
          <input inputMode="decimal" value={saved.actual} disabled={saved.finished} onChange={event => change({ ...saved, actual: event.target.value })} placeholder="сколько заплатили" />
        </label>
        {deviation !== null && <div className="shop-total-row"><span>Отклонение от ориентира</span><strong className={deviation > 0 ? 'over' : 'under'}>{deviation > 0 ? '+' : ''}{money(deviation)}{shownEstimate > 0 ? ` (${deviation > 0 ? '+' : ''}${Math.round((deviation / shownEstimate) * 1000) / 10}%)` : ''}</strong></div>}
        <div className="shop-actions">
          {saved.finished
            ? <button type="button" className="ord-secondary" onClick={reopen}>Вернуть в работу</button>
            : <button type="button" className="ord-save" onClick={finish} disabled={list.lines.length === 0}>Завершить закупку</button>}
          <span className="ord-state" role="status">{state === 'saving' ? 'Сохраняю…' : state === 'saved' ? 'Сохранено' : state === 'error' ? 'Не удалось сохранить' : ''}</span>
        </div>
      </section>
    </main>
  )
}
