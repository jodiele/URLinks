// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5fcYiSBL--WERcylwAETgx123hH42Q28",
  authDomain: "urlinks-d2f2e.firebaseapp.com",
  projectId: "urlinks-d2f2e",
  storageBucket: "urlinks-d2f2e.appspot.com",
  messagingSenderId: "199758058102",
  appId: "1:199758058102:web:311de9c5b0210d284e4557",
  measurementId: "G-N8NCSTM3XD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Wait for the page to load fully
document.addEventListener('DOMContentLoaded', () => {

  // Switcher buttons
  const switchers = document.querySelectorAll('.switcher');
  switchers.forEach(button => {
    button.addEventListener('click', () => {
      switchers.forEach(btn => btn.parentElement.classList.remove('is-active'));
      button.parentElement.classList.add('is-active');
    });
  });

  // Handle Login
  const loginForm = document.querySelector('.form-login');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      window.location.href = 'index.html';
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  });

  // Handle Sign Up
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
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registration successful! Please log in.');
      window.location.reload(); // Reloads back to login form
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  });

});
