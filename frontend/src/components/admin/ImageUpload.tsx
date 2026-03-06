import { useState, useRef } from 'react'
import { X, Upload } from '@phosphor-icons/react'
import { productsApi } from '@/api/products'

interface ImageUploadProps {
  productId: string
  currentImages: string[]
  onChange: (images: string[]) => void
}

export function ImageUpload({ productId, currentImages, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError('')
    setUploading(true)
    try {
      const { images } = await productsApi.uploadImages(productId, Array.from(files))
      onChange(images)
    } catch {
      setError('Erro ao enviar imagem. Verifique o formato e tamanho (máx. 5MB).')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async (img: string) => {
    const filename = img.split('/').pop() ?? ''
    try {
      await productsApi.deleteImage(productId, filename)
      onChange(currentImages.filter((i) => i !== img))
    } catch {
      setError('Erro ao remover imagem.')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {currentImages.map((img) => (
          <div key={img} className="relative w-24 h-32">
            <img src={img} alt="produto" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(img)}
              className="absolute top-1 right-1 bg-swell-alert text-white rounded-full p-0.5"
              aria-label="Remover"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-32 border-2 border-dashed border-swell-border hover:border-swell-accent flex flex-col items-center justify-center gap-1 text-swell-text-light text-xs transition-colors disabled:opacity-50"
        >
          <Upload size={20} />
          {uploading ? 'Enviando...' : 'Adicionar'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-swell-alert text-xs mt-1">{error}</p>}
      <p className="text-xs text-swell-text-light mt-1">JPEG, PNG ou WEBP. Máx. 5MB por arquivo.</p>
    </div>
  )
}
