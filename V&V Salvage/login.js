document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Hardcoded credentials
  const validUsername = 'user';
  const validPassword = 'password';

  if (username === validUsername && password === validPassword) {
      // Redirect to another page if credentials are correct
      window.location.href = 'invedit.html';
  } else {
      // Show error message if credentials are incorrect
      document.getElementById('error-message').textContent = 'Invalid username or password';
  }
});
