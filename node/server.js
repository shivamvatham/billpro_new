import express from 'express'

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 5001

app.get('/', (req, res) => {
    res.json({ shivam: 'hello i am shivam' })
})

app.post('/api/user', (req, res) => {
    console.log(req.body)
    res.json({})
})

app.use((req, res, next) => {
    res.status(404).json({ message: 'route not found' })
})


app.use((err, req, res, next) => {
    res.status(400).json({ message: 'route not found' })
})

app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`)
})