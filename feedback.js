// Feedback JavaScript functionality

document.addEventListener("DOMContentLoaded", () => {
    const feedbackForm = document.getElementById("feedback-form")
    const feedbackSuccess = document.getElementById("feedback-success")
    const submitAnotherFeedback = document.getElementById("submit-another-feedback")
  
    if (feedbackForm) {
      feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Get form values
        const feedbackType = document.getElementById("feedback-type").value
        const feedbackSubject = document.getElementById("feedback-subject").value
        const feedbackMessage = document.getElementById("feedback-message").value
  
        // Validate form
        if (!feedbackType || !feedbackSubject || !feedbackMessage) {
          alert("Please fill in all required fields")
          return
        }
  
        // Simulate form submission
        setTimeout(() => {
          // Hide form and show success message
          feedbackForm.classList.add("hidden")
          feedbackSuccess.classList.remove("hidden")
  
          // Log the feedback (in a real app, this would be sent to a server)
          console.log("Feedback Submission:", {
            type: feedbackType,
            subject: feedbackSubject,
            message: feedbackMessage,
            timestamp: new Date().toISOString(),
          })
  
          // Clear form
          feedbackForm.reset()
        }, 1000)
      })
    }
  
    if (submitAnotherFeedback) {
      submitAnotherFeedback.addEventListener("click", () => {
        // Hide success message and show form
        feedbackSuccess.classList.add("hidden")
        feedbackForm.classList.remove("hidden")
      })
    }
  
    // Star rating functionality
    const ratingInputs = document.querySelectorAll(".rating input")
  
    if (ratingInputs.length > 0) {
      ratingInputs.forEach((input) => {
        input.addEventListener("change", function () {
          const rating = this.value
          console.log("Rating selected:", rating)
        })
      })
    }
  
    // Anonymous feedback toggle
    const anonymousCheckbox = document.getElementById("feedback-anonymous")
    const emailInput = document.getElementById("feedback-email")
  
    if (anonymousCheckbox && emailInput) {
      anonymousCheckbox.addEventListener("change", function () {
        if (this.checked) {
          emailInput.value = ""
          emailInput.disabled = true
          emailInput.parentElement.classList.add("disabled")
        } else {
          emailInput.disabled = false
          emailInput.parentElement.classList.remove("disabled")
        }
      })
    }
  
    // File upload validation
    const feedbackScreenshot = document.getElementById("feedback-screenshot")
  
    if (feedbackScreenshot) {
      feedbackScreenshot.addEventListener("change", (e) => {
        const file = e.target.files[0]
  
        if (file) {
          // Check file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            alert("File size exceeds 5MB limit. Please choose a smaller file.")
            e.target.value = ""
            return
          }
  
          // Check file type
          const validTypes = ["image/jpeg", "image/png", "image/gif"]
          if (!validTypes.includes(file.type)) {
            alert("Invalid file type. Please upload an image.")
            e.target.value = ""
            return
          }
  
          // In a real app, you might want to show a preview of the image
          console.log("Screenshot selected:", file.name)
        }
      })
    }
  })
  
  