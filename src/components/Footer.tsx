import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'

const Footer = () => {
  return (
    <footer className='bg-card border-t border-border mt-auto'>
      <MaxWidthWrapper className='py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          <div>
            <h3 className='font-bold text-lg mb-3'>
              <span className='text-foreground'>Case</span>
              <span className='text-accent'>Craft</span>
            </h3>
            <p className='text-sm text-muted-foreground'>
              Your phone, your canvas. Create artisan custom phone cases.
            </p>
          </div>

          <div>
            <h4 className='font-semibold mb-3'>Product</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/templates' className='text-muted-foreground hover:text-foreground'>
                  Templates
                </Link>
              </li>
              <li>
                <Link href='/dashboard' className='text-muted-foreground hover:text-foreground'>
                  My Designs
                </Link>
              </li>
              <li>
                <Link href='/' className='text-muted-foreground hover:text-foreground'>
                  Home
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-semibold mb-3'>Company</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  About
                </Link>
              </li>
              <li>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Blog
                </Link>
              </li>
              <li>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-semibold mb-3'>Legal</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Terms
                </Link>
              </li>
              <li>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-border pt-6'>
          <p className='text-sm text-muted-foreground text-center'>
            &copy; {new Date().getFullYear()} CaseCraft. All rights reserved.
          </p>
        </div>
      </MaxWidthWrapper>
    </footer>
  )
}

export default Footer
