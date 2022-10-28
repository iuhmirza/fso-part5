import Togglable from "./Togglable"
import {useState} from 'react'

const Blog = ({ givenBlog, likeButton }) => {
  const [blog, setBlog] = useState(givenBlog)


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = async (event) => {
    event.preventDefault()
    setBlog(await likeButton(blog))
    
  }
  
  return (
    <div style={blogStyle}>
      <p>{blog.title} - {blog.author}</p>
      <Togglable buttonLabel="view">
        <p>{blog.likes} likes</p>
        <button onClick={addLike}>like</button>
        <p>{blog.url}</p>
      </Togglable>
    </div>
  )
}

export default Blog