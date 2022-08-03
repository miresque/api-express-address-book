const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const contacts = require("./data/contacts.js")

const app = express()

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())

// get for '/' route
app.get("/", (req, res) => {
    console.log("got request for '/'")
    res.send("Hello World")
})

// get for '/contacts'
app.get("/contacts", (req, res) => {
    console.log("got request for '/contacts'")
    res.send({
        contacts: contacts
    })
})

// get specific contact with '/contacts/:id'
app.get("/contacts/:id", (req, res) => {
    const reqID = req.params.id
    console.log(`got request for '/contacts/${reqID}'`)
    const contact = contacts.filter(contact => Number(contact.id) === Number(reqID))
    res.send(contact)
})

// booting up server:
const port = 3030
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`)
})
