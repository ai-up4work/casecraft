'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button, buttonVariants } from '@/components/ui/button'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const ThankYou = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const designId = searchParams.get('designId')

  useEffect(() => {
    // Redirect to order page after a short delay to show the message
    const timeout = setTimeout(() => {
      const orderPageUrl = designId
        ? `/order?designId=${designId}`
        : '/order'
      router.push(orderPageUrl)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [designId, router])

  return (
    <div className='bg-background/50 min-h-screen flex items-center justify-center py-16'>
      <MaxWidthWrapper className='max-w-2xl text-center'>
        <div className='mb-8'>
          <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10'>
            <CheckCircle2 className='h-12 w-12 text-accent' />
          </div>
          <h1 className='text-balance font-bold text-5xl md:text-6xl mb-6'>
            Design Complete!
          </h1>
          <p className='text-lg text-muted-foreground mb-4'>
            Your custom phone case design is ready. Now let's get it to you!
          </p>
          <p className='text-sm text-muted-foreground'>
            Redirecting you to place your order...
          </p>
        </div>

        {/* Quick Links */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            href={designId ? `/order?designId=${designId}` : '/order'}
            className={buttonVariants({
              size: 'lg',
              className: 'gap-2',
            })}>
            Place Order Now
            <ArrowRight className='h-5 w-5' />
          </Link>

          <Link
            href='/templates'
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
            })}>
            Back to Templates
          </Link>
        </div>

        {/* Info Box */}
        <div className='mt-12 p-6 bg-card border border-border rounded-lg'>
          <h3 className='font-semibold mb-3'>What's Next?</h3>
          <ul className='text-sm text-muted-foreground space-y-2 text-left'>
            <li>✓ Share your shipping information</li>
            <li>✓ Contact us via WhatsApp or Email</li>
            <li>✓ We'll confirm pricing & customize your design</li>
            <li>✓ Get your unique phone case delivered</li>
          </ul>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export default ThankYou
