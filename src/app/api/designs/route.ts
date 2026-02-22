import { NextRequest, NextResponse } from 'next/server'

// Mock data store for now - in production use Supabase
const designsStore: any[] = []

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      )
    }

    // In production, query from Supabase
    // const { data, error } = await supabase
    //   .from('designs')
    //   .select('*')
    //   .eq('email', email)
    //   .order('created_at', { ascending: false })

    const userDesigns = designsStore.filter((d) => d.email === email)

    return NextResponse.json(userDesigns)
  } catch (error) {
    console.error('Error fetching designs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch designs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, templateId, designName, imageUrl, croppedImageUrl, phoneModel, caseColor, caseMaterial, caseFinish, width, height } = body

    if (!email || !templateId || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, save to Supabase
    // const { data, error } = await supabase
    //   .from('designs')
    //   .insert([{ email, template_id: templateId, ... }])
    //   .select()

    const newDesign = {
      id: `design_${Date.now()}`,
      email,
      template_id: templateId,
      design_name: designName || 'My Case Design',
      image_url: imageUrl,
      cropped_image_url: croppedImageUrl,
      phone_model: phoneModel,
      case_color: caseColor,
      case_material: caseMaterial,
      case_finish: caseFinish,
      width,
      height,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    designsStore.push(newDesign)

    return NextResponse.json(newDesign, { status: 201 })
  } catch (error) {
    console.error('Error saving design:', error)
    return NextResponse.json(
      { error: 'Failed to save design' },
      { status: 500 }
    )
  }
}
