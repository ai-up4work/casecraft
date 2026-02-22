import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'casecobra', // 👈 change this to your schema name
  },
})

export interface SavedDesign {
  id: string
  email: string
  template_id: string
  design_name: string
  image_url: string
  cropped_image_url?: string
  phone_model?: string
  case_color?: string
  case_material?: string
  case_finish?: string
  width: number
  height: number
  created_at: string
  updated_at: string
}

export interface SavedOrder {
  id: string
  email: string
  name: string
  phone: string
  address: string
  city: string
  postal_code: string
  country: string
  state?: string
  design_id?: string
  template_id: string
  order_details: string
  created_at: string
}

export const designService = {
  async saveDesign(email: string, design: Omit<SavedDesign, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('designs')
      .insert([
        {
          email,
          template_id: design.template_id,
          design_name: design.design_name,
          image_url: design.image_url,
          cropped_image_url: design.cropped_image_url,
          phone_model: design.phone_model,
          case_color: design.case_color,
          case_material: design.case_material,
          case_finish: design.case_finish,
          width: design.width,
          height: design.height,
        },
      ])
      .select()

    if (error) throw error
    return data?.[0]
  },

  async getUserDesigns(email: string) {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as SavedDesign[]
  },

  async getDesignById(id: string) {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as SavedDesign
  },

  async updateDesign(id: string, updates: Partial<SavedDesign>) {
    const { data, error } = await supabase
      .from('designs')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    return data?.[0]
  },

  async deleteDesign(id: string) {
    const { error } = await supabase.from('designs').delete().eq('id', id)
    if (error) throw error
  },
}

export const orderService = {
  async createOrder(order: Omit<SavedOrder, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          email: order.email,
          name: order.name,
          phone: order.phone,
          address: order.address,
          city: order.city,
          postal_code: order.postal_code,
          country: order.country,
          state: order.state,
          design_id: order.design_id,
          template_id: order.template_id,
          order_details: order.order_details,
        },
      ])
      .select()

    if (error) throw error
    return data?.[0]
  },

  async getUserOrders(email: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as SavedOrder[]
  },

  async getOrderById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as SavedOrder
  },
}

export interface SavedTemplate {
  id: string
  name: string
  description: string
  category: 'minimalist' | 'geometric' | 'artistic' | 'nature' | 'abstract' | 'vintage' | 'modern' | 'luxury'
  image_url: string
  colors: string[]
  featured: boolean
  enabled: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export const templateService = {
  async getAllTemplates() {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('enabled', true)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data as SavedTemplate[]
  },

  async getAllTemplatesAdmin() {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data as SavedTemplate[]
  },

  async getTemplateById(id: string) {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as SavedTemplate
  },

  async getTemplatesByCategory(category: string) {
    const query = supabase
      .from('templates')
      .select('*')
      .eq('enabled', true)
      .order('sort_order', { ascending: true })
    if (category !== 'all') query.eq('category', category)
    const { data, error } = await query
    if (error) throw error
    return data as SavedTemplate[]
  },

  async getFeaturedTemplates() {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('enabled', true)
      .eq('featured', true)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data as SavedTemplate[]
  },

  async createTemplate(template: Omit<SavedTemplate, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('templates')
      .insert([template])
      .select()
    if (error) throw error
    return data?.[0] as SavedTemplate
  },

  async updateTemplate(id: string, updates: Partial<SavedTemplate>) {
    const { data, error } = await supabase
      .from('templates')
      .update(updates)
      .eq('id', id)
      .select()
    if (error) throw error
    return data?.[0] as SavedTemplate
  },

  async deleteTemplate(id: string) {
    const { error } = await supabase.from('templates').delete().eq('id', id)
    if (error) throw error
  },

  async toggleEnabled(id: string, enabled: boolean) {
    return templateService.updateTemplate(id, { enabled })
  },

  async toggleFeatured(id: string, featured: boolean) {
    return templateService.updateTemplate(id, { featured })
  },
}