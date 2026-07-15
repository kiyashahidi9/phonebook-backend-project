// DNS config
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4'])

const mongoose = require('mongoose');

const password = process.argv[2];
const url = `mongodb+srv://kiyashahidi9:${encodeURIComponent(password)}@cluster0.tj2em4c.mongodb.net/phonebookApp?appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url, {family: 4});

// DEFINING SCHEMA AND MODEL
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema);

// ADDING PERSON
if (process.argv.length === 5) {
  let person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  })
}

// PRINT ALL PERSONS
if (process.argv.length === 3) {
  console.log('phonebook:');

  Person
    .find({})
    .then(persons => {
      persons.forEach(person => {
        console.log(person.name, person.number);
      })
      mongoose.connection.close();
    })
}
