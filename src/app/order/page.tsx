'use client'

import { useState } from 'react'
import Link from 'next/link'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { MessageCircle, Mail, ArrowLeft } from 'lucide-react'

interface OrderFormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

export default function OrderPage() {
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  })

  const [errors, setErrors] = useState<Partial<OrderFormData>>({})

  const validateForm = () => {
    const newErrors: Partial<OrderFormData> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required'
    if (!formData.country.trim()) newErrors.country = 'Country is required'
    return newErrors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof OrderFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const generateWhatsAppMessage = () => {
    const message = `Hi! I'd like to place an order for a custom phone case.\n\nCustomer Details:\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nShipping Address:\n${formData.address}\n${formData.city}, ${formData.postalCode}\n${formData.country}\n\nPlease confirm pricing and delivery timeline. Thank you!`
    return encodeURIComponent(message)
  }

  const handleWhatsAppSubmit = () => {
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890'
    const message = generateWhatsAppMessage()
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  const handleEmailSubmit = () => {
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const emailAddress = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'orders@casecraft.com'
    const subject = encodeURIComponent('New Custom Phone Case Order')
    const body = encodeURIComponent(
      `Hi,\n\nI would like to order a custom phone case.\n\nCustomer Information:\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nShipping Address:\n${formData.address}\n${formData.city}, ${formData.postalCode}\n${formData.country}\n\nPlease confirm pricing and delivery timeline.\n\nThank you!`
    )
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`
  }

  return (
    <div className='bg-background/50 min-h-screen py-16'>
      <MaxWidthWrapper className='max-w-3xl'>
        {/* Header */}
        <div className='mb-12'>
          <Link
            href='/templates'
            className='inline-flex items-center gap-2 text-accent hover:text-accent/80 mb-6'>
            <ArrowLeft className='h-4 w-4' />
            Back to Templates
          </Link>
          <h1 className='text-balance font-bold text-5xl md:text-6xl mb-4'>
            Complete Your Order
          </h1>
          <p className='text-lg text-muted-foreground'>
            Share your details below. We'll connect with you via WhatsApp or Email to confirm pricing and discuss your custom design.
          </p>
        </div>

        {/* Form Card */}
        <Card className='p-8 mb-8'>
          <form className='space-y-6'>
            {/* Personal Information Section */}
            <div>
              <h2 className='text-lg font-semibold mb-4'>Personal Information</h2>
              <div className='space-y-4'>
                {/* Name */}
                <div className='space-y-2'>
                  <Label htmlFor='name' className='font-medium'>
                    Full Name *
                  </Label>
                  <Input
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='John Doe'
                    className='h-11'
                  />
                  {errors.name && (
                    <p className='text-sm text-destructive'>{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className='space-y-2'>
                  <Label htmlFor='email' className='font-medium'>
                    Email Address *
                  </Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='john@example.com'
                    className='h-11'
                  />
                  {errors.email && (
                    <p className='text-sm text-destructive'>{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className='space-y-2'>
                  <Label htmlFor='phone' className='font-medium'>
                    Phone Number *
                  </Label>
                  <Input
                    id='phone'
                    name='phone'
                    type='tel'
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder='+1 (555) 123-4567'
                    className='h-11'
                  />
                  {errors.phone && (
                    <p className='text-sm text-destructive'>{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className='pt-6 border-t'>
              <h2 className='text-lg font-semibold mb-4'>Shipping Address</h2>
              <div className='space-y-4'>
                {/* Address */}
                <div className='space-y-2'>
                  <Label htmlFor='address' className='font-medium'>
                    Street Address *
                  </Label>
                  <Input
                    id='address'
                    name='address'
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder='123 Main Street'
                    className='h-11'
                  />
                  {errors.address && (
                    <p className='text-sm text-destructive'>{errors.address}</p>
                  )}
                </div>

                {/* City, Postal Code */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='city' className='font-medium'>
                      City *
                    </Label>
                    <Input
                      id='city'
                      name='city'
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder='New York'
                      className='h-11'
                    />
                    {errors.city && (
                      <p className='text-sm text-destructive'>{errors.city}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='postalCode' className='font-medium'>
                      Postal Code *
                    </Label>
                    <Input
                      id='postalCode'
                      name='postalCode'
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder='10001'
                      className='h-11'
                    />
                    {errors.postalCode && (
                      <p className='text-sm text-destructive'>{errors.postalCode}</p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div className='space-y-2'>
                  <Label htmlFor='country' className='font-medium'>
                    Country *
                  </Label>
                  <Input
                    id='country'
                    name='country'
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder='United States'
                    className='h-11'
                  />
                  {errors.country && (
                    <p className='text-sm text-destructive'>{errors.country}</p>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Action Buttons */}
          <div className='mt-10 space-y-3'>
            <Button
              onClick={handleWhatsAppSubmit}
              className='w-full h-12 gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold'>
              <MessageCircle className='h-5 w-5' />
              Order via WhatsApp
            </Button>

            <Button
              onClick={handleEmailSubmit}
              variant='outline'
              className='w-full h-12 gap-2 font-semibold'>
              <Mail className='h-5 w-5' />
              Order via Email
            </Button>

            <Link
              href='/templates'
              className={buttonVariants({
                variant: 'ghost',
                className: 'w-full',
              })}>
              Cancel
            </Link>
          </div>
        </Card>

        {/* Info Box */}
        <Card className='p-6 bg-accent/5 border-accent/30'>
          <h3 className='font-semibold mb-2'>What Happens Next?</h3>
          <p className='text-sm text-muted-foreground'>
            After you contact us, our team will respond within 24 hours to confirm your order, discuss pricing, customize your design, and arrange delivery. We're here to make your perfect case!
          </p>
        </Card>
      </MaxWidthWrapper>
    </div>
  )
}
