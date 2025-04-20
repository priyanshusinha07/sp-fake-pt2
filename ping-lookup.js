import { Chart } from "@/components/ui/chart"
// Ping Lookup JavaScript functionality

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const pingForm = document.getElementById("ping-form")
  const pingTarget = document.getElementById("ping-target")
  const pingCount = document.getElementById("ping-count")
  const pingIntervalSelect = document.getElementById("ping-interval")
  const continuousPing = document.getElementById("continuous-ping")
  const pingStatus = document.getElementById("ping-status")
  const pingResults = document.getElementById("ping-results")
  const pingTableBody = document.getElementById("ping-table-body")
  const pingLog = document.getElementById("ping-log")
  const pingHistoryElement = document.getElementById("ping-history")
  const clearHistory = document.getElementById("clear-history")
  const exportResults = document.getElementById("export-results")
  const summaryTarget = document.getElementById("summary-target")
  const summaryIP = document.getElementById("summary-ip")
  const summaryStatus = document.getElementById("summary-status")

  // Tab elements
  const pingTabs = document.querySelectorAll(".ping-tab")
  const pingTabContents = document.querySelectorAll(".ping-tab-content")

  // Chart.js instance
  let pingChart = null

  // Ping data storage
  let currentPingData = null
  let pingHistoryData = []
  let pingIntervalId = null

  // Server locations with coordinates
  const serverLocations = {
    mumbai: {
      name: "Mumbai",
      lat: 19.076,
      lng: 72.8777,
      ip: "103.21.124.45",
    },
    delhi: {
      name: "Delhi",
      lat: 28.6139,
      lng: 77.209,
      ip: "103.27.86.34",
    },
    bangalore: {
      name: "Bangalore",
      lat: 12.9716,
      lng: 77.5946,
      ip: "103.102.234.23",
    },
    chennai: {
      name: "Chennai",
      lat: 13.0827,
      lng: 80.2707,
      ip: "103.224.182.210",
    },
    hyderabad: {
      name: "Hyderabad",
      lat: 17.385,
      lng: 78.4867,
      ip: "103.156.19.65",
    },
    kolkata: {
      name: "Kolkata",
      lat: 22.5726,
      lng: 88.3639,
      ip: "103.194.120.33",
    },
    singapore: {
      name: "Singapore",
      lat: 1.3521,
      lng: 103.8198,
      ip: "103.253.144.18",
    },
    london: {
      name: "London",
      lat: 51.5074,
      lng: -0.1278,
      ip: "103.10.124.99",
    },
  }

  // Initialize ping history from localStorage
  function initPingHistory() {
    const savedHistory = localStorage.getItem("pingHistory")
    if (savedHistory) {
      try {
        pingHistoryData = JSON.parse(savedHistory)
        updatePingHistoryUI()
      } catch (e) {
        console.error("Error parsing ping history:", e)
        pingHistoryData = []
      }
    }
  }

  // Update ping history UI
  function updatePingHistoryUI() {
    if (pingHistoryData.length === 0) {
      pingHistoryElement.innerHTML = '<div class="empty-history">No recent ping history</div>'
      return
    }

    pingHistoryElement.innerHTML = ""

    // Display the most recent 10 entries
    const recentHistory = pingHistoryData.slice(0, 10)

    recentHistory.forEach((item) => {
      const historyItem = document.createElement("div")
      historyItem.className = "history-item"

      const pingClass = getPingClass(item.avgPing)

      historyItem.innerHTML = `
                <div class="history-info">
                    <div class="history-target">${item.target}</div>
                    <div class="history-time">${formatDate(item.timestamp)}</div>
                </div>
                <div class="history-ping">
                    <span class="latency-indicator ${pingClass}"></span>
                    <span class="ping-value">${item.avgPing}ms</span>
                </div>
            `

      historyItem.addEventListener("click", () => {
        pingTarget.value = item.target
        pingForm.dispatchEvent(new Event("submit"))
      })

      pingHistoryElement.appendChild(historyItem)
    })
  }

  // Format date for history
  function formatDate(timestamp) {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  // Get ping class based on latency
  function getPingClass(ping) {
    if (ping < 50) return "excellent"
    if (ping < 100) return "good"
    if (ping < 200) return "fair"
    return "poor"
  }

  // Save ping history to localStorage
  function savePingHistory() {
    localStorage.setItem("pingHistory", JSON.stringify(pingHistoryData))
  }

  // Clear ping history
  function clearPingHistory() {
    pingHistoryData = []
    savePingHistory()
    updatePingHistoryUI()
  }

  // Generate random ping data (simulating actual ping)
  function generatePingData(target, count) {
    const isValidIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(target)
    const isValidDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(target)

    if (!isValidIP && !isValidDomain) {
      return {
        success: false,
        error: "Invalid domain or IP address format",
      }
    }

    // Generate a random IP if the target is a domain
    const ip = isValidIP ? target : generateRandomIP()

    // Get selected locations
    const selectedLocations = []
    document.querySelectorAll('input[name="locations"]:checked').forEach((checkbox) => {
      selectedLocations.push(checkbox.value)
    })

    if (selectedLocations.length === 0) {
      return {
        success: false,
        error: "Please select at least one location",
      }
    }

    const pingData = {
      target: target,
      ip: ip,
      timestamp: Date.now(),
      locations: {},
    }

    // Generate ping data for each selected location
    selectedLocations.forEach((location) => {
      if (serverLocations[location]) {
        const locationData = {
          name: serverLocations[location].name,
          pings: [],
          min: 0,
          avg: 0,
          max: 0,
          loss: 0,
        }

        // Generate random ping times
        for (let i = 0; i < count; i++) {
          // Simulate some packet loss
          const packetLoss = Math.random() < 0.05

          if (packetLoss) {
            locationData.pings.push(null) // null represents packet loss
          } else {
            // Generate a random ping time based on the location
            // Closer locations have lower ping times
            let basePing
            switch (location) {
              case "mumbai":
              case "delhi":
              case "bangalore":
              case "chennai":
              case "hyderabad":
              case "kolkata":
                basePing = 20 + Math.random() * 30 // 20-50ms for Indian locations
                break
              case "singapore":
                basePing = 50 + Math.random() * 50 // 50-100ms for Singapore
                break
              case "london":
                basePing = 150 + Math.random() * 100 // 150-250ms for London
                break
              default:
                basePing = 100 + Math.random() * 100 // 100-200ms for other locations
            }

            // Add some jitter
            const jitter = Math.random() * 20 - 10 // -10 to +10ms
            const pingTime = Math.round(basePing + jitter)

            locationData.pings.push(pingTime)
          }
        }

        // Calculate statistics
        const validPings = locationData.pings.filter((ping) => ping !== null)
        locationData.loss = Math.round(
          ((locationData.pings.length - validPings.length) / locationData.pings.length) * 100,
        )

        if (validPings.length > 0) {
          locationData.min = Math.min(...validPings)
          locationData.max = Math.max(...validPings)
          locationData.avg = Math.round(validPings.reduce((sum, ping) => sum + ping, 0) / validPings.length)
        }

        pingData.locations[location] = locationData
      }
    })

    // Calculate overall average ping
    let totalPings = 0
    let pingSum = 0

    Object.values(pingData.locations).forEach((location) => {
      const validPings = location.pings.filter((ping) => ping !== null)
      totalPings += validPings.length
      pingSum += validPings.reduce((sum, ping) => sum + ping, 0)
    })

    pingData.avgPing = totalPings > 0 ? Math.round(pingSum / totalPings) : 0

    return {
      success: true,
      data: pingData,
    }
  }

  // Generate a random IP address
  function generateRandomIP() {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
  }

  // Display ping results
  function displayPingResults(pingData) {
    // Update summary
    summaryTarget.textContent = pingData.target
    summaryIP.textContent = pingData.ip

    // Determine overall status
    const avgPings = Object.values(pingData.locations).map((location) => location.avg)
    const maxAvgPing = Math.max(...avgPings)

    let statusClass = "online"
    let statusText = "Online"

    if (maxAvgPing > 200) {
      statusClass = "warning"
      statusText = "High Latency"
    }

    summaryStatus.innerHTML = `<span class="status-indicator ${statusClass}"></span> ${statusText}`

    // Update table
    pingTableBody.innerHTML = ""

    Object.entries(pingData.locations).forEach(([locationKey, locationData]) => {
      const row = document.createElement("tr")

      const pingClass = getPingClass(locationData.avg)

      row.innerHTML = `
                <td>${locationData.name}</td>
                <td>${locationData.min}</td>
                <td>${locationData.avg}</td>
                <td>${locationData.max}</td>
                <td>${locationData.loss}%</td>
                <td>
                    <div class="ping-status-cell">
                        <span class="latency-indicator ${pingClass}"></span>
                        <span>${getPingStatusText(locationData.avg)}</span>
                    </div>
                </td>
            `

      pingTableBody.appendChild(row)
    })

    // Update chart
    updatePingChart(pingData)

    // Update log
    updatePingLog(pingData)

    // Show results
    pingStatus.classList.add("hidden")
    pingResults.classList.remove("hidden")

    // Enable export button
    exportResults.disabled = false

    // Add to history
    addToHistory(pingData)
  }

  // Get ping status text based on latency
  function getPingStatusText(ping) {
    if (ping < 50) return "Excellent"
    if (ping < 100) return "Good"
    if (ping < 200) return "Fair"
    return "Poor"
  }

  // Update ping chart
  function updatePingChart(pingData) {
    const ctx = document.getElementById("ping-chart").getContext("2d")

    // Destroy existing chart if it exists
    if (pingChart) {
      pingChart.destroy()
    }

    // Prepare data for chart
    const datasets = []
    const labels = Array.from(
      { length: pingData.locations[Object.keys(pingData.locations)[0]].pings.length },
      (_, i) => `Ping ${i + 1}`,
    )

    // Color palette for different locations
    const colors = [
      "rgba(75, 192, 192, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(255, 99, 132, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(199, 199, 199, 1)",
      "rgba(83, 102, 255, 1)",
    ]

    // Create datasets for each location
    Object.entries(pingData.locations).forEach(([locationKey, locationData], index) => {
      datasets.push({
        label: locationData.name,
        data: locationData.pings,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace("1)", "0.2)"),
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.1,
      })
    })

    // Create chart
    pingChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Ping Time (ms)",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: `Ping Results for ${pingData.target}`,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw
                if (value === null) {
                  return `${context.dataset.label}: Packet Loss`
                }
                return `${context.dataset.label}: ${value}ms`
              },
            },
          },
        },
      },
    })
  }

  // Update ping log
  function updatePingLog(pingData) {
    pingLog.innerHTML = ""

    // Add log entries for each location
    Object.entries(pingData.locations).forEach(([locationKey, locationData]) => {
      // Add header for location
      const locationHeader = document.createElement("div")
      locationHeader.className = "log-entry"
      locationHeader.innerHTML = `<span class="log-location">${locationData.name}</span> - Min: ${locationData.min}ms, Avg: ${locationData.avg}ms, Max: ${locationData.max}ms, Loss: ${locationData.loss}%`
      pingLog.appendChild(locationHeader)

      // Add individual ping results
      locationData.pings.forEach((ping, index) => {
        const logEntry = document.createElement("div")
        logEntry.className = "log-entry"

        const timestamp = new Date(pingData.timestamp + index * 1000).toLocaleTimeString()

        if (ping === null) {
          logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> <span class="log-location">${locationData.name}</span>: <span class="log-error">Request timed out</span>`
        } else {
          logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> <span class="log-location">${locationData.name}</span>: <span class="log-success">Reply from ${serverLocations[locationKey].ip}: time=${ping}ms</span>`
        }

        pingLog.appendChild(logEntry)
      })

      // Add separator
      const separator = document.createElement("div")
      separator.className = "log-entry"
      separator.innerHTML = "---"
      pingLog.appendChild(separator)
    })
  }

  // Add ping data to history
  function addToHistory(pingData) {
    const historyItem = {
      target: pingData.target,
      timestamp: pingData.timestamp,
      avgPing: pingData.avgPing,
    }

    pingHistoryData.unshift(historyItem)

    // Keep only the most recent 20 entries
    if (pingHistoryData.length > 20) {
      pingHistoryData = pingHistoryData.slice(0, 20)
    }

    savePingHistory()
    updatePingHistoryUI()
  }

  // Export results as CSV
  function exportResultsAsCSV(pingData) {
    if (!pingData) return

    let csv = "Location,Min (ms),Avg (ms),Max (ms),Loss (%)\n"

    Object.values(pingData.locations).forEach((location) => {
      csv += `${location.name},${location.min},${location.avg},${location.max},${location.loss}\n`
    })

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `ping_results_${pingData.target}_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Perform ping test
  function performPingTest() {
    const target = pingTarget.value.trim()
    const count = Number.parseInt(pingCount.value)
    const intervalTime = Number.parseFloat(pingIntervalSelect.value) * 1000

    if (!target) {
      alert("Please enter a domain or IP address")
      return
    }

    // Show loading state
    pingStatus.classList.remove("hidden")
    pingResults.classList.add("hidden")
    pingStatus.innerHTML = `
            <div class="ping-spinner"></div>
            <div class="status-message">Pinging ${target}...</div>
        `

    // Clear any existing interval
    if (pingIntervalId) {
      clearInterval(pingIntervalId)
      pingIntervalId = null
    }

    // Simulate network delay
    setTimeout(() => {
      const result = generatePingData(target, count)

      if (result.success) {
        currentPingData = result.data
        displayPingResults(currentPingData)

        // Set up continuous ping if enabled
        if (continuousPing.checked) {
          pingIntervalId = setInterval(() => {
            const newResult = generatePingData(target, count)
            if (newResult.success) {
              currentPingData = newResult.data
              displayPingResults(currentPingData)
            }
          }, intervalTime)
        }
      } else {
        pingStatus.innerHTML = `
                    <div class="status-message">${result.error}</div>
                `
      }
    }, 1500)
  }

  // Tab switching
  if (pingTabs.length > 0) {
    pingTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const tabId = this.getAttribute("data-tab")

        // Update active tab
        pingTabs.forEach((t) => t.classList.remove("active"))
        this.classList.add("active")

        // Show selected tab content
        pingTabContents.forEach((content) => {
          content.classList.add("hidden")
          if (content.id === tabId) {
            content.classList.remove("hidden")
          }
        })
      })
    })
  }

  // Event listeners
  if (pingForm) {
    pingForm.addEventListener("submit", (e) => {
      e.preventDefault()
      performPingTest()
    })
  }

  if (clearHistory) {
    clearHistory.addEventListener("click", clearPingHistory)
  }

  if (exportResults) {
    exportResults.addEventListener("click", () => {
      exportResultsAsCSV(currentPingData)
    })
  }

  // Premium feature warning
  if (continuousPing) {
    continuousPing.addEventListener("change", function () {
      if (this.checked) {
        alert("Continuous ping is a premium feature. Please upgrade to use this feature.")
        this.checked = false
      }
    })
  }

  // Initialize
  initPingHistory()

  // Initialize map placeholder
  const mapElement = document.getElementById("ping-map")
  if (mapElement) {
    mapElement.textContent = "Interactive map view is available in the Premium plan"
  }
})
