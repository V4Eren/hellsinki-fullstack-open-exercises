import { useState, useEffect } from 'react'
import './index.css'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  
  const [persons, setPersons] = useState([])
  const [notification, setNotification] = useState('')

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      console.log("Response fulfilled");
      setPersons(initialPersons);
    }).catch(() => {
      setNotification({
        type: "error",
        text: "Failed to fetch person"
      })
    })
  }, []);

  useEffect(() => {
    if(notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

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
          setNewName('');
          setNewNumber('');
          setNotification({
            type:"success",
            text:`${newName} is updated.`
          })
        }).catch((error) => {
          if(error.response?.status === 404) {
            setPersons((prevPersons) => prevPersons.filter((person) => person.id !== isNameAdded.id));
            setNotification({
              type: "error",
              text: `Information of ${newName} has already been removed from server.`
            })
          } else {
            setNotification({
              type: "error",
              text: error.response?.data?.error || "unknown error",

            })
          }
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
      setNotification({
        type: "success",
        text:`${newName} has been succesfully added.`
      })
    })
  }

  const handleRemove = (id, name) => {
    if(window.confirm(`Delete ${name}`)) {
      personService.remove(id).then(() => {
        setPersons((prevPersons) => prevPersons.filter((person) => person.id !== id))
        setNotification({
          type:"success",
          text:`${name} is deleted.`
        })
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification}/>
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
