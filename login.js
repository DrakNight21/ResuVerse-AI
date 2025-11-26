document.addEventListener('DOMContentLoaded', () => {
    // Load particles.js config
    particlesJS("particles-js", {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: "#a970ff" },
        shape: { type: "circle" },
        opacity: { value: 0.3 },
        size: { value: 3 },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#a970ff",
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          out_mode: "out"
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" }
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });
  
    // Tab switching
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
  
    signinTab.addEventListener('click', () => {
      signinTab.classList.add('active');
      signupTab.classList.remove('active');
      signinForm.classList.add('active');
      signupForm.classList.remove('active');
      clearFormErrors();
    });
  
    signupTab.addEventListener('click', () => {
      signupTab.classList.add('active');
      signinTab.classList.remove('active');
      signupForm.classList.add('active');
      signinForm.classList.remove('active');
      clearFormErrors();
    });
  
    // User management (localStorage simulation)
    function getUsers() {
      const users = localStorage.getItem('aiResumeUsers');
      return users ? JSON.parse(users) : [];
    }
  
    function saveUser(user) {
      const users = getUsers();
      users.push(user);
      localStorage.setItem('aiResumeUsers', JSON.stringify(users));
    }
  
    function findUserByEmail(email) {
      const users = getUsers();
      return users.find(user => user.email === email);
    }
  
    // Notification system
    function showNotification(message, type) {
      const notification = document.getElementById('notification');
      notification.textContent = message;
      notification.className = 'notification ' + type;
      notification.classList.add('show');
      setTimeout(() => notification.classList.remove('show'), 3000);
    }
  
    // Password toggle functionality
    const passwordToggleBtns = document.querySelectorAll('.password-toggle');
    passwordToggleBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const inputField = this.previousElementSibling;
        const eyeIcon = this.querySelector('.eye-icon');
        const eyeOffIcon = this.querySelector('.eye-off-icon');
  
        if (inputField.type === 'password') {
          inputField.type = 'text';
          eyeIcon.style.display = 'none';
          eyeOffIcon.style.display = 'block';
        } else {
          inputField.type = 'password';
          eyeIcon.style.display = 'block';
          eyeOffIcon.style.display = 'none';
        }
      });
    });
  
    // Validation helpers
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  
    function validatePassword(password) {
      return password.length >= 6;
    }
  
    function validateName(name) {
      return name.trim().length > 0;
    }
  
    function validatePasswordMatch(password, confirmPassword) {
      return password === confirmPassword;
    }
  
    function showError(input, errorElem, msg) {
      input.classList.add('error');
      errorElem.textContent = msg;
      errorElem.style.display = 'block';
    }
  
    function clearError(input, errorElem) {
      input.classList.remove('error');
      errorElem.style.display = 'none';
    }
  
    function clearFormErrors() {
      document.querySelectorAll('input').forEach(input => input.classList.remove('error'));
      document.querySelectorAll('.error-message').forEach(err => err.style.display = 'none');
    }
  
    // Sign In handler
    const loginForm = document.getElementById('login-form');
    const signinLoader = document.getElementById('signin-loader');
  
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFormErrors();
  
      const emailInput = document.getElementById('signin-email');
      const passwordInput = document.getElementById('signin-password');
      const emailError = document.getElementById('signin-email-error');
      const passwordError = document.getElementById('signin-password-error');
  
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      let isValid = true;
  
      if (!validateEmail(email)) {
        showError(emailInput, emailError, 'Please enter a valid email address');
        isValid = false;
      }
  
      if (!validatePassword(password)) {
        showError(passwordInput, passwordError, 'Password must be at least 6 characters');
        isValid = false;
      }
  
      if (isValid) {
        signinLoader.classList.add('active');
        setTimeout(() => {
          const user = findUserByEmail(email);
          signinLoader.classList.remove('active');
  
          if (!user) {
            showError(emailInput, emailError, 'No account found with this email. Please sign up.');
            return;
          }
  
          if (user.password !== password) {
            showError(passwordInput, passwordError, 'Incorrect password');
            return;
          }
  
          showNotification('Login successful! Redirecting...', 'success');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        }, 1500);
      }
    });
  
    // Sign Up handler
    const registerForm = document.getElementById('register-form');
    const signupLoader = document.getElementById('signup-loader');
  
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFormErrors();
  
      const nameInput = document.getElementById('signup-name');
      const emailInput = document.getElementById('signup-email');
      const passwordInput = document.getElementById('signup-password');
      const confirmInput = document.getElementById('signup-confirm');
  
      const nameError = document.getElementById('signup-name-error');
      const emailError = document.getElementById('signup-email-error');
      const passwordError = document.getElementById('signup-password-error');
      const confirmError = document.getElementById('signup-confirm-error');
  
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmInput.value;
      let isValid = true;
  
      if (!validateName(name)) {
        showError(nameInput, nameError, 'Please enter your full name');
        isValid = false;
      }
  
      if (!validateEmail(email)) {
        showError(emailInput, emailError, 'Please enter a valid email address');
        isValid = false;
      }
  
      if (findUserByEmail(email)) {
        showError(emailInput, emailError, 'An account with this email already exists');
        isValid = false;
      }
  
      if (!validatePassword(password)) {
        showError(passwordInput, passwordError, 'Password must be at least 6 characters');
        isValid = false;
      }
  
      if (!validatePasswordMatch(password, confirmPassword)) {
        showError(confirmInput, confirmError, 'Passwords do not match');
        isValid = false;
      }
  
      if (isValid) {
        signupLoader.classList.add('active');
  
        setTimeout(() => {
          const newUser = {
            name,
            email,
            password,
            createdAt: new Date().toISOString()
          };
          saveUser(newUser);
          signupLoader.classList.remove('active');
          showNotification('Account created successfully! Please sign in.', 'success');
          registerForm.reset();
          signinTab.click();
        }, 1500);
      }
    });
  
    // Forgot password
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    forgotPasswordLink.addEventListener('click', function (e) {
      e.preventDefault();
      const emailInput = document.getElementById('signin-email');
      const email = emailInput.value.trim();
  
      if (!validateEmail(email)) {
        showError(emailInput, document.getElementById('signin-email-error'), 'Please enter your email first');
        return;
      }
  
      const user = findUserByEmail(email);
      if (!user) {
        showError(emailInput, document.getElementById('signin-email-error'), 'No account found with this email');
        return;
      }
  
      showNotification('Password reset link sent to your email', 'success');
    });
  });
  