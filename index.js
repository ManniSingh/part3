require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(express.static('build'))
//app.use(morgan('combined'))
//morgan('tiny')
morgan.token('content', (req, res) => {
  if (req.method === 'POST'){
    return(JSON.stringify(req.body))
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

/*
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
*/

const Contact = require('./models/contact')

/*
app.get('/info', (request, response) => {
    date = new Date()
    response.send(`<h1>the phonebook contains info for ${persons.length} people</h1>
                   <h1> ${new Date().toString()} </h1>`)
})
*/

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(per => {
    response.json(per)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Contact.findById(request.params.id).then(per => {
    response.json(per)
  })
})

//deletes first element in any case???
app.delete('/api/persons/:id', (request, response) => {
console.log(request.params.id)
Contact.deleteOne({'id':request.params.id}).then(res => console.log(res))
})

/*
const generateId = () => {
  let rand = Math.floor(Math.random()*10000)
  let exists = persons.filter(per=>per.id==rand)
  while (exists.length!=0){
    rand = Math.floor(Math.random()*10000)
    exists = persons.filter(per=>per.id==rand)
  }
  return rand
}
*/

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).json({ error: `${body.name}` })
  }

  const contact = new Contact({
    name:body.name,
    number:body.number
  })

  contact.save().then(savedper => {
    response.json(savedper)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//listener
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
