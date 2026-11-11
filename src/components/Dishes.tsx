import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { logoutOrders } from '@/lib/orders'
import { saveDish } from '@/lib/dishes'
import { sections } from '@/lib/content'
import { emptyRecipe, parseNumber, recipeUnits, type Recipe, type RecipeRow, type RecipeUnit } from '@/lib/dishes-types'

type Call<T> = (options: { data: Record<string, unknown> }) => Promise<T>

const categories = sections.ru.menu.categories.map(category => ({ title: category.title, items: [...category.items] }))

function format(value: number) {
  return (Math.round(value * 100) / 100).toLocaleString('ru-RU', { maximumFractionDigits: 2 })
}

function money(value: number) {
  return `${format(value)} ₪`
}

function newRow(added: boolean): RecipeRow {
  return { id: Math.random().toString(36).slice(2, 10), name: '', qty: '', unit: '', priceWeb: '', priceManual: '', added }
}

function sumByUnit(entries: { unit: RecipeUnit | ''; value: number }[]) {
  const totals = new Map<string, number>()
  for (const entry of entries) totals.set(entry.unit || 'без ед.', (totals.get(entry.unit || 'без ед.') ?? 0) + entry.value)
  return [...totals.entries()].map(([unit, value]) => `${format(value)} ${unit === 'без ед.' ? '' : unit}`.trim()).join(' + ')
}

