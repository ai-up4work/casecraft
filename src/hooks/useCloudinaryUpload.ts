// lib/useCloudinaryUpload.ts
import { useState } from 'react'

type UploadType = 'original' | 'configuration' | 'preview'

interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  folder: string
}

interface UploadMetadata {
  configId: string
  type?: UploadType
}

interface UseCloudinaryUploadReturn {
  startUpload: (files: File[], metadata: UploadMetadata) => Promise<CloudinaryUploadResult[]>
  isUploading: boolean
  error: string | null
}

export function useCloudinaryUpload(): UseCloudinaryUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startUpload = async (
    files: File[],
    metadata: UploadMetadata
  ): Promise<CloudinaryUploadResult[]> => {
    setIsUploading(true)
    setError(null)

    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('configId', metadata.configId)
          formData.append('type', metadata.type ?? 'configuration')

          const response = await fetch('/api/cloudinary/upload', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Upload failed')
          }

          return response.json() as Promise<CloudinaryUploadResult>
        })
      )

      return results
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setError(message)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  return { startUpload, isUploading, error }
}

// ─── Helper: Retrieve image URL for a config ────────────────────────────────

export async function getCloudinaryUrl(
  configId: string,
  type: UploadType = 'configuration'
): Promise<string | null> {
  try {
    const res = await fetch(
      `/api/cloudinary/upload?configId=${configId}&type=${type}`
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.secure_url ?? null
  } catch {
    return null
  }
}