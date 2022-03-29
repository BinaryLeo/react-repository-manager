import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
function App() {
  const [list, setList] = useState([])//repositories.
  const [user, setUser] = useState() // Github username.
  //-------------------------------------------------------------------
  const icons = {
    concluded: '📁',
    underDevelopment: '📌', // when click  on button change to this icon.
  }
  //-------------------------------------------------------------------
  const repoNumber = list.filter((list) => list).length // number of repositories
  const pinnedRepo = list.filter((list) => list.underManagement).length // number of pinned repositories.
  //-------------------------------------------------------------------
  let textInput = React.createRef() // Add a reference to the input element.
  //-------------------------------------------------------------------
  function handleChange() {
    //if text input is empty, alert the user.
    if (textInput.current.value === '') {
      alert('Please enter a username')
    } else {
      setUser(textInput.current.value) // set the value of the input to the state.
    }
  }
  //-------------------------------------------------------------------
  useEffect(() => {
    async function fetchData() {
      try {
        if (localStorage.getItem('list')) {
          // load the list from local storage
          setList(JSON.parse(localStorage.getItem('list')));
          setUser(list[0].owner.login);//Get the user from the first item in the list.
        } else {
          const response = await fetch(
            `https://api.github.com/users/${user}/repos`, // fetch the repos of the user case the user is not empty.
          )
          const data = await response.json()
          setList(data)
          /* localStorage.setItem('list', JSON.stringify(data)) // save the data to local storage */
        }
      } catch (err) {
        console.log(err) // if there is an error, log it
      }
    }
    fetchData()
  }, [list, user]) // [] means that this effect will only run once - an initial render

  useEffect(() => {
    const filtered = list.filter((list) => list.underManagement) // filter out the favorite repos
    document.title = `${icons.underDevelopment}  Pinned Repos: ${filtered.length}` // this is a side effect
  }, [icons.underDevelopment, user, list]) // this effect will run every time the list changes
  function handleRemove() {
    //if theres data on local storage,  crete a pop up to ask if you want to delete the data if say yes delete it
    if (localStorage.getItem('list')) {
      if (window.confirm('Are you sure you want to delete the data?')) {
        localStorage.removeItem('list')
        setList([])
        window.location.reload()
      }
    } else {
      alert('There is no data to delete!')
    }
  }
  function handleRepo(id) {
    const UnderDevelopment = list.map((list) => {
      return list.id === id
        ? { ...list, underManagement: !list.underManagement }
        : list
      // run through the repos and return the repo with the same id as the id passed in
      // if the id matches, add a underManagement property to the repo as true
    })
    setList(UnderDevelopment)
    localStorage.setItem('list', JSON.stringify(UnderDevelopment)) // save the data to local storage on every click
    const datalist = localStorage.getItem('list') // get the data from local storage after every click
    console.log(datalist) // log the data to the console
  }
  return (
    <>
      <Container>
        <Input
          ref={textInput}
          type="text"
          placeholder="Type your Github User"
        />
        <SearchBtn onClick={() => handleChange()}>Search Repos</SearchBtn>
        <SearchBtn onClick={() => handleRemove()}>Remove User</SearchBtn>

        <UserTag>
          <Tag>
            {user} - Total: {repoNumber} Repositories and {pinnedRepo} pinned
            repositories Under development
          </Tag>
        </UserTag>
      </Container>

      <Scrollable>
        <ul>
          {list.map((list) => {
            return (
              <LI key={list.id}>
                <p>
                  <Button onClick={() => handleRepo(list.id)}>Pin it</Button>

                  {list.underManagement ? (
                    <span> {icons.underDevelopment} </span>
                  ) : (
                    <span> {icons.concluded} </span>
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
const Input = styled.input`
  margin-right: 1.25em;
`
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
const UserTag = styled.div`
  width: 100%;
  margin-top: 100px;
  position: fixed;
  background-color: #0d1117;
  color: #18f8d7;
  height: 40px;
  text-transform: capitalize;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 20px;
`
const Tag = styled.h5`
  margin-left: 30px;
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
