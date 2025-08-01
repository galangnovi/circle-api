import { Queue } from 'bullmq'
import { connection } from './redis'

export const imageQueue = new Queue('image-processing', { connection })

export const addImageJob = async (imagePath: string) => {
  await imageQueue.add('process', { imagePath })
}