import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { content, galleryPhotos, type Language } from '@/lib/content'

const galleryFilters = ['all', 'savoury', 'desserts'] as const
type GalleryFilter = (typeof galleryFilters)[number]
const imageUrl = (name: string) => `/img/${name}.webp`

export function GallerySection({ language }: { language: Language }) {
  const [filter, setFilter] = useState<GalleryFilter>('all')
  const [activeImage, setActiveImage] = useState<number | null>(null)
  const galleryDialog = useRef<HTMLDialogElement>(null)
  const text = content[language]
  const visiblePhotos = galleryPhotos.map((photo, index) => ({ photo, index })).filter(({ photo }) => filter === 'all' || photo.group === filter)

  useEffect(() => {
    const dialog = galleryDialog.current
    if (activeImage !== null) dialog?.showModal()
    else dialog?.close()
  }, [activeImage])

  useEffect(() => {
    if (activeImage === null) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [activeImage])

  return (
    <>
        <section id="gallery" className="gallery-section">
          <div className="section-wrap">
            <div className="section-heading"><div><span className="eyebrow">{text.galleryLabel}</span><h2>{text.galleryTitle}</h2><p>{text.galleryText}</p></div><div className="gallery-filters" role="group" aria-label={text.galleryTitle}>{galleryFilters.map(key => <button key={key} aria-pressed={filter === key} className={filter === key ? 'active' : ''} onClick={() => setFilter(key)}>{key === 'all' ? text.all : text[key]}</button>)}</div></div>
            <div className="gallery-grid">
              {visiblePhotos.map(({ photo, index }) => <button className="gallery-item" key={photo.file} onClick={() => setActiveImage(index)} aria-label={`${text.viewImage}: ${photo.captions[language]}`}><img src={imageUrl(`${photo.file}-sm`)} alt={photo.captions[language]} loading="lazy" width={photo.smWidth} height={photo.smHeight} /><span className="gallery-caption">{photo.captions[language]}<Plus size={21} /></span></button>)}
            </div>
            <p className="image-disclosure">{text.imageDisclosure}</p>
          </div>
        </section>
      <dialog ref={galleryDialog} className="lightbox" onCancel={() => setActiveImage(null)} onClick={event => { if (event.target === event.currentTarget) setActiveImage(null) }} aria-label={text.galleryTitle} onKeyDown={event => { if (event.key === 'ArrowRight' && activeImage !== null) setActiveImage((activeImage + 1) % galleryPhotos.length); if (event.key === 'ArrowLeft' && activeImage !== null) setActiveImage((activeImage + galleryPhotos.length - 1) % galleryPhotos.length) }}>
        {activeImage !== null && <div className="lightbox-inner"><button autoFocus className="lightbox-close icon-button" onClick={() => setActiveImage(null)} aria-label={text.close}><X /></button><img src={imageUrl(galleryPhotos[activeImage].file)} alt={galleryPhotos[activeImage].captions[language]} width={galleryPhotos[activeImage].width} height={galleryPhotos[activeImage].height} /><div className="lightbox-bottom"><button className="icon-button" onClick={() => setActiveImage((activeImage + galleryPhotos.length - 1) % galleryPhotos.length)} aria-label={language === 'he' ? 'הקודם' : language === 'ru' ? 'Назад' : 'Previous image'}><ChevronLeft /></button><p>{galleryPhotos[activeImage].captions[language]}</p><button className="icon-button" onClick={() => setActiveImage((activeImage + 1) % galleryPhotos.length)} aria-label={language === 'he' ? 'הבא' : language === 'ru' ? 'Далее' : 'Next image'}><ChevronRight /></button></div></div>}
      </dialog>
    </>
  )
}
