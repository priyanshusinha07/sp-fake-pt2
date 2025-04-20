// Support JavaScript functionality

document.addEventListener("DOMContentLoaded", () => {
    // FAQ category tabs
    const categoryBtns = document.querySelectorAll(".category-btn")
    const faqContents = document.querySelectorAll(".faq-content")
  
    if (categoryBtns.length > 0) {
      categoryBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const category = this.getAttribute("data-category")
  
          // Update active button
          categoryBtns.forEach((b) => b.classList.remove("active"))
          this.classList.add("active")
  
          // Show selected category content
          faqContents.forEach((content) => {
            content.classList.add("hidden")
            if (content.id === category) {
              content.classList.remove("hidden")
            }
          })
        })
      })
    }
  
    // Support search functionality
    const supportSearch = document.getElementById("support-search")
  
    if (supportSearch) {
      supportSearch.addEventListener("submit", (e) => {
        e.preventDefault()
  
        const searchInput = document.getElementById("search-input")
        const searchTerm = searchInput.value.trim().toLowerCase()
  
        if (!searchTerm) {
          alert("Please enter a search term")
          return
        }
  
        // In a real app, this would search through FAQ content
        // For demo purposes, we'll just log the search term
        console.log("Searching for:", searchTerm)
  
        // Simulate search results
        alert(
          `Searching for "${searchTerm}". In a real application, this would display matching FAQs and support articles.`,
        )
      })
    }
  
    // Contact form submission
    const contactForm = document.getElementById("contact-form")
    const contactSuccess = document.getElementById("contact-success")
    const sendAnother = document.getElementById("send-another")
  
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Get form values
        const name = document.getElementById("contact-name").value
        const email = document.getElementById("contact-email").value
        const subject = document.getElementById("contact-subject").value
        const message = document.getElementById("contact-message").value
  
        // Validate form
        if (!name || !email || !subject || !message) {
          alert("Please fill in all required fields")
          return
        }
  
        // Simulate form submission
        setTimeout(() => {
          // Hide form and show success message
          contactForm.classList.add("hidden")
          contactSuccess.classList.remove("hidden")
  
          // Log the contact submission (in a real app, this would be sent to a server)
          console.log("Contact Submission:", {
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString(),
          })
  
          // Clear form
          contactForm.reset()
        }, 1000)
      })
    }
  
    if (sendAnother) {
      sendAnother.addEventListener("click", () => {
        // Hide success message and show form
        contactSuccess.classList.add("hidden")
        contactForm.classList.remove("hidden")
      })
    }
  })
  
  