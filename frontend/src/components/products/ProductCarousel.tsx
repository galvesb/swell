import useEmblaCarousel from 'embla-carousel-react'
import { useCallback } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

interface ProductCarouselProps {
  images: string[]
  alt: string
}

export function ProductCarousel({ images, alt }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (images.length === 0) {
    return (
      <div className="w-full bg-swell-border flex items-center justify-center" style={{ aspectRatio: '2/3' }}>
        <span className="text-swell-text-light text-sm">Sem imagem</span>
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <img src={images[0]} alt={alt} className="w-full object-cover" style={{ aspectRatio: '2/3' }} />
    )
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((src, i) => (
            <div key={i} className="flex-none w-full" style={{ aspectRatio: '2/3' }}>
              <img src={src} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
        aria-label="Anterior"
      >
        <CaretLeft size={18} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
        aria-label="Próximo"
      >
        <CaretRight size={18} />
      </button>
    </div>
  )
}
