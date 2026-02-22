import { Icons } from '@/components/Icons'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Phone from '@/components/Phone'
import { Reviews } from '@/components/Reviews'
import { buttonVariants } from '@/components/ui/button'
import { ArrowRight, Check, Star, Palette } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='bg-secondary/30'>
      <section>
        <MaxWidthWrapper className='pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52'>
          <div className='col-span-2 px-6 lg:px-0 lg:pt-4'>
            <div className='relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start'>
              <h1 className='relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-5xl md:text-6xl lg:text-7xl'>
                Your phone,{' '}
                <span className='bg-accent px-2 text-background'>your canvas.</span>
              </h1>
              <p className='mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap'>
                Craft your perfect phone case with our curated template collection. Choose from artisan designs, customize with your image, and express your unique style.
              </p>

              <ul className='mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start'>
                <div className='space-y-2'>
                  <li className='flex gap-1.5 items-center text-left'>
                    <Check className='h-5 w-5 shrink-0 text-accent' />
                    Premium durable materials
                  </li>
                  <li className='flex gap-1.5 items-center text-left'>
                    <Check className='h-5 w-5 shrink-0 text-accent' />
                    10+ artistic templates included
                  </li>
                  <li className='flex gap-1.5 items-center text-left'>
                    <Check className='h-5 w-5 shrink-0 text-accent' />
                    Save and reuse your designs
                  </li>
                </div>
              </ul>

              <div className='mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5'>
                <div className='flex -space-x-4'>
                  <img
                    className='inline-block h-10 w-10 rounded-full ring-2 ring-background'
                    src='/users/user-1.png'
                    alt='user image'
                  />
                  <img
                    className='inline-block h-10 w-10 rounded-full ring-2 ring-background'
                    src='/users/user-2.png'
                    alt='user image'
                  />
                  <img
                    className='inline-block h-10 w-10 rounded-full ring-2 ring-background'
                    src='/users/user-3.png'
                    alt='user image'
                  />
                </div>

                <div className='flex flex-col justify-between items-center sm:items-start'>
                  <div className='flex gap-0.5'>
                    <Star className='h-4 w-4 text-accent fill-accent' />
                    <Star className='h-4 w-4 text-accent fill-accent' />
                    <Star className='h-4 w-4 text-accent fill-accent' />
                    <Star className='h-4 w-4 text-accent fill-accent' />
                    <Star className='h-4 w-4 text-accent fill-accent' />
                  </div>

                  <p>
                    Join artisan creators today
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit'>
            <Phone className='w-64' imgSrc='/testimonials/1.jpg' />
          </div>
        </MaxWidthWrapper>
      </section>

      <section className='bg-primary/10 py-24'>
        <MaxWidthWrapper className='flex flex-col items-center gap-16 sm:gap-32'>
          <div className='flex flex-col lg:flex-row items-center gap-4 sm:gap-6'>
            <h2 className='order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl'>
              Curated for{' '}
              <span className='relative px-2'>
                artisans
              </span>
            </h2>
            <Palette className='w-24 h-24 order-0 lg:order-2 text-accent' />
          </div>

          <div className='mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16'>
            <div className='flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20'>
              <div className='flex gap-0.5 mb-2'>
                <Star className='h-5 w-5 text-accent fill-accent' />
                <Star className='h-5 w-5 text-accent fill-accent' />
                <Star className='h-5 w-5 text-accent fill-accent' />
                <Star className='h-5 w-5 text-accent fill-accent' />
                <Star className='h-5 w-5 text-accent fill-accent' />
              </div>
              <div className='text-lg leading-8'>
                <p>
                  "The attention to detail is incredible. I loved being able to choose from different templates and then customize my own image. 
                  <span className='p-0.5 bg-foreground text-background'>
                    The quality exceeded my expectations
                  </span>
                  ."
                </p>
              </div>
              <div className='flex gap-4 mt-2'>
                <img
                  className='rounded-full h-12 w-12 object-cover'
                  src='/users/user-1.png'
                  alt='user'
                />
                <div className='flex flex-col'>
                  <p className='font-semibold'>Alex</p>
                  <div className='flex gap-1.5 items-center text-muted-foreground'>
                    <Check className='h-4 w-4 stroke-[3px] text-accent' />
                    <p className='text-sm'>Verified Creator</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20'>
              <div className='flex gap-0.5 mb-2'>
                <Star className='h-5 w-5 text-accent fill-accent' />
                <Star className='h-5 w-5 text-accent fill-accent' />
                <Star className='h-5 w-5 text-accent fill-accent' />
                <Star className='h-5 w-5 text-accent fill-accent' />
                <Star className='h-5 w-5 text-accent fill-accent' />
              </div>
              <div className='text-lg leading-8'>
                <p>
                  "What I love most is the simplicity. The templates are beautiful, and
                  <span className='p-0.5 bg-foreground text-background'>
                    I can easily save my designs to reorder later
                  </span>
                  . Perfect for a creative like me."
                </p>
              </div>
              <div className='flex gap-4 mt-2'>
                <img
                  className='rounded-full h-12 w-12 object-cover'
                  src='/users/user-4.jpg'
                  alt='user'
                />
                <div className='flex flex-col'>
                  <p className='font-semibold'>Morgan</p>
                  <div className='flex gap-1.5 items-center text-muted-foreground'>
                    <Check className='h-4 w-4 stroke-[3px] text-accent' />
                    <p className='text-sm'>Verified Creator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>

        <div className='pt-16'>
          <Reviews />
        </div>
      </section>

      <section>
        <MaxWidthWrapper className='py-24'>
          <div className='mb-12 px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl sm:text-center'>
              <h2 className='order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl'>
                Choose a template and{' '}
                <span className='relative px-2 bg-accent text-white'>
                  start creating
                </span>
              </h2>
            </div>
          </div>

          <div className='mx-auto max-w-6xl px-6 lg:px-8'>
            <div className='relative flex flex-col items-center md:grid grid-cols-2 gap-40'>
              <div className='relative h-80 md:h-full w-full md:justify-self-end max-w-sm rounded-xl bg-muted ring-inset ring-accent/20 lg:rounded-2xl'>
                <img
                  src='/horse.jpg'
                  className='rounded-md object-cover bg-card shadow-2xl ring-1 ring-accent/30 h-full w-full'
                />
              </div>

              <Phone className='w-60' imgSrc='/horse_phone.jpg' />
            </div>
          </div>

          <ul className='mx-auto mt-12 max-w-prose sm:text-lg space-y-2 w-fit'>
            <li className='w-fit'>
              <Check className='h-5 w-5 text-accent inline mr-1.5' />
              Premium silicone & polycarbonate options
            </li>
            <li className='w-fit'>
              <Check className='h-5 w-5 text-accent inline mr-1.5' />
              Scratch and fingerprint resistant
            </li>
            <li className='w-fit'>
              <Check className='h-5 w-5 text-accent inline mr-1.5' />
              Wireless charging compatible
            </li>
            <li className='w-fit'>
              <Check className='h-5 w-5 text-accent inline mr-1.5' />
              5-year print warranty
            </li>

            <div className='flex justify-center'>
              <Link
                className={buttonVariants({
                  size: 'lg',
                  className: 'mx-auto mt-8 gap-2',
                })}
                href='/templates'>
                Start Creating <ArrowRight className='h-4 w-4' />
              </Link>
            </div>
          </ul>
        </MaxWidthWrapper>
      </section>
    </div>
  )
}
