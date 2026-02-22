'use client'

import { useState } from 'react'
import Link from 'next/link'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/config/templates'
import { buttonVariants } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredTemplates =
    selectedCategory === 'all'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory)

  return (
    <div className='bg-background/50'>
      <MaxWidthWrapper className='py-20'>
        {/* Header */}
        <div className='mb-16 text-center'>
          <h1 className='text-balance font-bold text-5xl md:text-6xl mb-6'>
            Choose Your Template
          </h1>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Select from our curated collection of 18+ designer templates. Each template can be customized with your own image to create something truly unique.
          </p>
        </div>

        {/* Category Filter */}
        <div className='mb-12 flex flex-wrap gap-2 justify-center'>
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              selectedCategory === 'all' && 'bg-accent text-background border-accent hover:bg-accent hover:text-background'
            )}>
            All Templates
          </button>
          {Object.entries(TEMPLATE_CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                selectedCategory === key && 'bg-accent text-background border-accent hover:bg-accent hover:text-background'
              )}>
              {label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className='group relative overflow-hidden rounded-xl border border-border bg-card hover:shadow-xl hover:border-accent/50 transition-all duration-300'>
              {/* Template Preview */}
              <div className='relative w-full aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden'>
                {/* Color swatch display */}
                <div className='absolute inset-0 flex items-center justify-center gap-3 p-6'>
                  {template.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className='flex-1 h-32 rounded-lg shadow-lg transition-transform group-hover:scale-110'
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                {/* Featured badge */}
                {template.featured && (
                  <div className='absolute top-4 right-4 bg-accent text-background px-3 py-1 rounded-full text-xs font-semibold shadow-lg'>
                    Featured
                  </div>
                )}

                {/* Hover overlay */}
                <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                  <Link
                    href={`/configure/upload?template=${template.id}`}
                    className={buttonVariants({
                      size: 'lg',
                      className: 'gap-2',
                    })}>
                    Use Template
                    <ArrowRight className='h-5 w-5' />
                  </Link>
                </div>
              </div>

              {/* Template Info */}
              <div className='p-6'>
                <h3 className='font-semibold text-lg mb-2 group-hover:text-accent transition-colors'>
                  {template.name}
                </h3>
                <p className='text-sm text-muted-foreground mb-4 line-clamp-2'>
                  {template.description}
                </p>

                {/* Category Tag & Action */}
                <div className='flex items-center justify-between gap-3'>
                  <span className='text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full capitalize'>
                    {template.category}
                  </span>
                  <Link
                    href={`/configure/upload?template=${template.id}`}
                    className={buttonVariants({
                      variant: 'ghost',
                      size: 'sm',
                      className: 'gap-1',
                    })}>
                    Select
                    <ArrowRight className='h-4 w-4' />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className='text-center py-16'>
            <p className='text-lg text-muted-foreground mb-4'>
              No templates found in this category
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className={buttonVariants()}>
              View All Templates
            </button>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  )
}
