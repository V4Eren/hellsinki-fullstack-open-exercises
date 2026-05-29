const Persons = ({filteredPersons, handleRemove}) => {    
    return (
        <div>
            {filteredPersons.map((person) => (
                <p key={person.id}>
                    {person.name} {person.number}
                    <button onClick={() => handleRemove(person.id, person.name)}>Delete</button>
                </p>
            ))}
        </div>
    )
}

export default Persons;