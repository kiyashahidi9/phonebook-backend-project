const express = require('express');
const app = express();

app.use(express.json());

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
  let count = persons.length;
  let time = new Date();

  response.send(`<p>Phonebook has info for ${count} people</p><p>${time}</p>`)
})

// GET PERSON(S) ROUTES
app.get('/api/persons', (request, response) => {
  response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
  let id = request.params.id;
  let person = persons.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else {
    return response.status(404).json({error: 'not found'});
  }
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

  let person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person);
  response.json(person);
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})