'use server'

import { designService } from '@/lib/supabase'

export type SaveConfigArgs = {
  color: 'black' | 'blue' | 'rose' | 'obsidian' | 'copper'
  finish: 'smooth' | 'textured'
  material: 'silicone' | 'polycarbonate'
  model: 'iphonex' | 'iphone11' | 'iphone12' | 'iphone13' | 'iphone14' | 'iphone15'
  configId: string
  croppedImageUrl: string // ✅ now saved to Supabase
}

export async function saveConfig({
  color,
  finish,
  material,
  model,
  configId,
  croppedImageUrl,
}: SaveConfigArgs) {
  await designService.updateDesign(configId, {
    case_color: color,
    case_finish: finish,
    case_material: material,
    phone_model: model,
    cropped_image_url: croppedImageUrl, // ✅ persisted
  })
}