import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog title and author, but not url or number of likes ', () => {
  const blog = {
    title: 'Test blog',
    author: 'Anonymous',
    url: 'example.com',
    likes: 13
  }

  render(<Blog givenBlog={blog} />)

  const title = screen.getByText('Test blog', { exact: false })
  const author = screen.getByText('Anonymous', { exact: false })
  const url = screen.queryByText('example.com', { exact: false })
  const likes = screen.queryByText('13', { exact: false })

  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()

})

test('displays url and number of likes when button is clicked', async () => {
  const blog = {
    title: 'Test blog',
    author: 'Anonymous',
    url: 'example.com',
    likes: 13
  }

  const user = userEvent.setup()

  render(<Blog givenBlog={blog}/>)

  const showButton = screen.getByText('view')
  await user.click(showButton)

  const url = screen.getByText('example.com', { exact: false })
  const likes = screen.getByText('13', { exact: false })

  expect(url).toBeDefined()
  expect(likes).toBeDefined()

})

test('like button pressed twice registers', async () => {
  const blog = {
    title: 'Test blog',
    author: 'Anonymous',
    url: 'example.com',
    likes: 13
  }

  const likeHandler = jest.fn()

  render(<Blog givenBlog={blog} likeButton={likeHandler}/>)

  const showButton = screen.getByText('view')
  const user = userEvent.setup()
  await user.click(showButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(likeHandler.mock.calls).toHaveLength(2)
})