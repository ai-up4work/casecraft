'use client'

import { useState } from 'react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Card } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowRight, Trash2, Copy, CheckCircle } from 'lucide-react'

interface SavedDesign {
  id: string
  email: string
  template_id: string
  design_name: string
  image_url: string
  created_at: string
}

export default function DashboardPage() {
  const [email, setEmail] = useState('')
  const [designs, setDesigns] = useState<SavedDesign[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleSearchDesigns = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const response = await fetch(`/api/designs?email=${encodeURIComponent(email)}`)
      if (response.ok) {
        const data = await response.json()
        setDesigns(data)
      } else {
        setDesigns([])
      }
    } catch (error) {
      console.error('Error fetching designs:', error)
      setDesigns([])
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  const handleDeleteDesign = async (designId: string) => {
    if (!window.confirm('Are you sure you want to delete this design?')) return

    try {
      const response = await fetch(`/api/designs/${designId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDesigns(designs.filter((d) => d.id !== designId))
      }
    } catch (error) {
      console.error('Error deleting design:', error)
    }
  }

  const handleCopyDesignId = (designId: string) => {
    navigator.clipboard.writeText(designId)
    setCopiedId(designId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className='min-h-screen bg-background py-12'>
      <MaxWidthWrapper>
        <div className='mb-12'>
          <h1 className='text-5xl font-bold mb-4'>My Designs</h1>
          <p className='text-muted-foreground'>
            Enter your email to view and manage your saved case designs.
          </p>
        </div>

        {/* Search Section */}
        <Card className='p-8 mb-12'>
          <form onSubmit={handleSearchDesigns} className='space-y-4'>
            <div className='space-y-2'>
              <label htmlFor='email' className='font-semibold'>
                Email Address
              </label>
              <Input
                id='email'
                type='email'
                placeholder='your@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type='submit' disabled={loading} className='w-full'>
              {loading ? 'Searching...' : 'Find My Designs'}
            </Button>
          </form>
        </Card>

        {/* Results Section */}
        {searched && (
          <>
            {designs.length === 0 ? (
              <Card className='p-12 text-center'>
                <p className='text-lg text-muted-foreground mb-6'>
                  No designs found for this email address.
                </p>
                <Link href='/templates' className={buttonVariants()}>
                  Create Your First Design <ArrowRight className='h-4 w-4 ml-2' />
                </Link>
              </Card>
            ) : (
              <>
                <div className='mb-6'>
                  <p className='text-sm text-muted-foreground'>
                    Found {designs.length} design{designs.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {designs.map((design) => (
                    <Card key={design.id} className='overflow-hidden hover:shadow-lg transition'>
                      {/* Image Preview */}
                      <div className='aspect-square bg-muted relative overflow-hidden'>
                        <img
                          src={design.image_url}
                          alt={design.design_name}
                          className='w-full h-full object-cover'
                        />
                      </div>

                      {/* Design Info */}
                      <div className='p-6'>
                        <h3 className='text-lg font-bold mb-1'>{design.design_name}</h3>
                        <p className='text-sm text-muted-foreground mb-1'>
                          Template: {design.template_id}
                        </p>
                        <p className='text-xs text-muted-foreground mb-4'>
                          {new Date(design.created_at).toLocaleDateString()}
                        </p>

                        <div className='space-y-2'>
                          <Link
                            href={`/order?designId=${design.id}&templateId=${design.template_id}`}
                            className={buttonVariants({
                              className: 'w-full',
                              size: 'sm',
                            })}
                          >
                            Order This Design
                          </Link>

                          <div className='flex gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleCopyDesignId(design.id)}
                              className='flex-1'
                            >
                              {copiedId === design.id ? (
                                <>
                                  <CheckCircle className='h-4 w-4 mr-1' />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className='h-4 w-4 mr-1' />
                                  Copy ID
                                </>
                              )}
                            </Button>

                            <Button
                              variant='destructive'
                              size='sm'
                              onClick={() => handleDeleteDesign(design.id)}
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className='mt-12 p-8 bg-secondary/30 rounded-lg border border-accent/20'>
                  <h3 className='font-bold mb-2'>Want to create a new design?</h3>
                  <p className='text-muted-foreground mb-4'>
                    Browse our template collection and customize with your own image.
                  </p>
                  <Link href='/templates' className={buttonVariants()}>
                    Browse Templates <ArrowRight className='h-4 w-4 ml-2' />
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </MaxWidthWrapper>
    </div>
  )
}
