import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5fcYiSBL--WERcylwAETgx123hH42Q28",
  authDomain: "urlinks-d2f2e.firebaseapp.com",
  projectId: "urlinks-d2f2e",
  storageBucket: "urlinks-d2f2e.appspot.com",
  messagingSenderId: "199758058102",
  appId: "1:199758058102:web:311de9c5b0210d284e4557",
  measurementId: "G-N8NCSTM3XD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Switcher logic (already correct)
const switchers = [...document.querySelectorAll('.switcher')]
switchers.forEach(item => {
  item.addEventListener('click', function() {
    switchers.forEach(item => item.parentElement.classList.remove('is-active'))
    this.parentElement.classList.add('is-active')
  })
})

// Firebase Login
const loginForm = document.querySelector('.form-login');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert('Login successful!');
    window.location.href = "url-scanner.html"; // Redirect after successful login
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
});

// Firebase Sign Up
const signupForm = document.querySelector('.form-signup');
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-password-confirm').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert('Registration successful! Please login now.');
    window.location.reload(); // reload to switch to login view
  } catch (error) {
    alert('Registration failed: ' + error.message);
  }
});
