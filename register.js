// Register JavaScript functionality

document.addEventListener("DOMContentLoaded", () => {
  // Tab switching
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  if (tabBtns.length > 0) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const tab = this.getAttribute("data-tab")

        // Update active button
        tabBtns.forEach((b) => b.classList.remove("active"))
        this.classList.add("active")

        // Show selected tab content
        tabContents.forEach((content) => {
          content.classList.add("hidden")
          if (content.id === tab + "-tab") {
            content.classList.remove("hidden")
          }
        })
      })
    })
  }

  // Password visibility toggle
  const togglePasswordBtns = document.querySelectorAll(".toggle-password")

  if (togglePasswordBtns.length > 0) {
    togglePasswordBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const passwordInput = this.previousElementSibling
        const icon = this.querySelector("img")

        if (passwordInput.type === "password") {
          passwordInput.type = "text"
          icon.src = "images/Eye.jpeg"
          icon.alt = "Hide password"
        } else {
          passwordInput.type = "password"
          icon.src = "images/Eye.jpeg"
          icon.alt = "Show password"
        }
      })
    })
  }

  // Password strength meter
  const passwordInput = document.getElementById("password")
  const strengthMeter = document.querySelector(".strength-meter")
  const strengthText = document.querySelector(".strength-text")

  if (passwordInput && strengthMeter && strengthText) {
    passwordInput.addEventListener("input", function () {
      const password = this.value
      let strength = 0

      // Calculate password strength
      if (password.length >= 8) strength += 1
      if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1
      if (password.match(/\d/)) strength += 1
      if (password.match(/[^a-zA-Z\d]/)) strength += 1

      // Update strength meter
      const segments = strengthMeter.querySelectorAll(".meter-segment")

      segments.forEach((segment, index) => {
        if (index < strength) {
          segment.classList.add("active")
        } else {
          segment.classList.remove("active")
        }
      })

      // Update strength text
      let strengthLabel = ""
      let strengthColor = ""

      switch (strength) {
        case 0:
          strengthLabel = "Very Weak"
          strengthColor = "#dc3545"
          break
        case 1:
          strengthLabel = "Weak"
          strengthColor = "#ffc107"
          break
        case 2:
          strengthLabel = "Medium"
          strengthColor = "#fd7e14"
          break
        case 3:
          strengthLabel = "Strong"
          strengthColor = "#28a745"
          break
        case 4:
          strengthLabel = "Very Strong"
          strengthColor = "#20c997"
          break
      }

      strengthText.textContent = `Password strength: ${strengthLabel}`
      strengthText.style.color = strengthColor

      // Update segment colors
      segments.forEach((segment, index) => {
        if (index < strength) {
          switch (strength) {
            case 1:
              segment.style.backgroundColor = "#ffc107"
              break
            case 2:
              segment.style.backgroundColor = "#fd7e14"
              break
            case 3:
              segment.style.backgroundColor = "#28a745"
              break
            case 4:
              segment.style.backgroundColor = "#20c997"
              break
          }
        }
      })
    })
  }

  // API URL - Change this to your Python backend URL
  const API_URL = "http://localhost:5000/api"

  // Form submission
  const registerForm = document.getElementById("register-form")
  const loginForm = document.getElementById("login-form")

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Get form values
      const firstName = document.getElementById("first-name").value
      const lastName = document.getElementById("last-name").value
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value
      const marketingConsent = document.getElementById("marketing-agree").checked

      // Validate form
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert("Please fill in all required fields")
        return
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match")
        return
      }

      // Show loading state
      const submitBtn = registerForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.textContent = "Processing..."
      submitBtn.disabled = true

      try {
        // Send data to backend
        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            marketingConsent,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          // Registration successful
          alert(`Registration successful! Welcome, ${firstName} ${lastName}!`)

          // Store user info in localStorage (for demo purposes)
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              firstName,
              lastName,
              email,
              isLoggedIn: true,
            }),
          )

          // Update UI to show logged in state
          updateAuthUI()

          // Redirect to dashboard (in a real app)
          window.location.href = "index.html?registered=true"
        } else {
          // Registration failed
          alert(`Registration failed: ${data.message}`)
        }
      } catch (error) {
        console.error("Error during registration:", error)
        alert("Registration failed. Please try again later.")
      } finally {
        // Reset button state
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }
    })
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Get form values
      const email = document.getElementById("login-email").value
      const password = document.getElementById("login-password").value
      const rememberMe = document.getElementById("remember-me").checked

      // Validate form
      if (!email || !password) {
        alert("Please fill in all required fields")
        return
      }

      // Show loading state
      const submitBtn = loginForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.textContent = "Processing..."
      submitBtn.disabled = true

      try {
        // Send data to backend
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          // Login successful
          alert(`Login successful! Welcome back, ${data.user.firstName}!`)

          // Store user info in localStorage (for demo purposes)
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              ...data.user,
              isLoggedIn: true,
              rememberMe,
            }),
          )

          // Update UI to show logged in state
          updateAuthUI()

          // Redirect to dashboard (in a real app)
          window.location.href = "index.html?login=success"
        } else {
          // Login failed
          alert(`Login failed: ${data.message}`)
        }
      } catch (error) {
        console.error("Error during login:", error)
        alert("Login failed. Please try again later.")
      } finally {
        // Reset button state
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }
    })
  }

  // Profile modal elements
  const profileModal = document.getElementById("profile-modal")
  const closeModal = document.querySelector(".close-modal")
  const signOutBtn = document.getElementById("sign-out-btn")
  const viewProfileBtn = document.getElementById("view-profile-btn")
  const profileInitials = document.getElementById("profile-initials")
  const profileName = document.getElementById("profile-name")
  const profileEmail = document.getElementById("profile-email")
  const authNavItem = document.getElementById("auth-nav-item")

  // Show profile modal
  function showProfileModal() {
    if (profileModal) {
      profileModal.classList.add("show")
    }
  }

  // Hide profile modal
  function hideProfileModal() {
    if (profileModal) {
      profileModal.classList.remove("show")
    }
  }

  // Sign out functionality
  function signOut() {
    // Clear user data from localStorage
    localStorage.removeItem("currentUser")

    // Update UI
    updateAuthUI()

    // Hide modal
    hideProfileModal()

    // Redirect to home page
    window.location.href = "index.html?logout=success"
  }

  // Update authentication UI based on login state
  function updateAuthUI() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")

    if (currentUser.isLoggedIn && authNavItem) {
      // User is logged in - show profile link
      authNavItem.innerHTML = `<a href="#" id="profile-link" class="btn-primary">${currentUser.firstName} <span class="profile-arrow">▼</span></a>`

      // Update profile modal content
      if (profileInitials) {
        profileInitials.textContent = `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`
      }

      if (profileName) {
        profileName.textContent = `${currentUser.firstName} ${currentUser.lastName}`
      }

      if (profileEmail) {
        profileEmail.textContent = currentUser.email
      }

      // Add event listener to profile link
      const profileLink = document.getElementById("profile-link")
      if (profileLink) {
        profileLink.addEventListener("click", (e) => {
          e.preventDefault()
          showProfileModal()
        })
      }
    } else if (authNavItem) {
      // User is not logged in - show register link
      authNavItem.innerHTML = `<a href="register.html" class="btn-primary">Register</a>`
    }
  }

  // Event listeners for modal
  if (closeModal) {
    closeModal.addEventListener("click", hideProfileModal)
  }

  if (signOutBtn) {
    signOutBtn.addEventListener("click", signOut)
  }

  if (viewProfileBtn) {
    viewProfileBtn.addEventListener("click", () => {
      hideProfileModal()
      // In a real app, redirect to profile page
      alert("Profile page would open here")
    })
  }

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === profileModal) {
      hideProfileModal()
    }
  })

  // Call this function on page load to update UI based on login state
  updateAuthUI()
})
