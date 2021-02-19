const loginForm = document.querySelector(".login-form")
const loginMessage = document.querySelector(".login-message")
const signupForm = document.querySelector(".signup-form")
const signupMessage = document.querySelector(".signup-message")
const logOut = document.querySelector('.logout')

loginForm.addEventListener( 'submit', (event) => {
  event.preventDefault()
  const formData = new FormData(event.target)

  fetch('http://localhost:3000/login', {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      username: formData.get('username'),
      password: formData.get('password')
    })
  }).then( response => {
    if (!response.ok) throw new Error('Invalid Username and/or Password')
    return response.json()
  }).then(response => {
    localStorage.setItem("token", response.token)
    loginMessage.textContent = "Status: Logged In"
  }).catch( error => {
    loginMessage.textContent = error.message
  })
  event.target.reset()
})


if(localStorage.getItem('token')){
  loginMessage.textContent = "Status: Logged In"  
} else{
  loginMessage.textContent = "Status: Not Logged In"
}


signupForm.addEventListener('submit', (event) =>  {
  event.preventDefault()
  const formData = new FormData(event.target)
  fetch('http://localhost:3000/users', {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      username: formData.get('username'),
      password: formData.get('password')
    })
  }).then(response => response.json())
    .then(response => {
      const newUsername = response.user.username 
      signupMessage.textContent = `Hello ${newUsername}, Log into your account`
    })
  event.target.reset()
})


logOut.addEventListener('click', (event) => {
  localStorage.removeItem('token')
})