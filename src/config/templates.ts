export interface Template {
  id: string
  name: string
  description: string
  category: 'minimalist' | 'geometric' | 'artistic' | 'nature' | 'abstract' | 'vintage' | 'modern' | 'luxury'
  colors: string[]
  featured: boolean
}

export const TEMPLATES: Template[] = [
  {
    id: 'minimalist-white',
    name: 'Minimalist Clean',
    description: 'Simple, elegant design with clean lines',
    category: 'minimalist',
    colors: ['#E8D5B0', '#0D0D0D', '#FFFFFF'],
    featured: true,
  },
  {
    id: 'minimalist-sand',
    name: 'Minimalist Sand',
    description: 'Warm sand tones with plenty of space',
    category: 'minimalist',
    colors: ['#E8D5B0', '#0D0D0D'],
    featured: true,
  },
  {
    id: 'geometric-hex',
    name: 'Hexagon Grid',
    description: 'Modern hexagon pattern design',
    category: 'geometric',
    colors: ['#0D0D0D', '#C4622D', '#E8D5B0'],
    featured: true,
  },
  {
    id: 'geometric-triangles',
    name: 'Triangle Mosaic',
    description: 'Dynamic triangular pattern',
    category: 'geometric',
    colors: ['#C4622D', '#E8D5B0', '#0D0D0D'],
    featured: false,
  },
  {
    id: 'geometric-lines',
    name: 'Linear Geometry',
    description: 'Contemporary line art with copper accents',
    category: 'geometric',
    colors: ['#0D0D0D', '#C4622D'],
    featured: false,
  },
  {
    id: 'marble-classic',
    name: 'Classic Marble',
    description: 'Elegant marble texture effect',
    category: 'artistic',
    colors: ['#E8D5B0', '#0D0D0D', '#C4622D'],
    featured: true,
  },
  {
    id: 'marble-copper',
    name: 'Copper Swirl',
    description: 'Rich copper and sand marble blend',
    category: 'artistic',
    colors: ['#C4622D', '#E8D5B0', '#0D0D0D'],
    featured: false,
  },
  {
    id: 'watercolor-blend',
    name: 'Watercolor Blend',
    description: 'Soft flowing watercolor transitions',
    category: 'artistic',
    colors: ['#C4622D', '#E8D5B0'],
    featured: false,
  },
  {
    id: 'nature-forest',
    name: 'Forest Vibes',
    description: 'Natural earth and green tones',
    category: 'nature',
    colors: ['#0D0D0D', '#4A7C59', '#E8D5B0'],
    featured: false,
  },
  {
    id: 'nature-sunset',
    name: 'Sunset Gradient',
    description: 'Warm sunset inspired colors',
    category: 'nature',
    colors: ['#FF6B35', '#F7931E', '#E8D5B0'],
    featured: false,
  },
  {
    id: 'nature-botanical',
    name: 'Botanical',
    description: 'Delicate botanical patterns and leaves',
    category: 'nature',
    colors: ['#0D0D0D', '#E8D5B0'],
    featured: false,
  },
  {
    id: 'abstract-dots',
    name: 'Dot Matrix',
    description: 'Abstract polka dot pattern design',
    category: 'abstract',
    colors: ['#0D0D0D', '#C4622D', '#E8D5B0'],
    featured: false,
  },
  {
    id: 'abstract-waves',
    name: 'Wave Flows',
    description: 'Smooth flowing wave patterns',
    category: 'abstract',
    colors: ['#C4622D', '#E8D5B0', '#0D0D0D'],
    featured: false,
  },
  {
    id: 'vintage-typewriter',
    name: 'Vintage Typewriter',
    description: 'Nostalgic typewriter key aesthetic',
    category: 'vintage',
    colors: ['#0D0D0D', '#E8D5B0'],
    featured: false,
  },
  {
    id: 'vintage-retro',
    name: 'Retro 70s',
    description: 'Classic 70s inspired vintage vibes',
    category: 'vintage',
    colors: ['#8B4513', '#D2691E', '#E8D5B0'],
    featured: false,
  },
  {
    id: 'modern-neon',
    name: 'Neon Lines',
    description: 'Vibrant neon lines on dark background',
    category: 'modern',
    colors: ['#0D0D0D', '#FF1493', '#00D9FF'],
    featured: true,
  },
  {
    id: 'modern-glass',
    name: 'Glassmorphism',
    description: 'Frosted glass effect with depth',
    category: 'modern',
    colors: ['#E8D5B0', '#0D0D0D'],
    featured: false,
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    description: 'Premium gold foil and black elegance',
    category: 'luxury',
    colors: ['#0D0D0D', '#E8D5B0'],
    featured: true,
  },
]

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

export const FEATURED_TEMPLATES = TEMPLATES.filter((t) => t.featured)

export const getTemplateById = (id: string) => {
  return TEMPLATES.find((t) => t.id === id)
}

export const getTemplatesByCategory = (category: string) => {
  if (category === 'all') return TEMPLATES
  return TEMPLATES.filter((t) => t.category === category)
}
