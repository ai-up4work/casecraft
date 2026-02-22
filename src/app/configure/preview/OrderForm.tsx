'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SavedDesign } from '@/lib/supabase'
import { COLORS, MODELS, MATERIALS, FINISHES } from '@/validators/option-validator'
import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products'
import { orderService } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, MessageCircle, Package, Smartphone, Palette } from 'lucide-react'

const WHATSAPP_NUMBER = '94755354830' // +94755354830

interface OrderFormProps {
  configuration: SavedDesign
}

function getPrice(configuration: SavedDesign) {
  let price = BASE_PRICE
  if (configuration.case_finish === 'textured') price += PRODUCT_PRICES.finish.textured
  if (configuration.case_material === 'polycarbonate') price += PRODUCT_PRICES.material.polycarbonate
  return price
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

const OrderForm = ({ configuration }: OrderFormProps) => {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    state: '',
  })

  const price = getPrice(configuration)

  const modelLabel = MODELS.options.find((m) => m.value === configuration.phone_model)?.label ?? configuration.phone_model
  const colorLabel = COLORS.find((c) => c.value === configuration.case_color)?.label ?? configuration.case_color
  const materialLabel = MATERIALS.options.find((m) => m.value === configuration.case_material)?.label ?? configuration.case_material
  const finishLabel = FINISHES.options.find((f) => f.value === configuration.case_finish)?.label ?? configuration.case_finish

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!form.name || !form.phone || !form.address || !form.city || !form.country) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      // 1. Save order to Supabase
      const order = await orderService.createOrder({
        email: form.email,
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postal_code: form.postalCode,
        country: form.country,
        state: form.state,
        design_id: configuration.id,
        template_id: configuration.template_id,
        order_details: JSON.stringify({
          model: configuration.phone_model,
          color: configuration.case_color,
          material: configuration.case_material,
          finish: configuration.case_finish,
          amount: price / 100,
          imageUrl: configuration.image_url,
          croppedImageUrl: configuration.cropped_image_url,
        }),
      })

      // 2. Build WhatsApp message
      const message = [
        `🛍️ *New CaseCraft Order* — #${order.id.slice(0, 8).toUpperCase()}`,
        ``,
        `👤 *Customer Details*`,
        `• Name: ${form.name}`,
        `• Email: ${form.email}`,
        `• Phone: ${form.phone}`,
        ``,
        `📦 *Shipping Address*`,
        `• ${form.address}`,
        `• ${form.city}${form.state ? `, ${form.state}` : ''} ${form.postalCode}`,
        `• ${form.country}`,
        ``,
        `📱 *Case Details*`,
        `• Model: ${modelLabel}`,
        `• Color: ${colorLabel}`,
        `• Material: ${materialLabel}`,
        `• Finish: ${finishLabel}`,
        ``,
        `💰 *Total: ${formatPrice(price)}*`,
        ``,
        `🖼️ *Design Image*`,
        configuration.cropped_image_url ?? configuration.image_url,
      ].join('\n')

      // 3. Open WhatsApp
      const encoded = encodeURIComponent(message)
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')

      // 4. Redirect to thank you
      router.push(`/thank-you?orderId=${order.id}`)
    } catch (err) {
      toast({
        title: 'Something went wrong',
        description: 'Could not place your order. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='max-w-2xl mx-auto px-4 py-12'>
      {/* Order Summary */}
      <div className='mb-8 rounded-2xl border border-border bg-card p-6 space-y-4'>
        <h2 className='text-lg font-semibold flex items-center gap-2'>
          <Package className='h-5 w-5 text-accent' />
          Order Summary
        </h2>
        <div className='grid grid-cols-2 gap-3 text-sm'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Smartphone className='h-4 w-4' /> Model
          </div>
          <span className='font-medium'>{modelLabel}</span>

          <div className='flex items-center gap-2 text-muted-foreground'>
            <Palette className='h-4 w-4' /> Color
          </div>
          <span className='font-medium capitalize'>{colorLabel}</span>

          <div className='text-muted-foreground'>Material</div>
          <span className='font-medium capitalize'>{materialLabel}</span>

          <div className='text-muted-foreground'>Finish</div>
          <span className='font-medium capitalize'>{finishLabel}</span>

          <div className='text-muted-foreground font-semibold'>Total</div>
          <span className='font-bold text-accent'>{formatPrice(price)}</span>
        </div>
      </div>

      {/* Order Form */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-bold'>Your Details</h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='name'>Full Name *</Label>
            <Input id='name' name='name' placeholder='John Doe' value={form.name} onChange={handleChange} />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' type='email' placeholder='john@example.com' value={form.email} onChange={handleChange} />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='phone'>Phone Number *</Label>
            <Input id='phone' name='phone' placeholder='+1 234 567 8900' value={form.phone} onChange={handleChange} />
          </div>
          <div className='space-y-1.5 sm:col-span-2'>
            <Label htmlFor='address'>Street Address *</Label>
            <Input id='address' name='address' placeholder='123 Main St' value={form.address} onChange={handleChange} />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='city'>City *</Label>
            <Input id='city' name='city' placeholder='New York' value={form.city} onChange={handleChange} />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='state'>State / Province</Label>
            <Input id='state' name='state' placeholder='NY' value={form.state} onChange={handleChange} />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='postalCode'>Postal Code</Label>
            <Input id='postalCode' name='postalCode' placeholder='10001' value={form.postalCode} onChange={handleChange} />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='country'>Country *</Label>
            <Input id='country' name='country' placeholder='United States' value={form.country} onChange={handleChange} />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          size='lg'
          className='w-full gap-2 bg-green-600 hover:bg-green-700 text-white'>
          {isLoading ? (
            <Loader2 className='h-5 w-5 animate-spin' />
          ) : (
            <MessageCircle className='h-5 w-5' />
          )}
          {isLoading ? 'Placing Order...' : 'Place Order via WhatsApp'}
        </Button>

        <p className='text-xs text-center text-muted-foreground'>
          Clicking the button will save your order and open WhatsApp with your order details pre-filled.
        </p>
      </div>
    </div>
  )
}

export default OrderForm