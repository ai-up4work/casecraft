'use client'

import { useEffect, useState, useRef } from 'react'
import { templateService, SavedTemplate } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import {
  Loader2, Plus, Trash2, Pencil, Eye, EyeOff, Star, StarOff, Upload, X, Check
} from 'lucide-react'
import NextImage from 'next/image'

const CATEGORIES = ['minimalist', 'geometric', 'artistic', 'nature', 'abstract', 'vintage', 'modern', 'luxury']

const EMPTY_FORM = {
  name: '',
  description: '',
  category: 'minimalist' as SavedTemplate['category'],
  colors: [''],
  featured: false,
  enabled: true,
  sort_order: 0,
}

export default function AdminTemplatesPage() {
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  const [templates, setTemplates] = useState<SavedTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => { fetchTemplates() }, [])

  async function fetchTemplates() {
    try {
      setLoading(true)
      const data = await templateService.getAllTemplatesAdmin()
      setTemplates(data)
    } catch {
      toast({ title: 'Failed to load templates', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setImageFile(null)
    setImagePreview(null)
    setShowForm(true)
  }

  function openEdit(t: SavedTemplate) {
    setForm({
      name: t.name,
      description: t.description,
      category: t.category,
      colors: t.colors.length ? t.colors : [''],
      featured: t.featured,
      enabled: t.enabled,
      sort_order: t.sort_order,
    })
    setEditingId(t.id)
    setImageFile(null)
    setImagePreview(t.image_url)
    setShowForm(true)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function uploadToCloudinary(file: File, templateId: string): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('configId', `templates/${templateId}`)
    formData.append('type', 'original')
    const res = await fetch('/api/cloudinary/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Image upload failed')
    const data = await res.json()
    return data.secure_url
  }

  async function handleSave() {
    if (!form.name || !form.category) {
      toast({ title: 'Name and category are required', variant: 'destructive' })
      return
    }
    if (!editingId && !imageFile) {
      toast({ title: 'Please select an image', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const colors = form.colors.filter(Boolean)

      if (editingId) {
        // Editing existing template
        let image_url = imagePreview ?? ''
        if (imageFile) {
          image_url = await uploadToCloudinary(imageFile, editingId)
        }
        await templateService.updateTemplate(editingId, { ...form, colors, image_url })
        toast({ title: 'Template updated ✓' })
      } else {
        // Create with temp ID first to get real ID for Cloudinary path
        const tempTemplate = await templateService.createTemplate({
          ...form,
          colors,
          image_url: 'pending',
        })
        const image_url = await uploadToCloudinary(imageFile!, tempTemplate.id)
        await templateService.updateTemplate(tempTemplate.id, { image_url })
        toast({ title: 'Template created ✓' })
      }

      setShowForm(false)
      fetchTemplates()
    } catch (err) {
      toast({ title: 'Failed to save template', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this template? This cannot be undone.')) return
    try {
      await templateService.deleteTemplate(id)
      setTemplates((prev) => prev.filter((t) => t.id !== id))
      toast({ title: 'Template deleted' })
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' })
    }
  }

  async function handleToggleEnabled(t: SavedTemplate) {
    try {
      await templateService.toggleEnabled(t.id, !t.enabled)
      setTemplates((prev) => prev.map((x) => x.id === t.id ? { ...x, enabled: !t.enabled } : x))
    } catch {
      toast({ title: 'Failed to update', variant: 'destructive' })
    }
  }

  async function handleToggleFeatured(t: SavedTemplate) {
    try {
      await templateService.toggleFeatured(t.id, !t.featured)
      setTemplates((prev) => prev.map((x) => x.id === t.id ? { ...x, featured: !t.featured } : x))
    } catch {
      toast({ title: 'Failed to update', variant: 'destructive' })
    }
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-10'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>Templates</h1>
          <p className='text-muted-foreground mt-1'>{templates.length} templates total</p>
        </div>
        <button
          onClick={openAdd}
          className='flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90'>
          <Plus className='h-4 w-4' /> Add Template
        </button>
      </div>

      {/* Template Grid */}
      {loading ? (
        <div className='flex justify-center py-20'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {templates.map((t) => (
            <div
              key={t.id}
              className={`relative rounded-xl border bg-card overflow-hidden transition-opacity ${!t.enabled ? 'opacity-50' : ''}`}>
              {/* Image */}
              <div className='relative h-48 bg-muted'>
                {t.image_url && t.image_url !== 'pending' ? (
                  <NextImage src={t.image_url} alt={t.name} fill className='object-cover' />
                ) : (
                  <div className='flex items-center justify-center h-full text-muted-foreground text-sm'>No image</div>
                )}
                {/* Badges */}
                <div className='absolute top-2 left-2 flex gap-1'>
                  {t.featured && (
                    <span className='bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-medium'>Featured</span>
                  )}
                  {!t.enabled && (
                    <span className='bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full font-medium'>Disabled</span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className='p-3'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='font-semibold text-sm'>{t.name}</p>
                    <p className='text-xs text-muted-foreground capitalize'>{t.category}</p>
                  </div>
                  <div className='flex gap-1'>
                    {t.colors.map((c, i) => (
                      <div key={i} className='h-4 w-4 rounded-full border border-border' style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-1 mt-3'>
                  <button onClick={() => openEdit(t)} className='flex-1 flex items-center justify-center gap-1 text-xs border rounded-md py-1.5 hover:bg-muted'>
                    <Pencil className='h-3 w-3' /> Edit
                  </button>
                  <button onClick={() => handleToggleFeatured(t)} className='p-1.5 border rounded-md hover:bg-muted' title={t.featured ? 'Unfeature' : 'Feature'}>
                    {t.featured ? <StarOff className='h-3.5 w-3.5 text-yellow-500' /> : <Star className='h-3.5 w-3.5' />}
                  </button>
                  <button onClick={() => handleToggleEnabled(t)} className='p-1.5 border rounded-md hover:bg-muted' title={t.enabled ? 'Disable' : 'Enable'}>
                    {t.enabled ? <EyeOff className='h-3.5 w-3.5' /> : <Eye className='h-3.5 w-3.5 text-green-500' />}
                  </button>
                  <button onClick={() => handleDelete(t.id)} className='p-1.5 border rounded-md hover:bg-red-50 text-red-500'>
                    <Trash2 className='h-3.5 w-3.5' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='bg-background rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold'>{editingId ? 'Edit Template' : 'Add Template'}</h2>
              <button onClick={() => setShowForm(false)}><X className='h-5 w-5' /></button>
            </div>

            {/* Image Upload */}
            <div>
              <label className='text-sm font-medium block mb-1.5'>Template Image *</label>
              <div
                onClick={() => fileRef.current?.click()}
                className='relative h-40 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors overflow-hidden'>
                {imagePreview ? (
                  <NextImage src={imagePreview} alt='preview' fill className='object-cover' />
                ) : (
                  <div className='flex flex-col items-center justify-center h-full text-muted-foreground gap-2'>
                    <Upload className='h-6 w-6' />
                    <span className='text-sm'>Click to upload image</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type='file' accept='image/*' className='hidden' onChange={handleFileChange} />
            </div>

            {/* Name */}
            <div>
              <label className='text-sm font-medium block mb-1.5'>Name *</label>
              <input
                className='w-full border rounded-lg px-3 py-2 text-sm bg-background'
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder='e.g. Minimalist Clean'
              />
            </div>

            {/* Description */}
            <div>
              <label className='text-sm font-medium block mb-1.5'>Description</label>
              <input
                className='w-full border rounded-lg px-3 py-2 text-sm bg-background'
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder='Short description'
              />
            </div>

            {/* Category */}
            <div>
              <label className='text-sm font-medium block mb-1.5'>Category *</label>
              <select
                className='w-full border rounded-lg px-3 py-2 text-sm bg-background'
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as SavedTemplate['category'] }))}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Colors */}
            <div>
              <label className='text-sm font-medium block mb-1.5'>Colors (hex)</label>
              <div className='space-y-2'>
                {form.colors.map((color, i) => (
                  <div key={i} className='flex items-center gap-2'>
                    <div className='h-8 w-8 rounded-full border' style={{ backgroundColor: color || '#ccc' }} />
                    <input
                      type='text'
                      className='flex-1 border rounded-lg px-3 py-1.5 text-sm bg-background'
                      value={color}
                      placeholder='#000000'
                      onChange={(e) => {
                        const newColors = [...form.colors]
                        newColors[i] = e.target.value
                        setForm((p) => ({ ...p, colors: newColors }))
                      }}
                    />
                    {form.colors.length > 1 && (
                      <button onClick={() => setForm((p) => ({ ...p, colors: p.colors.filter((_, j) => j !== i) }))}>
                        <X className='h-4 w-4 text-muted-foreground' />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setForm((p) => ({ ...p, colors: [...p.colors, ''] }))}
                  className='text-xs text-primary hover:underline'>
                  + Add color
                </button>
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <label className='text-sm font-medium block mb-1.5'>Sort Order</label>
              <input
                type='number'
                className='w-full border rounded-lg px-3 py-2 text-sm bg-background'
                value={form.sort_order}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
              />
            </div>

            {/* Toggles */}
            <div className='flex gap-4'>
              <label className='flex items-center gap-2 cursor-pointer text-sm'>
                <input type='checkbox' checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />
                Featured
              </label>
              <label className='flex items-center gap-2 cursor-pointer text-sm'>
                <input type='checkbox' checked={form.enabled} onChange={(e) => setForm((p) => ({ ...p, enabled: e.target.checked }))} />
                Enabled
              </label>
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className='w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg py-2.5 font-medium hover:opacity-90 disabled:opacity-50'>
              {saving ? <Loader2 className='h-4 w-4 animate-spin' /> : <Check className='h-4 w-4' />}
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Template'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}