const mongoose = require('mongoose');

// Komentoriviparametrit
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

// Tarkista, että salasana on annettu
if (!password) {
  console.log('Anna salasana komentoriviparametrina: node mongo.js <password>');
  process.exit(1);
}

// Yhteys URI (korvaa <db_password> omalla salasanallasi)
const uri = `mongodb+srv://fullstack:${password}@cluster0.q0iag.mongodb.net/phonebook?retryWrites=true&w=majority`;

// Yhdistä MongoDB:hen Mongoosea käyttäen
mongoose
  .connect(uri)
  .then(() => {
    console.log('Yhdistetty MongoDB-tietokantaan');
  })
  .catch((error) => {
    console.error('Virhe yhdistettäessä MongoDB:hen:', error.message);
    process.exit(1);
  });

// Määrittele Mongoose-malli
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// Jos nimi ja numero on annettu, lisää uusi henkilö
if (name && number) {
  const person = new Person({
    name: name,
    number: number,
  });

  person
    .save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.error('Virhe tallennettaessa tietokantaan:', error.message);
      mongoose.connection.close();
    });
} else {
  // Jos vain salasana on annettu, listaa kaikki henkilöt
  Person.find({})
    .then((result) => {
      console.log('phonebook:');
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    })
    .catch((error) => {
      console.error('Virhe haettaessa tietoja tietokannasta:', error.message);
      mongoose.connection.close();
    });
}
