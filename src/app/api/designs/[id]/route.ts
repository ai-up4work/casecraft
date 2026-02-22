import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const designId = params.id

    if (!designId) {
      return NextResponse.json(
        { error: 'Design ID required' },
        { status: 400 }
      )
    }

    // In production, delete from Supabase
    // const { error } = await supabase
    //   .from('designs')
    //   .delete()
    //   .eq('id', designId)

    return NextResponse.json(
      { success: true, message: 'Design deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting design:', error)
    return NextResponse.json(
      { error: 'Failed to delete design' },
      { status: 500 }
    )
  }
}
