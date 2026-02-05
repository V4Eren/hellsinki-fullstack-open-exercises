const Part = ({part}) => {
  return (
    <p>{part.name} {part.exercises}</p>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map((part) => <Part key={part.id} part={part}/>)}
    </div>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <h1>{course.name}</h1>
      <Content parts={course.parts}/>
      <p>total of {course.parts.reduce((sum, curr) => sum + curr.exercises, 0)} exercises</p>
    </div>
  );
}

export default Course;