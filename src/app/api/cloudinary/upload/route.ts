// app/api/cloudinary/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Folder structure in Cloudinary:
 *
 
 * caseCraft/
 *     └── {configId}/           ← one folder per job/config
 *         ├── original          ← raw user uploaded image
 *         ├── configuration     ← final cropped/positioned image
 *         └── preview           ← preview render (future use)
 */

type UploadType = 'original' | 'configuration' | 'preview'

function getUploadPath(configId: string, type: UploadType) {
  return {
    folder: `caseCraft/${configId}`,
    public_id: type, // becomes caseCraft/{configId}/original etc.
  }
}

// ─── POST: Upload ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const configId = formData.get('configId') as string
    const type = (formData.get('type') as UploadType) ?? 'configuration'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!configId) {
      return NextResponse.json({ error: 'configId is required' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { folder, public_id } = getUploadPath(configId, type)

    const result = await new Promise<{
      secure_url: string
      public_id: string
      folder: string
    }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          public_id,
          overwrite: true,
          resource_type: 'image',
          tags: ['caseCraft', type, configId],
        },
        (error, result) => {
          if (error || !result) reject(error ?? new Error('Upload failed'))
          else
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              folder: result.folder ?? folder,
            })
        }
      ).end(buffer)
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[Cloudinary] Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// ─── GET: Retrieve ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const configId = searchParams.get('configId')
    const type = (searchParams.get('type') as UploadType) ?? 'configuration'

    if (!configId) {
      return NextResponse.json({ error: 'configId is required' }, { status: 400 })
    }

    const { folder, public_id } = getUploadPath(configId, type)

    // Full public_id includes the folder path
    const fullPublicId = `${folder}/${public_id}`

    const result = await cloudinary.api.resource(fullPublicId, {
      resource_type: 'image',
    })

    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      folder: result.folder,
    })
  } catch (error) {
    console.error('[Cloudinary] Retrieve error:', error)
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  }
}