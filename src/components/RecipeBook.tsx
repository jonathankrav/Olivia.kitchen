import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, List } from 'lucide-react'
import { loginBook, logoutBook } from '@/lib/book'
import type { Book, Recipe } from '@/lib/book-types'

export function BookLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(false)
    const result = await (loginBook as unknown as (options: { data: { password: string } }) => Promise<{ ok: boolean }>)({ data: { password } })
    setBusy(false)
    if (result.ok) await router.invalidate()
    else setError(true)
  }

  return (
    <main className="book-login">
      <form className="book-login-card" onSubmit={submit}>
        <p className="book-login-mark">Olivia’s Kitchen</p>
        <h1>Книга рецептов</h1>
        <p>Эта книга личная. Введите пароль.</p>
        <input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} aria-label="Пароль" required autoFocus />
        {error && <p className="book-login-error" role="alert">Пароль не подошёл. Попробуйте ещё раз.</p>}
        <button type="submit" disabled={busy}>{busy ? 'Проверяю…' : 'Открыть книгу'}</button>
      </form>
    </main>
  )
}

function Illustration({ svg, label }: { svg: string; label?: string }) {
  return <div className="book-art" role={label ? 'img' : undefined} aria-label={label} dangerouslySetInnerHTML={{ __html: svg }} />
}

function RecipePages({ recipe }: { recipe: Recipe }) {
  return (
    <>
      <section className="book-page book-page-left">
        <h2 className="book-title">{recipe.title}</h2>
        {recipe.subtitle && <p className="book-subtitle">{recipe.subtitle}</p>}
        {recipe.meta && recipe.meta.length > 0 && <p className="book-meta">{recipe.meta.join(' · ')}</p>}
        {recipe.ingredients.map((group, index) => (
          <div className="book-group" key={index}>
            {group.title && <h3>{group.title}</h3>}
            <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        ))}
        <ol className="book-steps">{recipe.steps.map(step => <li key={step}>{step}</li>)}</ol>
        {recipe.note && <p className="book-note">{recipe.note}</p>}
      </section>
      <section className="book-page book-page-right">
        <Illustration svg={recipe.illustration} label={recipe.title} />
        {recipe.caption && <p className="book-caption">{recipe.caption}</p>}
      </section>
    </>
  )
}

export function RecipeBook({ book }: { book: Book }) {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const hasRecipes = book.recipes.length > 0
  const last = hasRecipes ? book.recipes.length + 1 : 0
  const recipe = page >= 2 ? book.recipes[page - 2] : undefined

  async function leave() {
    await (logoutBook as unknown as () => Promise<unknown>)()
    await router.invalidate()
  }

  return (
    <main className="book-shell">
      <div className="book">
        <div className="book-spread" key={page}>
          {page === 0 && (
            <>
              <section className="book-page book-page-left book-cover-text">
                <p className="book-kicker">{book.subtitle}</p>
                <h1 className="book-title book-title-big">{book.title}</h1>
                <p className="book-hand">{hasRecipes ? 'Мои рецепты, нарисованные и записанные от руки.' : 'Здесь появятся первые рецепты.'}</p>
                {hasRecipes && <button className="book-open" onClick={() => setPage(1)}>Открыть оглавление</button>}
              </section>
              <section className="book-page book-page-right"><Illustration svg={book.cover} label="Продукты на тарелке" /></section>
            </>
          )}
          {page === 1 && (
            <>
              <section className="book-page book-page-left">
                <h2 className="book-title">Оглавление</h2>
                <ol className="book-contents">
                  {book.recipes.map((item, index) => (
                    <li key={item.id}><button onClick={() => setPage(index + 2)}><span>{item.title}</span><span>{index + 1}</span></button></li>
                  ))}
                </ol>
              </section>
              <section className="book-page book-page-right"><Illustration svg={book.cover} label="Продукты на тарелке" /></section>
            </>
          )}
          {recipe && <RecipePages recipe={recipe} />}
        </div>
        <nav className="book-nav" aria-label="Страницы книги">
          <button onClick={() => setPage(page - 1)} disabled={page === 0} aria-label="Назад"><ChevronLeft /></button>
          <button onClick={() => setPage(1)} disabled={!hasRecipes} aria-label="Оглавление"><List /></button>
          <button onClick={() => setPage(page + 1)} disabled={page >= last} aria-label="Дальше"><ChevronRight /></button>
          <button className="book-leave" onClick={leave}>Выйти</button>
        </nav>
      </div>
    </main>
  )
}
