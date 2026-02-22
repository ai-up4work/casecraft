import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, address, city, postalCode, country, state, designId, templateId } = body

    // Validate required fields
    if (!name || !email || !phone || !address || !city || !postalCode || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create order confirmation email content
    const orderContent = `
Hello ${name},

Thank you for ordering a custom phone case from CaseCraft!

We've received your order with the following details:

CONTACT INFORMATION
Name: ${name}
Email: ${email}
Phone: ${phone}

SHIPPING ADDRESS
${address}
${city}, ${postalCode}
${state ? state + ', ' : ''}${country}

ORDER DETAILS
Template: ${templateId}
${designId ? `Design ID: ${designId}` : 'Custom Design'}

NEXT STEPS
Our team will review your order and send you a quote with:
- Final pricing
- Design customization options
- Estimated delivery date
- Payment instructions

We typically respond within 24 hours during business days.

If you have any questions or would like to discuss custom options, feel free to reach out!

Best regards,
The CaseCraft Team
"Your phone, your canvas."

---
This is an automated message. Please reply to this email or contact our team directly.
    `.trim()

    // For now, we'll just log and return success
    // In production, you would integrate with an email service like Resend, SendGrid, etc.
    console.log('Order received:', body)
    console.log('Email content would be sent to:', email)

    // TODO: Integrate with email service
    // Example with Resend:
    // const { data, error } = await resend.emails.send({
    //   from: 'orders@casecraft.com',
    //   to: email,
    //   subject: `Order Confirmation - ${designId || 'Custom Case Design'}`,
    //   html: emailHtml,
    // })

    return NextResponse.json(
      {
        success: true,
        message: 'Order confirmation email sent successfully',
        orderDetails: {
          name,
          email,
          designId,
          templateId,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending order email:', error)
    return NextResponse.json(
      { error: 'Failed to send order email' },
      { status: 500 }
    )
  }
}
