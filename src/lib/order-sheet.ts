import { buildWorkbook, cellStyle as st, type Sheet, type SheetCell, type SheetRow } from '@/lib/xlsx'
import type { Recipe } from '@/lib/dishes-types'
import { formatEventDate, type Order } from '@/lib/orders-types'
import { buildShoppingList, displayQty } from '@/lib/shopping-calc'

function cell(v: string | number | null, s: number): SheetCell {
  return { v, s }
}

function rowHeight(text: string, charsPerLine: number) {
  return Math.max(1, Math.ceil(text.length / charsPerLine)) * 18 + 6
}

function infoSheet(order: Order): Sheet {
  const menu = order.finalMenu ?? order.proposedMenu
  const guests = order.confirmedGuests ?? order.guests
  const rows: SheetRow[] = []
  const merges: string[] = []
  rows.push({ cells: [cell(order.name || 'Без имени', st.title), cell(null, st.title)], height: 36 })
  merges.push('A1:B1')
  rows.push({ cells: [cell('Дата', st.label), cell(formatEventDate(order.date) || 'не указана', st.text)] })
  rows.push({ cells: [cell('Количество человек', st.label), cell(guests || 'не указано', st.text)] })
  rows.push({ cells: [cell('Комментарий', st.label), cell(order.notes.trim() || '', st.text)] })
  if (order.message.trim()) rows.push({ cells: [cell('Пожелания клиента', st.label), cell(order.message.trim(), st.text)] })
  rows.push({ cells: [] })
  rows.push({ cells: [cell('Окончательное меню', st.section), cell('Клиент утвердил меню', st.head)], height: 36 })
  const first = rows.length + 1
  const approved = order.menuApprovedAt !== null
  const mark = approved ? cell('✔', st.check) : cell('ещё нет', st.muted)
  if (menu.length === 0) {
    rows.push({ cells: [cell('Меню пока не выбрано', st.muted), mark], height: 40 })
  } else {
    menu.forEach((dish, index) => rows.push({ cells: [cell(dish, st.text), index === 0 ? mark : cell(null, st.check)], height: rowHeight(dish, 30) }))
    if (menu.length > 1) merges.push(`B${first}:B${first + menu.length - 1}`)
  }
  return { name: 'Заявка', widths: [34, 26], rows, merges }
}

function shoppingSheet(order: Order, recipes: Record<string, Recipe>): Sheet {
  const list = buildShoppingList(order, recipes)
  const rows: SheetRow[] = []
  const merges: string[] = []
  const full = (text: string, style: number, chars = 60): SheetRow => {
    const index = rows.length + 1
    merges.push(`A${index}:D${index}`)
    return { cells: [cell(text, style), cell(null, style), cell(null, style), cell(null, style)], height: rowHeight(text, chars) }
  }
  rows.push({ ...full(`Закупки: ${order.name || 'без имени'}${order.date ? `, ${formatEventDate(order.date)}` : ''}`, st.title, 45), height: 36 })
  if (list.guests !== null) rows.push(full(`Расчёт на ${list.guests} чел.`, st.muted))
  if (list.lines.length > 0) {
    rows.push({ cells: [cell('Купил', st.head), cell('Ингредиент', st.head), cell('Кол-во', st.head), cell('С/с, ₪', st.head)], height: 28 })
    const start = rows.length + 1
    for (const line of list.lines) {
      rows.push({ cells: [cell('☐', st.box), cell(line.name, st.text), cell(displayQty(line), st.right), line.cost !== null ? cell(Math.round(line.cost * 100) / 100, st.money) : cell('нет цены', st.note)], height: rowHeight(line.name, 28) })
    }
    const end = rows.length
    const total = list.lines.reduce((sum, line) => sum + (line.cost ?? 0), 0)
    const index = rows.length + 1
    merges.push(`A${index}:C${index}`)
    rows.push({ cells: [cell('Итого ориентировочно', st.totalLabel), cell(null, st.totalLabel), cell(null, st.totalLabel), { v: Math.round(total * 100) / 100, s: st.total, f: `SUM(D${start}:D${end})` }], height: 26 })
  } else if (list.missing.length === 0) {
    rows.push(full('Пока нечего закупать.', st.muted))
  }
  const notes: string[] = []
  if (list.guests === null) notes.push('В заявке не указано число гостей, поэтому количества не посчитаны.')
  if (list.missing.length > 0) {
    rows.push({ cells: [] })
    rows.push(full('Нет рецептов, список закупок неполный', st.section))
    for (const item of list.missing) rows.push(full(`${item.dish}: ${item.reason}`, st.note))
  }
  for (const note of notes) rows.push(full(note, st.note))
  return { name: 'Закупки', widths: [9, 32, 15, 13], rows, merges }
}

export function buildOrderWorkbook(order: Order, recipes: Record<string, Recipe>) {
  return buildWorkbook([infoSheet(order), shoppingSheet(order, recipes)])
}
