import  express from "express";

const app = express()
const PORT =3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.listen(PORT, () => {
    console.log(`🍄 server berjalan di http://localhost:${PORT}`)
})