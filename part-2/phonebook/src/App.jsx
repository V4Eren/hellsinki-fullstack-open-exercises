import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  
  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      console.log("Response fulfilled");
      setPersons(initialPersons);
    })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('') //filtering

  const filteredPersons = filter === '' ? persons : 
        persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()));
  
  const handleNameChange = (event) =>  setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFiltering = (event) => setFilter(event.target.value); 

  const addName = (event) => {
    event.preventDefault();
    
    const isNameAdded = persons.find((person) => person.name === newName);
    if(isNameAdded) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const newPerson = {
          name: newName,
          number: newNumber
        };
        personService.update(isNameAdded.id, newPerson).then((updatedPerson) => {
          setPersons((prevPersons) => prevPersons.map((person) => 
            person.id !== updatedPerson.id ? person : updatedPerson
          ))
        })        
      } else {
        setNewName('');
        setNewNumber('');
      }
      return;
    }

    const personObject = {
      //id: persons.length + 1,
      name: newName,
      number: newNumber,    
    }

    personService.create(personObject).then((createdPerson) => {
      setPersons(persons.concat(createdPerson));
      setNewName('');
      setNewNumber('');
    })
  }

  const handleRemove = (id, name) => {
    if(window.confirm(`Delete ${name}`)) {
      personService.remove(id).then(() => {
        setPersons((prevPersons) => prevPersons.filter((person) => person.id !== id))
        console.log("Element deleted...")
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFiltering={handleFiltering}/>
      
      <h2>add a new</h2>
      <PersonForm addName={addName} 
                  newName={newName}
                  handleNameChange={handleNameChange}
                  newNumber={newNumber}
                  handleNumberChange={handleNumberChange}
      />
                  
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} handleRemove={handleRemove}/>
    </div>
  )
}

export default App
