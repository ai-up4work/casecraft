'use server'

import { designService } from '@/lib/supabase'

export async function createConfiguration({
  email,
  templateId,
  width,
  height,
  imageUrl,
}: {
  email: string
  templateId: string
  width: number
  height: number
  imageUrl: string
}) {
  const design = await designService.saveDesign(email, {
    email,
    template_id: templateId,
    design_name: 'My Case Design',
    image_url: imageUrl,
    width,
    height,
  })

  if (!design) throw new Error('Failed to create design')

  return { configId: design.id }
}