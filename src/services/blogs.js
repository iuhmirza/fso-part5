import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
    const config= {
        headers: {Authorization: token},
    }

    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const like = async (blog, likes) => {
    const config = {
        headers: {Authorization : token}
    }

    const response = await axios.put(`${baseUrl}/${blog.id}`, { "likes" : likes }, config)
    return response.data

}

const remove = async (blog) => {
    const config = {
        headers : {Authorization : token}
    }
    
    console.log(config.headers)
    const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
    console.log(response)
    return response.data

}

export default { getAll, create, setToken, like, remove }