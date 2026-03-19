import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  
  const [persons, setPersons] = useState([])

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("Response fulfilled");
      setPersons(response.data);
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
    
    const isNameAdded = persons.some((person) => person.name == newName);
    if(isNameAdded) {
      alert(`${newName} is already added to phonebook`);
      setNewName('');
      return;
    }

    const personObject = {
      id: persons.length + 1,
      name: newName,
      number: newNumber,
      
    }

    setPersons(persons.concat(personObject));
    setNewName('');
    setNewNumber('');
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
      <Persons filteredPersons={filteredPersons}/>
    </div>
  )
}

export default App
