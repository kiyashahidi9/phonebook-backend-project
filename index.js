require('dotenv').config();
const express = require('express');
// importing DB
const Person = require('./models/person');

const app = express();

app.use(express.json());
app.use(express.static('dist'));

// DATA
let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// HELPERS
function generateId() {
  if (persons.length === 0) return 1;

  let maxId = Math.max(...persons.map(p => Number(p.id)));
  return String(maxId + 1);
}

// INFO
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people` +
      `<p>${new Date()}</p>`
    )
  })
})

// GET PERSON(S) ROUTES
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  })
})

app.get('/api/persons/:id', (request, response) => {
  let id = request.params.id;
  Person.findById(id)
    .then(person => {
      response.json(person);
    })
    .catch(error => {
      return response.status(404).send(`Person not found: ${error.message}`)
    })
})

// DELETE PERSON ROUTES
app.delete('/api/persons/:id', (request, response) => {
  let id = request.params.id;
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
})

// POST PERSON ROUTES
app.post('/api/persons', (request, response) => {
  let body = request.body;

  /*
  let existingNames = persons.map(p => p.name);

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: "name and/or number is missing"
    })
  } else if (existingNames.includes(body.name)) {
    return response.status(404).json({
      error: "name must be unique"
    })
  }
  */

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: "name and/or number is missing"
    })
  }

  let person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(person => {
    response.json(person);
  })
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})