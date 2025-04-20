// Payment JavaScript functionality

document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const paymentTabBtns = document.querySelectorAll(".payment-tab-btn")
    const paymentTabContents = document.querySelectorAll(".payment-tab-content")
    const upiOptions = document.querySelectorAll('input[name="upi-method"]')
    const upiIdSection = document.getElementById("upi-id-section")
    const upiQrSection = document.getElementById("upi-qr-section")
    const bankOptions = document.querySelectorAll('input[name="bank"]')
    const bankSelect = document.getElementById("bank-select")
    const couponBtn = document.getElementById("coupon-btn")
    const couponForm = document.getElementById("coupon-form")
    const applyBtn = document.getElementById("apply-coupon")
    const couponMessage = document.getElementById("coupon-message")
  
    // Payment forms
    const cardPaymentForm = document.getElementById("card-payment-form")
    const upiPaymentForm = document.getElementById("upi-payment-form")
    const netbankingPaymentForm = document.getElementById("netbanking-payment-form")
    const walletPaymentForm = document.getElementById("wallet-payment-form")
  
    // Plan details elements
    const selectedPlanName = document.getElementById("selected-plan-name")
    const selectedPlanBilling = document.getElementById("selected-plan-billing")
    const selectedPlanPrice = document.getElementById("selected-plan-price")
    const subtotal = document.getElementById("subtotal")
    const tax = document.getElementById("tax")
    const total = document.getElementById("total")
    const billingAmount = document.getElementById("billing-amount")
    const billingFrequency = document.getElementById("billing-frequency")
    const planFeaturesList = document.getElementById("plan-features-list")
  
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const plan = urlParams.get("plan")
    const billing = urlParams.get("billing")
  
    // Plan data
    const planData = {
      standard: {
        name: "Standard Plan",
        monthly: {
          price: 499,
          features: [
            "Everything in Basic",
            "25 URL checks per day",
            "Standard safety reports",
            "Browser extension",
            "Email alerts",
          ],
        },
        annual: {
          price: 399,
          features: [
            "Everything in Basic",
            "25 URL checks per day",
            "Standard safety reports",
            "Browser extension",
            "Email alerts",
          ],
        },
      },
      premium: {
        name: "Premium Plan",
        monthly: {
          price: 999,
          features: [
            "Everything in Standard",
            "Unlimited URL checks",
            "Detailed safety analysis",
            "Bulk URL checking (up to 100)",
            "Email alerts for risky sites",
            "Basic API access (100 calls/day)",
            "Priority support",
          ],
        },
        annual: {
          price: 799,
          features: [
            "Everything in Standard",
            "Unlimited URL checks",
            "Detailed safety analysis",
            "Bulk URL checking (up to 100)",
            "Email alerts for risky sites",
            "Basic API access (100 calls/day)",
            "Priority support",
          ],
        },
      },
      family: {
        name: "Family Plan",
        monthly: {
          price: 1499,
          features: [
            "Everything in Premium",
            "Up to 5 user accounts",
            "Family dashboard",
            "Parental controls",
            "Shared safe lists",
            "Real-time alerts",
            "Premium support",
          ],
        },
        annual: {
          price: 1199,
          features: [
            "Everything in Premium",
            "Up to 5 user accounts",
            "Family dashboard",
            "Parental controls",
            "Shared safe lists",
            "Real-time alerts",
            "Premium support",
          ],
        },
      },
      startup: {
        name: "Startup Plan",
        monthly: {
          price: 2499,
          features: [
            "Up to 10 user accounts",
            "Unlimited URL checks",
            "Bulk URL checking (up to 500)",
            "API access (1,000 calls/day)",
            "Team management",
            "Basic analytics",
            "Business hours support",
          ],
        },
        annual: {
          price: 1999,
          features: [
            "Up to 10 user accounts",
            "Unlimited URL checks",
            "Bulk URL checking (up to 500)",
            "API access (1,000 calls/day)",
            "Team management",
            "Basic analytics",
            "Business hours support",
          ],
        },
      },
      business: {
        name: "Business Plan",
        monthly: {
          price: 4999,
          features: [
            "Everything in Startup",
            "Up to 25 user accounts",
            "Unlimited bulk URL checking",
            "Advanced API access (10,000 calls/day)",
            "Custom integrations",
            "Advanced analytics dashboard",
            "Priority support",
          ],
        },
        annual: {
          price: 3999,
          features: [
            "Everything in Startup",
            "Up to 25 user accounts",
            "Unlimited bulk URL checking",
            "Advanced API access (10,000 calls/day)",
            "Custom integrations",
            "Advanced analytics dashboard",
            "Priority support",
          ],
        },
      },
      corporate: {
        name: "Corporate Plan",
        monthly: {
          price: 9999,
          features: [
            "Everything in Business",
            "Up to 100 user accounts",
            "Advanced threat detection",
            "Enterprise API access (50,000 calls/day)",
            "Custom security policies",
            "Executive dashboard",
            "24/7 dedicated support",
          ],
        },
        annual: {
          price: 7999,
          features: [
            "Everything in Business",
            "Up to 100 user accounts",
            "Advanced threat detection",
            "Enterprise API access (50,000 calls/day)",
            "Custom security policies",
            "Executive dashboard",
            "24/7 dedicated support",
          ],
        },
      },
    }
  
    // Set plan details based on URL parameters
    function setPlanDetails() {
      if (plan && planData[plan]) {
        const billingType = billing === "annual" ? "annual" : "monthly"
        const planInfo = planData[plan][billingType]
  
        // Set plan name and billing type
        selectedPlanName.textContent = planData[plan].name
        selectedPlanBilling.textContent = billingType === "annual" ? "Annual Billing" : "Monthly Billing"
  
        // Set prices
        const price = planInfo.price
        const taxAmount = price * 0.18 // 18% GST
        const totalAmount = price + taxAmount
  
        selectedPlanPrice.textContent = `₹${price.toLocaleString()}`
        subtotal.textContent = `₹${price.toLocaleString()}`
        tax.textContent = `₹${taxAmount.toLocaleString()}`
        total.textContent = `₹${totalAmount.toLocaleString()}`
  
        // Set billing details
        billingAmount.textContent = `₹${totalAmount.toLocaleString()}`
        billingFrequency.textContent = billingType === "annual" ? "annually" : "monthly"
  
        // Set features
        if (planFeaturesList) {
          planFeaturesList.innerHTML = ""
          planInfo.features.forEach((feature) => {
            const li = document.createElement("li")
            li.textContent = feature
            planFeaturesList.appendChild(li)
          })
        }
      }
    }
  
    // Initialize plan details
    setPlanDetails()
  
    // Payment tab switching
    if (paymentTabBtns.length > 0) {
      paymentTabBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const tab = this.getAttribute("data-tab")
  
          // Update active button
          paymentTabBtns.forEach((b) => b.classList.remove("active"))
          this.classList.add("active")
  
          // Show selected tab content
          paymentTabContents.forEach((content) => {
            content.classList.add("hidden")
            if (content.id === tab + "-tab") {
              content.classList.remove("hidden")
            }
          })
        })
      })
    }
  
    // UPI option switching
    if (upiOptions.length > 0) {
      upiOptions.forEach((option) => {
        option.addEventListener("change", function () {
          if (this.value === "upi-id") {
            upiIdSection.classList.remove("hidden")
            upiQrSection.classList.add("hidden")
          } else {
            upiIdSection.classList.add("hidden")
            upiQrSection.classList.remove("hidden")
          }
        })
      })
    }
  
    // Bank option selection
    if (bankOptions.length > 0 && bankSelect) {
      bankOptions.forEach((option) => {
        option.addEventListener("change", function () {
          bankSelect.value = this.value
        })
      })
  
      bankSelect.addEventListener("change", function () {
        const selectedBank = this.value
  
        bankOptions.forEach((option) => {
          if (option.value === selectedBank) {
            option.checked = true
          }
        })
      })
    }
  
    // Coupon toggle
    if (couponBtn && couponForm) {
      couponBtn.addEventListener("click", () => {
        couponForm.classList.toggle("hidden")
      })
    }
  
    // Apply coupon
    if (applyBtn && couponMessage) {
      applyBtn.addEventListener("click", (e) => {
        e.preventDefault()
  
        const couponCode = document.getElementById("coupon-code").value.trim()
  
        if (!couponCode) {
          couponMessage.textContent = "Please enter a coupon code"
          couponMessage.className = "coupon-message error"
          return
        }
  
        // Simulate coupon validation
        if (couponCode.toUpperCase() === "WELCOME10") {
          // Apply 10% discount
          const currentSubtotal = Number.parseFloat(subtotal.textContent.replace("₹", "").replace(",", ""))
          const discount = currentSubtotal * 0.1
          const newSubtotal = currentSubtotal - discount
          const newTax = newSubtotal * 0.18
          const newTotal = newSubtotal + newTax
  
          subtotal.textContent = `₹${newSubtotal.toLocaleString()}`
          tax.textContent = `₹${newTax.toLocaleString()}`
          total.textContent = `₹${newTotal.toLocaleString()}`
          billingAmount.textContent = `₹${newTotal.toLocaleString()}`
  
          couponMessage.textContent = "Coupon applied successfully! 10% discount applied."
          couponMessage.className = "coupon-message success"
  
          // Disable apply button
          applyBtn.disabled = true
        } else {
          couponMessage.textContent = "Invalid coupon code"
          couponMessage.className = "coupon-message error"
        }
      })
    }
  
    // Credit card input formatting
    const cardNumber = document.getElementById("card-number")
    const expiryDate = document.getElementById("expiry-date")
  
    if (cardNumber) {
      cardNumber.addEventListener("input", function (e) {
        // Remove non-digits
        let value = this.value.replace(/\D/g, "")
  
        // Add space after every 4 digits
        value = value.replace(/(\d{4})(?=\d)/g, "$1 ")
  
        // Update input value
        this.value = value
      })
    }
  
    if (expiryDate) {
      expiryDate.addEventListener("input", function (e) {
        // Remove non-digits
        let value = this.value.replace(/\D/g, "")
  
        // Add slash after month
        if (value.length > 2) {
          value = value.substring(0, 2) + "/" + value.substring(2)
        }
  
        // Update input value
        this.value = value
      })
    }
  
    // Payment form submission
    const handlePaymentSubmit = function (e) {
      e.preventDefault()
  
      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.textContent = "Processing..."
      submitBtn.disabled = true
  
      // Simulate payment processing
      setTimeout(() => {
        // Show success message
        alert("Payment successful! Your plan has been activated.")
  
        // Redirect to dashboard (in a real app)
        window.location.href = "index.html?payment=success"
      }, 2000)
    }
  
    if (cardPaymentForm) {
      cardPaymentForm.addEventListener("submit", handlePaymentSubmit)
    }
  
    if (upiPaymentForm) {
      upiPaymentForm.addEventListener("submit", handlePaymentSubmit)
    }
  
    if (netbankingPaymentForm) {
      netbankingPaymentForm.addEventListener("submit", handlePaymentSubmit)
    }
  
    if (walletPaymentForm) {
      walletPaymentForm.addEventListener("submit", handlePaymentSubmit)
    }
  })
  
  