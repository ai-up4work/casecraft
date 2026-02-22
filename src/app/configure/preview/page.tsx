import { designService } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import DesignPreview from './DesignPreview'

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const Page = async ({ searchParams }: PageProps) => {
  const { id, croppedImageUrl } = searchParams

  if (!id || typeof id !== 'string') {
    return notFound()
  }

  const configuration = await designService.getDesignById(id).catch(() => null)

  if (!configuration) {
    return notFound()
  }

  // ✅ Use the URL from query param if Supabase doesn't have it yet
  // (happens when navigating immediately after upload before DB write completes)
  const resolvedCroppedImageUrl =
    (typeof croppedImageUrl === 'string' ? decodeURIComponent(croppedImageUrl) : null) ??
    configuration.cropped_image_url ??
    configuration.image_url

  return (
    <DesignPreview
      configuration={{
        ...configuration,
        cropped_image_url: resolvedCroppedImageUrl,
      }}
    />
  )
}

export default Page