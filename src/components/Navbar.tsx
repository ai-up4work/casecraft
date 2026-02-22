import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { buttonVariants } from './ui/button'
import { ArrowRight } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className='sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-accent/20 bg-background/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between border-b border-accent/20'>
          <Link href='/' className='flex z-40 font-semibold gap-1'>
            <span className='text-foreground'>Case</span>
            <span className='text-accent'>Craft</span>
          </Link>

          <div className='h-full flex items-center space-x-4'>
            <Link
              href='/dashboard'
              className={buttonVariants({
                size: 'sm',
                variant: 'ghost',
              })}>
              My Designs
            </Link>

            <Link
              href='/templates'
              className={buttonVariants({
                size: 'sm',
                className: 'hidden sm:flex items-center gap-1',
              })}>
              Create case
              <ArrowRight className='ml-1.5 h-5 w-5' />
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar
