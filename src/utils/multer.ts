import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination: "src/uploads",
    filename: (req, file, cb) =>{
        cb(null, `${Date.now()}-${file.originalname}` )
    }
})

export const upload = multer({
    storage,
    limits: {
       fileSize: 5*1024*1024
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== ".jpg" && ext !== ".png" && ext !==".jpeg" && ext !== ".JPG" && ext !== ".PNG" && ext !==".JPEG") {
            return cb(new Error("Format file tidak didukung (hanya .jpg, .jpeg, .png)"))
        }
        cb(null,true)
    }
})