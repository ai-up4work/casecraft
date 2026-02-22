'use server'

import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products'
import { designService, orderService } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export const createCheckoutSession = async ({
  configId,
}: {
  configId: string
}) => {
  const configuration = await designService.getDesignById(configId).catch(() => null)

  if (!configuration) {
    throw new Error('No such configuration found')
  }

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) {
    throw new Error('You need to be logged in')
  }

  const { case_finish, case_material, image_url } = configuration

  let price = BASE_PRICE
  if (case_finish === 'textured') price += PRODUCT_PRICES.finish.textured
  if (case_material === 'polycarbonate') price += PRODUCT_PRICES.material.polycarbonate

  // Check for existing order
  const existingOrders = await orderService.getUserOrders(user.email ?? '')
  const existingOrder = existingOrders.find((o) => o.design_id === configId)

  let orderId: string

  if (existingOrder) {
    orderId = existingOrder.id
  } else {
    const newOrder = await orderService.createOrder({
      email: user.email ?? '',
      name: `${user.given_name ?? ''} ${user.family_name ?? ''}`.trim(),
      phone: '',
      address: '',
      city: '',
      postal_code: '',
      country: '',
      design_id: configId,
      template_id: configuration.template_id,
      order_details: JSON.stringify({
        amount: price / 100,
        color: configuration.case_color,
        finish: configuration.case_finish,
        material: configuration.case_material,
        model: configuration.phone_model,
      }),
    })
    orderId = newOrder.id
  }

  const product = await stripe.products.create({
    name: 'Custom iPhone Case',
    images: [image_url],
    default_price_data: {
      currency: 'USD',
      unit_amount: price,
    },
  })

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${orderId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configId}`,
    payment_method_types: ['card', 'paypal'],
    mode: 'payment',
    shipping_address_collection: { allowed_countries: ['DE', 'US'] },
    metadata: {
      userId: user.id,
      orderId,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  })

  return { url: stripeSession.url }
}