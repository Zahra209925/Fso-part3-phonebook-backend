import express from 'express';
import morgan from 'morgan';

const app = express();

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' },
];

// Middleware JSON-datan käsittelyyn
app.use(express.json());

// Morganin käyttöönotto ja konfigurointi
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

// Reitti: Hae kaikki henkilöt
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// Reitti: Hae yksittäinen henkilö ID:n perusteella
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: 'Person not found' });
  }
});

// Reitti: Poista henkilö ID:n perusteella
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

// Reitti: Lisää uusi henkilö
app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  const nameExists = persons.some((p) => p.name === body.name);
  if (nameExists) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number,
  };

  persons.push(newPerson);
  res.json(newPerson);
});

// Reitti: Näytä puhelinluettelon tiedot ja pyynnön tekohetki
app.get('/info', (req, res) => {
  const date = new Date();
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `);
});

// Palvelimen käynnistys
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});