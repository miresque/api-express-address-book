const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
let contacts = require("./data/contacts.js")
let meetings = require("./data/meetings")

const app = express()

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())

// get for '/' route
app.get("/", (req, res) => {
    console.log("got request for '/'")
    res.send("Hello World")
})

/* Contacts */
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
        "contact": contact,
        "meetings": meetings.filter(m => m.contactId === Number(reqID))
    })
})

// post new contact
app.post("/contacts", (req, res) => {
    const newContactInfo = req.body;
    const newContact = {
        "id": contacts.length + 1,
        ...newContactInfo,
    }
    contacts.push(newContact)
    res.status(201).send({
        "contact": newContact,
        "meetings": []
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
    res.status(201).send({
        "contact": updatedContact,
        "meetings": meetings.filter(m => m.contactId === Number(reqID))
    })
})

/* Meetings */
// get meetings for '/contacts/:id/meetings'
app.get("/contacts/:id/meetings", (req, res) => {
    const reqID = req.params.id
    res.send({
        "meetings": meetings.filter(m => m.contactId === Number(reqID))
    })
})

// post new meeting for contact via :id
app.post("/contacts/:id/meetings", (req, res) => {
    const reqID = req.params.id
    const newMeetingStr = req.body
    console.log('new meeting', newMeetingStr)
    const newMeeting = {
        ...newMeetingStr,
        "contactId": Number(reqID),
        "id": meetings.length + 1
    }
    meetings.push(newMeeting)
    res.status(201).send({
        "meeting": newMeeting
    })
})

// put, update contact meeting via id
app.put("/contacts/:id/meetings/:meetingId", (req, res) => {
    const reqMeetingID = req.params.meetingId
    const newMeetingStr = req.body
    const meeting = meetings.find(m => Number(m.id) === Number(reqMeetingID))
    const updatedMeeting = {
        ...newMeetingStr,
        "contactId": Number(req.params.id),
        "id": meeting.id
    }
    meetings = meetings.map(m => {
        if (m === meeting) {
           return (updatedMeeting)
        } else return (m)
    })
    res.status(201).send({
        "meeting": updatedMeeting
    })
})

// booting up server:
const port = 3030
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`)
})
