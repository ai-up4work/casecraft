'use client'

import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload'
import { cn } from '@/lib/utils'
import { Image, Loader2, MousePointerSquareDashed } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import Dropzone, { FileRejection } from 'react-dropzone'
import { createConfiguration } from '@/actions/upload-action'

const Page = () => {
  const { toast } = useToast()
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template') || 'minimalist-white'
  const [isPending, startTransition] = useTransition()

  const { startUpload, isUploading } = useCloudinaryUpload()

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles
    setIsDragOver(false)
    toast({
      title: `${file.file.type} type is not supported.`,
      description: 'Please choose a PNG, JPG, or JPEG image instead.',
      variant: 'destructive',
    })
  }

  const onDropAccepted = async (acceptedFiles: File[]) => {
    setIsDragOver(false)

    try {
      const file = acceptedFiles[0]

      // 1. Get image dimensions from the file
      const dimensions = await getImageDimensions(file)

      // 2. Use a temp ID for the Cloudinary folder before we have a real configId
      //    We'll use a timestamp-based temp ID, then update after DB creation
      const tempId = `temp_${Date.now()}`

      // Simulate progress
      setUploadProgress(0)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) { clearInterval(progressInterval); return prev }
          return prev + 10
        })
      }, 200)

      // 3. Upload to Cloudinary → caseCraft/{tempId}/original
      const [uploaded] = await startUpload([file], {
        configId: tempId,
        type: 'original',
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      // 4. Create Design record in DB with the Cloudinary URL
      const { configId } = await createConfiguration({
        email: '', // replace with session user email e.g. session?.user?.email
        templateId,
        width: dimensions.width,
        height: dimensions.height,
        imageUrl: uploaded.secure_url,
      })

      // 5. Redirect to design page
      startTransition(() => {
        router.push(`/configure/design?id=${configId}&template=${templateId}`)
      })
    } catch {
      toast({
        title: 'Upload failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div
      className={cn(
        'relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center',
        { 'ring-blue-900/25 bg-blue-900/10': isDragOver }
      )}>
      <div className='relative flex flex-1 flex-col items-center justify-center w-full'>
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg'],
            'image/jpg': ['.jpg'],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}>
          {({ getRootProps, getInputProps }) => (
            <div
              className='h-full w-full flex-1 flex flex-col items-center justify-center'
              {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashed className='h-6 w-6 text-zinc-500 mb-2' />
              ) : isUploading || isPending ? (
                <Loader2 className='animate-spin h-6 w-6 text-zinc-500 mb-2' />
              ) : (
                <Image className='h-6 w-6 text-zinc-500 mb-2' />
              )}
              <div className='flex flex-col justify-center mb-2 text-sm text-zinc-700'>
                {isUploading ? (
                  <div className='flex flex-col items-center'>
                    <p>Uploading...</p>
                    <Progress value={uploadProgress} className='mt-2 w-40 h-2 bg-gray-300' />
                  </div>
                ) : isPending ? (
                  <div className='flex flex-col items-center'>
                    <p>Redirecting, please wait...</p>
                  </div>
                ) : isDragOver ? (
                  <p><span className='font-semibold'>Drop file</span> to upload</p>
                ) : (
                  <p><span className='font-semibold'>Click to upload</span> or drag and drop</p>
                )}
              </div>
              {isPending ? null : <p className='text-xs text-zinc-500'>PNG, JPG, JPEG</p>}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  )
}

// ─── Helper: get image dimensions from a File ────────────────────────────────
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export default Page