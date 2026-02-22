// lib/templates.ts
// Replaces the hardcoded TEMPLATES array — now fetches from Supabase
import { templateService, SavedTemplate } from '@/lib/supabase'

export type { SavedTemplate as Template }

export const TEMPLATE_CATEGORIES = {
  minimalist: 'Minimalist',
  geometric: 'Geometric',
  artistic: 'Artistic',
  nature: 'Nature',
  abstract: 'Abstract',
  vintage: 'Vintage',
  modern: 'Modern',
  luxury: 'Luxury',
}

// Use these in server components
export async function getTemplates() {
  return templateService.getAllTemplates()
}

export async function getFeaturedTemplates() {
  return templateService.getFeaturedTemplates()
}

export async function getTemplateById(id: string) {
  return templateService.getTemplateById(id).catch(() => null)
}

export async function getTemplatesByCategory(category: string) {
  return templateService.getTemplatesByCategory(category)
}