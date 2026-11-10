import { useEffect, useRef } from 'react'

export function LivePhoto({ photo, depth, className }: { photo: string; depth: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let live: { destroy(): void } | undefined
    let cancelled = false
    const timer = window.setTimeout(() => {
      import('./live-photo/live-photo.js').then(module => {
        if (!cancelled) live = module.mountLivePhoto(element, { photo, depth, alt: '' })
      })
    }, 400)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      live?.destroy()
    }
  }, [photo, depth])

  return <div ref={ref} className={className} aria-hidden="true" />
}
