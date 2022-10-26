const Notification = ({message, error}) => {
  const good ={
    color: "green",
    borderRadius: "4px",
  }

  const bad ={
    color: "red",
    borderRadius: "4px",
  }

  if(error === true) {return (
    <p style={bad}>{message}</p>
  )}
  return (
    <p style={good}>{message}</p>
  )
}

export default Notification