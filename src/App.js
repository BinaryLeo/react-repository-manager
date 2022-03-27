import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
function App() {
  const [list, setList] = useState([])
  const [user, setUser] = useState('binaryleo') // data from gituser
  const icons = {
    concluded: '📁',
    underDevelopment: '📌',
  }
  const [BtnText, setBtnText] = useState('Concluded')
  let textInput = React.createRef() // Add a reference to the input element
  function handleChange(e) {
    setUser(textInput.current.value) // set the value of the input to the state
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`https://api.github.com/users/${user}/repos`) //fetch the data from the api using the user
      const data = await response.json() // return data in json format
      setList(data) // set the data to the state - data is an array of objects
    }
    fetchData()
  }, [user]) // [] means that this effect will only run once - an initial render

  useEffect(() => {
    const filtered = list.filter((list) => list.underManagement) // filter out the favorite repos
    document.title = ` ${user} - ${icons.underDevelopment} Repos: ${filtered.length}` // this is a side effect
  }, [icons.underDevelopment, user, list]) // this effect will run every time the list changes

  function handleRepo(id) {
    const UnderDevelopment = list.map((list) => {
      return list.id === id
        ? { ...list, underManagement: !list.underManagement }
        : list

      //change icon when clicking on repo

      // run through the repos and return the repo with the same id as the id passed in
      // if the id matches, add a favorite property to the repo as true
    })
    setList(UnderDevelopment)
  }
  return (
    <>
      <Container>
        <input
          ref={textInput}
          type="text"
          placeholder="Type your Github User"
        />
        <SearchBtn onClick={() => handleChange()}>Search</SearchBtn>
      </Container>
      <Scrollable>
        <ul>
          {list.map((list) => {
            return (
              <LI key={list.id}>
                <p>
                  <Button onClick={() => handleRepo(list.id)}>{BtnText}</Button>

                  {list.underManagement ? (
                    <span> ${icons.underDevelopment} </span>
                  ) : (
                    <span> ${icons.concluded} </span>
                  )}
                  <A href={list.html_url}>{list.name}</A>
                  <Span> - {list.description}</Span>
                </p>
              </LI>
            )
          })}
        </ul>
      </Scrollable>
    </>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  position: fixed;
  top: 0;
  background-color: #0d1117;
  border-bottom: 1px solid #282a36;
`
const SearchBtn = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid #18f8d7;
  color: #18f8d7;
  margin: 0 1em;
  padding: 0.25em 1em;
  cursor: pointer;
`
const Scrollable = styled.div`
  margin-top: 120px;
  overflow-y: scroll;
`

const Button = styled.button`
  // styled components are used to style the button
  background: transparent;
  border-radius: 3px;
  border: 2px solid #18f8d7;
  color: #18f8d7;
  margin: 0 1em;
  padding: 0.25em 1em;
`
const LI = styled.li`
  // styled components are used to style the list items
  list-style: none;
  margin: 0.8em 2em 0.5em -0.5em;
  border: 1px solid #fff;
  text-transform: lowercase;
`
const A = styled.a`
  text-decoration: none;
  color: #fff;
`

const Span = styled.span`
  color: #18f8d7;
  font-size: 0.8em;
  margin-left: 0.5em;
`
export default App
