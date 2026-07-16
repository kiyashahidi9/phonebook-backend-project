// IMPORTS
require('dotenv').config();
const express = require('express');
const Person = require('./models/person');

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.static('dist'));

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

app.get('/api/persons/:id', (request, response, next) => {
  let id = request.params.id;

  Person.findById(id)
    .then(person => {
      if (!person) response.status(404).end()
      response.json(person);
    })
    .catch(error => next(error));
})

// DELETE PERSON ROUTES
app.delete('/api/persons/:id', (request, response, next) => {
  let id = request.params.id;
  
  Person.findByIdAndDelete(id).then(result => {
    response.status(204).end();
  })
  .catch(error => next(error));
})

// POST PERSON ROUTES
app.post('/api/persons', (request, response) => {
  let body = request.body;

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

// UPDATE NUMBER
app.patch('/api/persons/:id', (request, response, next) => {
  let body = request.body;
  let id = request.params.id;

  Person.findById(id).then(person => {
    if (!person) response.status(404).end();

    person.number = body.number;

    person.save().then(updatedPerson => {
      response.json(updatedPerson)
    })
  })
  .catch(error => next(error));
})

// ERROR MIDDLEWARE
function errorHandler(error, request, response, next) {
  console.log(error);

  if (error.name === 'CastError') {
    response.status(400).send({error: "malformatted id"})
  }

  next(error);
}

app.use(errorHandler)

// STARTING APP
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})