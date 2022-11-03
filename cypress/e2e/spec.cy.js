describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const newUser = {
      name: "Groves, S",
      username: "root",
      password: "dashwood"
    }
    cy.request('POST', 'http://localhost:3003/api/users', newUser)
    cy.visit('http://localhost:3000')
  })
  it('Login form is shown', function () {
    cy.contains('login')
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })
  describe('Login', function () {
    it('succeeds with correct details orrect details', function () {
      cy.get('#username').type('root')
      cy.get('#password').type('dashwood')
      cy.get('#login-button').click()
      cy.get('#logout-button').click()
    })
    it('fails with wrong credentials', function () {
      cy.get('#username').type('root')
      cy.get('#password').type('smoot')
      cy.get('#login-button').click()
      cy.contains('Request failed with status code 401').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {username: 'root', password: 'dashwood'})
        .then(({ body }) => {
          localStorage.setItem('loggedInUser', JSON.stringify(body))
          cy.visit('http://localhost:3000')
        })
    })
    it('Logged in', function() {
      cy.contains('Groves, S logged in')
    })
    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('cypress title')
      cy.get('#author').type('cypress')
      cy.get('#url').type('cypress.com')
      cy.get('#submit-blog-button').click()
      cy.contains('cypress title')
      cy.contains('cypress')
      cy.contains('view').click()
      cy.contains('cypress.com')
      cy.contains('0 likes')
    })
    describe('a blog exists', function() {
      beforeEach(function() {
        const newBlog = {
          title: 'a great title',
          author: 'a great author',
          url: 'great.com'
        }
        cy.request({
          url: 'http://localhost:3003/api/blogs',
          method: 'POST',
          body: newBlog,
          headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
          }
        }).then(() => {
          cy.visit('http://localhost:3000')
        })
      })
      it('user can like a blog', function() {
        cy.contains('view').click()
        cy.get('button').contains('like').click()
        cy.contains('1')
      })
      it('user can delete blogs', function() {
        cy.contains('view').click()
        cy.get('button').contains('delete').click()
        cy.get('html').should('not.contain', 'a great title')
        /* check here */
      })
    })
    describe('several blogs exist', function() {
      beforeEach(function() {
        const newBlogA = {
          title: "A bad blog",
          author: "A bad author",
          url: "bad.com",
          likes: 2,
        }
        const newBlogB = {
          title: "B good blog",
          author: "B good author",
          url: "good.com",
          likes: 5
        }
        const newBlogC = {
          title: 'C great blog',
          author: 'C great author',
          url: 'great.com',
          likes: 10
        }
        cy.createBlog(newBlogA)
          .then(() => cy.createBlog(newBlogB))
          .then(() => cy.createBlog(newBlogC))
      })
      it('blogs sorted by number of likes', function() {
        cy.visit('http://localhost:3000/')
        cy.get('.blog>div').eq(0).should('contain', 'C great blog')
        cy.get('.blog>div').eq(1).should('contain', 'B good blog')
        cy.get('.blog>div').eq(2).should('contain', 'A bad blog')
      })
    })
  })
})

Cypress.Commands.add('createBlog', blog => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: blog,
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
    }
  })
  cy.visit('http://localhost:3000')
})