// DNS CONFIG
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// MONGOOSE CONFIG AND DB CONNECTION
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
mongoose.connect(url, {family: 4})
  .then(result => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.log('Failed connnection to MongoDB:', error.message);
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator(v) {
        return /^\d{2,3}-\d+$/.test(v);
      }
    },
    required: true,
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

const Person = mongoose.model('Person', personSchema);

module.exports = Person;