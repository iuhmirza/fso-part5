import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(exception) {
      console.log(exception)
    }
  }

  const handleBlog = async (event) => {
    event.preventDefault()
    try {
      setBlogs(blogs.concat(await blogService.create({title, author, url})))
    } catch(exception) {
      console.log(exception)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {message}
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
            type='text'
            value={username}
            name='Username'
            onChange={({target}) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
            type='password'
            value={password}
            name='Password'
            onChange={({target}) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {message}
      {user.name} logged in
      <button onClick={() => {
        window.localStorage.removeItem('loggedInUser')
        setUser(null)
        setMessage('Logged out')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        }}>
        logout
      </button>

      <h2>create new</h2>
      <div>
        <form onSubmit={handleBlog}>
          <div>
            title
            <input
            type='text'
            value={title}
            name='Title'
            onChange={({target}) => setTitle(target.value)}
            />
          </div>
          <div>
            author
            <input
            type='text'
            value={author}
            name='Author'
            onChange={({target}) => setAuthor(target.value)}
            />
          </div>
          <div>
            url
            <input
            type='text'
            value={url}
            name='Url'
            onChange={({target}) => setUrl(target.value)}
            />
          </div>
          <button type='submit'>create</button>
        </form>
      </div>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
