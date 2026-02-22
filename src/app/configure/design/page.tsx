import { designService } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import DesignConfigurator from './DesignConfigurator'

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams

  if (!id || typeof id !== 'string') {
    return notFound()
  }

  const configuration = await designService.getDesignById(id).catch(() => null)

  if (!configuration) {
    return notFound()
  }

  const { image_url, width, height } = configuration

  return (
    <DesignConfigurator
      configId={configuration.id}
      imageDimensions={{ width, height }}
      imageUrl={image_url}
    />
  )
}

export default Page