function RecipeEditor({ dish, initial, configured, onSaved }: { dish: string; initial: Recipe; configured: boolean; onSaved: (recipe: Recipe) => void }) {
  const [recipe, setRecipe] = useState(initial)
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const latest = useRef(recipe)
  const timer = useRef<number | null>(null)
  const dirty = useRef(false)

  async function save(next: Recipe) {
    if (!configured) return
    setState('saving')
    dirty.current = false
    const result = await (saveDish as unknown as Call<{ recipe: Recipe | null }>)({ data: { id: dish, recipe: next } })
    if (result.recipe) {
      setState('saved')
      onSaved(result.recipe)
    } else setState('error')
  }

  function change(next: Recipe) {
    latest.current = next
    dirty.current = true
    setRecipe(next)
    setState('idle')
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => save(latest.current), 900)
  }

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    if (dirty.current) void save(latest.current)
  }, [])

  function patchRow(id: string, patch: Partial<RecipeRow>) {
    change({ ...recipe, rows: recipe.rows.map(row => (row.id === id ? { ...row, ...patch } : row)) })
  }

  function lock() {
    change({ ...recipe, locked: true, rows: recipe.rows.filter(row => row.name.trim() !== '').map(row => ({ ...row, added: false })) })
  }

  function unlock() {
    if (!window.confirm('Снять фиксацию? Строки рецепта снова можно будет менять.')) return
    change({ ...recipe, locked: false, rows: recipe.rows.map(row => ({ ...row, added: false })) })
  }

  const portions = parseNumber(recipe.portions)
  const calc = parseNumber(recipe.calcPortions)
  const factor = portions !== null && portions > 0 && calc !== null && calc > 0 ? calc / portions : null

  const computed = useMemo(() => recipe.rows.map(row => {
    const qty = parseNumber(row.qty)
    const price = parseNumber(row.priceManual) ?? parseNumber(row.priceWeb)
    const calcQty = qty !== null && factor !== null ? qty * factor : null
    const cost = calcQty !== null && price !== null ? calcQty * price : null
    return { qty, calcQty, cost, unit: row.unit }
  }), [recipe.rows, factor])

  const calcTotal = sumByUnit(computed.flatMap(item => (item.calcQty === null ? [] : [{ unit: item.unit, value: item.calcQty }])))
  const costTotal = computed.reduce((sum, item) => sum + (item.cost ?? 0), 0)
  const missingPrice = computed.filter((item, index) => item.calcQty !== null && item.cost === null && recipe.rows[index].name.trim() !== '').length

  return (
    <div className="dish-editor">
      <div className="dish-top">
        <label>Порций в рецепте
          <input inputMode="decimal" value={recipe.portions} onChange={event => change({ ...recipe, portions: event.target.value })} placeholder="например, 10" />
        </label>
        <label>Кол-во порций для расчёта
          <input inputMode="decimal" value={recipe.calcPortions} onChange={event => change({ ...recipe, calcPortions: event.target.value })} placeholder="например, 25" />
        </label>
        <div className="dish-top-actions">
          {recipe.locked
            ? <button type="button" className="ord-secondary" onClick={unlock}>Снять фиксацию</button>
            : <button type="button" className="ord-secondary" onClick={lock} disabled={!recipe.rows.some(row => row.name.trim() !== '')}>Зафиксировать рецепт</button>}
          <button type="button" className="ord-save" onClick={() => { if (timer.current !== null) window.clearTimeout(timer.current); void save(latest.current) }} disabled={!configured || state === 'saving'}>Сохранить</button>
        </div>
      </div>
      <p className="ord-state dish-state" role="status">
        {!configured ? 'Хранилище не подключено, изменения не сохраняются.' : state === 'saving' ? 'Сохраняю…' : state === 'saved' ? 'Сохранено.' : state === 'error' ? 'Не удалось сохранить. Попробуйте ещё раз.' : recipe.locked ? 'Рецепт зафиксирован: ингредиенты, количества и единицы закрыты. Цены и новые строки можно менять.' : 'Изменения сохраняются сами.'}
      </p>
      {factor === null && <p className="ord-state dish-state">Чтобы пошёл расчёт, заполните «Порций в рецепте» и «Кол-во порций для расчёта».</p>}
      <div className="dish-scroll">
        <table className="dish-table">
          <thead>
            <tr>
              <th>Ингредиент</th>
              <th>Количество</th>
              <th>Единица</th>
              <th>Цена из интернета, ₪</th>
              <th>Цена вручную, ₪</th>
              <th className="dish-sep" aria-hidden="true" />
              <th>Кол-во для закупки</th>
              <th>С/с закупки</th>
              <th aria-label="Удалить" />
            </tr>
          </thead>
          <tbody>
            {recipe.rows.length === 0 && <tr><td colSpan={9} className="dish-empty">Строк пока нет. Нажмите «Добавить строку».</td></tr>}
            {recipe.rows.map((row, index) => {
              const closed = recipe.locked && !row.added
              const item = computed[index]
              return (
                <tr key={row.id} className={row.added && recipe.locked ? 'dish-added' : ''}>
                  <td><input value={row.name} maxLength={120} disabled={closed} onChange={event => patchRow(row.id, { name: event.target.value })} aria-label="Ингредиент" /></td>
                  <td><input inputMode="decimal" value={row.qty} disabled={closed} onChange={event => patchRow(row.id, { qty: event.target.value })} aria-label="Количество" /></td>
                  <td>
                    <select value={row.unit} disabled={closed} onChange={event => patchRow(row.id, { unit: event.target.value as RecipeUnit | '' })} aria-label="Единица">
                      <option value="">выбрать</option>
                      {recipeUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                  </td>
                  <td><input inputMode="decimal" value={row.priceWeb} onChange={event => patchRow(row.id, { priceWeb: event.target.value })} aria-label="Цена из интернета" /></td>
                  <td><input inputMode="decimal" value={row.priceManual} onChange={event => patchRow(row.id, { priceManual: event.target.value })} aria-label="Цена вручную" /></td>
                  <td className="dish-sep" aria-hidden="true" />
                  <td className="dish-num">{item.calcQty !== null ? `${format(item.calcQty)} ${row.unit}`.trim() : ''}</td>
                  <td className="dish-num">{item.cost !== null ? money(item.cost) : ''}</td>
                  <td>{closed ? null : <button type="button" className="dish-remove" onClick={() => change({ ...recipe, rows: recipe.rows.filter(entry => entry.id !== row.id) })} aria-label="Удалить строку">×</button>}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>Итого</td>
              <td />
              <td />
              <td />
              <td />
              <td className="dish-sep" aria-hidden="true" />
              <td className="dish-num">{calcTotal}</td>
              <td className="dish-num">{factor !== null ? money(costTotal) : ''}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
      {missingPrice > 0 && <p className="ord-state dish-state">Без цены: {missingPrice} {missingPrice === 1 ? 'строка' : 'строк'}. В себестоимость они пока не входят.</p>}
      <div className="dish-actions">
        <button type="button" className="ord-secondary" onClick={() => change({ ...recipe, rows: [...recipe.rows, newRow(recipe.locked)] })}>{recipe.locked ? 'Добавить свободную строку' : 'Добавить строку'}</button>
      </div>
    </div>
  )
}

export function DishesApp({ initial, configured }: { initial: Record<string, Recipe>; configured: boolean }) {
  const router = useRouter()
  const [recipes, setRecipes] = useState(initial)
  const [openDish, setOpenDish] = useState<string | null>(null)

  async function leave() {
    await (logoutOrders as unknown as Call<{ ok: boolean }>)({ data: {} })
    await router.invalidate()
  }

  return (
    <main className="ord-page dish-page" dir="ltr" lang="ru">
      <header className="ord-top">
        <h1>Меню и рецепты</h1>
        <div className="ord-top-actions">
          <Link to="/orders" className="ord-link">Заявки</Link>
          <button type="button" className="ord-secondary" onClick={leave}>Выйти</button>
        </div>
      </header>
      {!configured && <p className="ord-warning">Хранилище ещё не подключено в Vercel, поэтому рецепты не сохраняются.</p>}
      <p className="ord-state dish-intro">Здесь всё меню с сайта. Нажмите на блюдо, чтобы открыть его рецепт. Цена считается за указанную единицу (за кг, за штуку и так далее). Если заполнена цена вручную, считается по ней, иначе по цене из интернета.</p>
      {categories.map(category => (
        <section className="dish-category" key={category.title}>
          <h2>{category.title}</h2>
          <ul className="dish-list">
            {category.items.map(dish => {
              const recipe = recipes[dish] ?? emptyRecipe
              const filled = recipe.rows.filter(row => row.name.trim() !== '').length
              const open = openDish === dish
              return (
                <li key={dish} className={open ? 'open' : ''}>
                  <button type="button" className="dish-summary" onClick={() => setOpenDish(open ? null : dish)} aria-expanded={open}>
                    <span>{dish}</span>
                    <small>{recipe.locked ? 'зафиксирован' : filled > 0 ? `строк: ${filled}` : 'пусто'}</small>
                  </button>
                  {open && <RecipeEditor dish={dish} initial={recipe} configured={configured} onSaved={saved => setRecipes(map => ({ ...map, [dish]: saved }))} />}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </main>
  )
}
