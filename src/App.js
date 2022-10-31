import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  const BlogFormRef = useRef()

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
      blogService.setToken(user.token)
    }
  }, [])

  const handleError = error => {
    setError(true)
    setMessage(error.message)
    setTimeout(() => {
      setError(false)
      setMessage(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      handleError(exception)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      setBlogs(blogs.concat(await blogService.create(blogObject)))
      BlogFormRef.current.toggleVisibility()
      setMessage(`Added ${blogObject.title + ' ' + blogObject.author}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      handleError(exception)
    }
  }

  const addLike = async (blogObject) => {
    try {
      return await blogService.like(blogObject, (blogObject.likes+1))
    } catch (exception) {
      handleError(exception)
    }
  }

  const removeBlog = async (blog) => {
    try {
      setBlogs(blogs.filter(item => item.id !== blog.id))
      return await blogService.remove(blog)
    } catch(exception) {
      handleError(exception)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} error={error} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
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
      <Notification message={message} error={error} />
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

      <div>
        <Togglable buttonLabel="new blog" ref={BlogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        {blogs.sort((a, b) => b.likes - a.likes).map(blog => <Blog key={blog.id} givenBlog={blog} likeButton={addLike} removeButton={removeBlog}/>)}
      </div>
    </div>
  )
}

export default App
