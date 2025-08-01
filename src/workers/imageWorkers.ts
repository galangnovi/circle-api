import { Worker } from 'bullmq'
import { connection } from '../queues/redis'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

new Worker('image-processing', async job => {
  const { imagePath } = job.data
  console.log('[Worker] Mulai proses:', imagePath)

  try {
    const ext = path.extname(imagePath)
    const outputPath = imagePath.replace(ext, `_compressed${ext}`)

    await sharp(imagePath)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toFile(outputPath)

    console.log('[Worker] Berhasil simpan ke:', outputPath)

    // Optional: Hapus original jika perlu
    // fs.unlinkSync(imagePath)
  } catch (err) {
    console.error('[Worker] Gagal proses image:', err)
  }
}, { connection })