import { buildXlsx } from '@/lib/xlsx'
import { orderProfit, orderStatuses, type Order } from '@/lib/orders-types'

function formatCreated(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('ru-RU', { timeZone: 'Asia/Jerusalem', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusLabel(status: string) {
  return orderStatuses.find(item => item.value === status)?.label ?? status
}

export function buildOrdersXlsx(orders: Order[]) {
  const header = ['Получена', 'Статус', 'Имя', 'Телефон', 'Email', 'Дата события', 'Гостей', 'Кухня', 'Язык', 'Запрос клиента', 'Согласование ожиданий и заявки', 'Окончательный результат', 'Предложенное меню', 'Окончательное меню', 'Себестоимость, ₪', 'Посуда, ₪', 'Прочие расходы, ₪', 'Комментарий к прочим расходам', 'Полученная сумма, ₪', 'Прибыль до налогов, ₪', 'Комментарий по заявке', 'Гостей подтверждено']
  const rows = orders.map((order, index) => {
    const row = index + 2
    const profit = orderProfit(order)
    return [
      formatCreated(order.createdAt), statusLabel(order.status), order.name, order.phone, order.email, order.date, order.guests, order.cuisine, order.language, order.message, order.expectations, order.result, order.proposedMenu.join('; '), (order.finalMenu ?? order.proposedMenu).join('; '),
      order.cost, order.dishware, order.other, order.otherNote, order.revenue,
      order.revenue === null ? null : { formula: `S${row}-O${row}-P${row}-Q${row}`, value: profit },
      order.notes, order.confirmedGuests ?? order.guests,
    ]
  })
  return buildXlsx([header, ...rows], [18, 15, 20, 18, 24, 18, 9, 16, 9, 40, 40, 40, 40, 40, 16, 12, 16, 30, 18, 20, 50, 14], [14, 15, 16, 18, 19])
}
