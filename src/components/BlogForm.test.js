import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('handler is called when correct form is submitted', async () => {
  const newBlog = {
    title: 'A great title',
    author: 'A great author',
    url: 'great.com'
  }


  const handleForm = jest.fn()

  render(<BlogForm createBlog={handleForm}/>)

  const user = userEvent.setup()
  const titleInput = screen.getAllByRole('textbox')[0]
  const authorInput = screen.getAllByRole('textbox')[1]
  const urlInput = screen.getAllByRole('textbox')[2]
  const submitButton = screen.getByText('create')

  await user.type(titleInput, newBlog.title)
  await user.type(authorInput, newBlog.author)
  await user.type(urlInput, newBlog.url)
  await user.click(submitButton)

  expect(handleForm.mock.calls).toHaveLength(1)

})