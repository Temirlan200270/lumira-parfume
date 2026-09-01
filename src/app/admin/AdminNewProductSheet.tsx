'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { AppStrings } from '@/lib/strings'
import type { CatalogSection, Gender } from '@/lib/types'
import { createAdminProduct, type CreatedAdminProduct } from './actions'
import AdminSheet from './AdminSheet'

const GENDERS: { id: Gender; label: string }[] = [
  { id: 'male', label: AppStrings.gender.male },
  { id: 'female', label: AppStrings.gender.female },
  { id: 'unisex', label: AppStrings.gender.unisex },
]

const SECTIONS: { id: CatalogSection; label: string }[] = [
  { id: 'razliv', label: AppStrings.catalog.razliv },
  { id: 'raspiv', label: AppStrings.catalog.raspiv },
]

const chipClass = (active: boolean) =>
  `inline-flex h-11 min-w-0 flex-1 items-center justify-center px-2 text-xs ${
    active ? 'bg-stone-900 text-stone-50' : 'border border-stone-200 text-stone-700'
  }`

export default function AdminNewProductSheet({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (product: CreatedAdminProduct) => void
}) {
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [brand, setBrand] = useState('')
  const [name, setName] = useState('')
  const [gender, setGender] = useState<Gender>('unisex')
  const [section, setSection] = useState<CatalogSection>('razliv')
  const [price, setPrice] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState('')
  const pendingRef = useRef(false)
  pendingRef.current = pending

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const close = useCallback(() => {
    if (!pendingRef.current) onClose()
  }, [onClose])

  const pickPhoto = (file: File | null) => {
    if (preview) URL.revokeObjectURL(preview)
    setPhoto(file)
    setPreview(file ? URL.createObjectURL(file) : '')
  }

  const submit = async () => {
    setFormError('')
    setPending(true)
    const form = new FormData()
    form.set('brand', brand)
    form.set('name', name)
    form.set('gender', gender)
    form.set('section', section)
    form.set('pricePerMlTenge', price)
    if (photo) form.set('photo', photo)
    const result = await createAdminProduct(form)
    setPending(false)
    if (!result.ok) {
      setFormError(result.message)
      toast(AppStrings.admin.saveError, 1500)
      return
    }
    toast(AppStrings.admin.productCreated, 1500)
    onCreated(result.product)
    onClose()
  }

  return (
    <AdminSheet
      title={AppStrings.admin.newProduct}
      onClose={close}
      footer={
        <div className="space-y-2">
          {formError ? <p className="text-sm text-error">{formError}</p> : null}
          <Button fullWidth disabled={pending} onClick={() => void submit()}>
            {AppStrings.admin.createProduct}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{AppStrings.admin.photo}</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => pickPhoto(event.currentTarget.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative mx-auto flex h-44 w-32 items-center justify-center overflow-hidden border border-stone-200 bg-paper"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="px-4 text-center text-sm text-muted">{AppStrings.admin.photoPick}</span>
            )}
          </button>
          {preview ? (
            <button
              type="button"
              className="h-11 text-sm text-stone-900 underline"
              onClick={() => fileRef.current?.click()}
            >
              {AppStrings.admin.photoChange}
            </button>
          ) : null}
          <p className="text-xs text-muted">{AppStrings.admin.photoHint}</p>
        </div>

        <Input
          label={AppStrings.catalog.brand}
          name="admin-product-brand"
          value={brand}
          autoComplete="off"
          onChange={(event) => setBrand(event.currentTarget.value)}
        />
        <Input
          label={AppStrings.admin.productName}
          name="admin-product-name"
          value={name}
          autoComplete="off"
          onChange={(event) => setName(event.currentTarget.value)}
        />

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{AppStrings.catalog.gender}</p>
          <div className="flex gap-1">
            {GENDERS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={gender === item.id}
                onClick={() => setGender(item.id)}
                className={chipClass(gender === item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{AppStrings.admin.format}</p>
          <div className="flex gap-1">
            {SECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={section === item.id}
                onClick={() => setSection(item.id)}
                className={chipClass(section === item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label={AppStrings.admin.pricePerMl}
          name="admin-product-price"
          type="number"
          min={1}
          inputMode="numeric"
          value={price}
          onChange={(event) => setPrice(event.currentTarget.value)}
        />
      </div>
    </AdminSheet>
  )
}
