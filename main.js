// Main JavaScript file for shared functionality across all pages

document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu toggle
    const hamburger = document.querySelector(".hamburger")
    const navMenu = document.querySelector("nav ul")
  
    if (hamburger) {
      hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active")
        hamburger.classList.toggle("active")
      })
    }
  
    // Accordion functionality
    const accordionHeaders = document.querySelectorAll(".accordion-header")
  
    accordionHeaders.forEach((header) => {
      header.addEventListener("click", function () {
        const accordionItem = this.parentElement
        accordionItem.classList.toggle("active")
  
        // Close other accordion items
        const allAccordionItems = document.querySelectorAll(".accordion-item")
        allAccordionItems.forEach((item) => {
          if (item !== accordionItem) {
            item.classList.remove("active")
          }
        })
      })
    })
  
    // Testimonial slider
    const testimonials = document.querySelectorAll(".testimonial")
    const prevBtn = document.querySelector(".prev-btn")
    const nextBtn = document.querySelector(".next-btn")
  
    if (testimonials.length > 0 && prevBtn && nextBtn) {
      let currentTestimonial = 0
  
      // Hide all testimonials except the first one
      testimonials.forEach((testimonial, index) => {
        if (index !== 0) {
          testimonial.style.display = "none"
        }
      })
  
      // Show next testimonial
      nextBtn.addEventListener("click", () => {
        testimonials[currentTestimonial].style.display = "none"
        currentTestimonial = (currentTestimonial + 1) % testimonials.length
        testimonials[currentTestimonial].style.display = "block"
      })
  
      // Show previous testimonial
      prevBtn.addEventListener("click", () => {
        testimonials[currentTestimonial].style.display = "none"
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length
        testimonials[currentTestimonial].style.display = "block"
      })
    }
  })
  
  