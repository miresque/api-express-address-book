const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
let contacts = require("./data/contacts.js")

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
        "contacts": contacts
    })
})

// get specific contact with '/contacts/:id'
app.get("/contacts/:id", (req, res) => {
    const reqID = req.params.id
    console.log(`got request for '/contacts/${reqID}'`)
    const contact = contacts.find(person => Number(person.id) === Number(reqID))
    res.send({
        "contact": contact
    })
})

// post new contact
app.post("/contacts", (req, res) => {
    const newContactInfo = req.body;
    const newContact = {
        "id": contacts.length + 1,
        ...newContactInfo,
        "meetings": []
    }
    contacts.push(newContact)
    res.send({
        "contact": newContact
    })
})

// delete contact via id
app.delete("/contacts/:id", (req, res) => {
    const reqID = req.params.id
    const newContacts = contacts.filter(contact => Number(contact.id) !== Number(reqID))
    contacts = newContacts
    res.status(200).send('OK');
})

// put, update contact via id
app.put("/contacts/:id", (req, res) => {
    const reqID = req.params.id
    const newContactInfo = req.body
    const contact = contacts.find(person => Number(person.id) === Number(reqID))
    const updatedContact = {
        "id": Number(contact.id),
        ...newContactInfo
    }
    contacts = contacts.map(person => {
        if (person === contact) {
           return (updatedContact)
        } else return (person)
    })
    res.send({
        "contact": updatedContact
    })
})

// booting up server:
const port = 3030
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`)
})
