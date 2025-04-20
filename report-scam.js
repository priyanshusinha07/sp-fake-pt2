// Report a Scam JavaScript functionality

document.addEventListener("DOMContentLoaded", () => {
    const scamReportForm = document.getElementById("scam-report-form")
    const reportSuccess = document.getElementById("report-success")
    const submitAnother = document.getElementById("submit-another")
  
    if (scamReportForm) {
      scamReportForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Get form values
        const scamUrl = document.getElementById("scam-url").value
        const scamType = document.getElementById("scam-type").value
        const scamDescription = document.getElementById("scam-description").value
  
        // Validate form
        if (!scamUrl || !scamType || !scamDescription) {
          alert("Please fill in all required fields")
          return
        }
  
        // Simulate form submission
        setTimeout(() => {
          // Hide form and show success message
          scamReportForm.classList.add("hidden")
          reportSuccess.classList.remove("hidden")
  
          // Log the report (in a real app, this would be sent to a server)
          console.log("Scam Report:", {
            url: scamUrl,
            type: scamType,
            description: scamDescription,
            timestamp: new Date().toISOString(),
          })
  
          // Clear form
          scamReportForm.reset()
        }, 1000)
      })
    }
  
    if (submitAnother) {
      submitAnother.addEventListener("click", () => {
        // Hide success message and show form
        reportSuccess.classList.add("hidden")
        scamReportForm.classList.remove("hidden")
      })
    }
  
    // File upload preview
    const scamEvidence = document.getElementById("scam-evidence")
  
    if (scamEvidence) {
      scamEvidence.addEventListener("change", (e) => {
        const file = e.target.files[0]
  
        if (file) {
          // Check file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            alert("File size exceeds 5MB limit. Please choose a smaller file.")
            e.target.value = ""
            return
          }
  
          // Check file type
          const validTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"]
          if (!validTypes.includes(file.type)) {
            alert("Invalid file type. Please upload an image or PDF.")
            e.target.value = ""
            return
          }
  
          // In a real app, you might want to show a preview of the image
          console.log("File selected:", file.name)
        }
      })
    }
  })
  
  