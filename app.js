// TravelAI JavaScript Application

// Sample data from the application
const sampleData = {
  flights: [
    {
      airline: "American Airlines",
      route: "JFK-LAX",
      price: 456,
      points: 25000,
      duration: "6h 15m",
      prediction: "Prices likely to rise 15% in next 3 days",
      confidence: 87,
      departure: "8:30 AM",
      arrival: "11:45 AM",
      stops: "Nonstop"
    },
    {
      airline: "Delta",
      route: "JFK-LAX",
      price: 489,
      points: 28000,
      duration: "6h 30m",
      prediction: "Good time to book",
      confidence: 92,
      departure: "2:15 PM",
      arrival: "5:45 PM",
      stops: "Nonstop"
    },
    {
      airline: "JetBlue",
      route: "JFK-LAX",
      price: 398,
      points: 22000,
      duration: "6h 45m",
      prediction: "Price may drop 8% in 5 days",
      confidence: 73,
      departure: "6:20 PM",
      arrival: "10:05 PM",
      stops: "Nonstop"
    }
  ],
  hotels: [
    {
      name: "Hilton Los Angeles",
      price: 189,
      points: 40000,
      rating: 4.2,
      amenities: ["Pool", "Gym", "WiFi"],
      prediction: "Rates stable",
      confidence: 85
    },
    {
      name: "Marriott Downtown",
      price: 225,
      points: 35000,
      rating: 4.5,
      amenities: ["Spa", "Restaurant", "WiFi"],
      prediction: "Limited availability - book soon",
      confidence: 94
    },
    {
      name: "Holiday Inn Express",
      price: 129,
      points: 25000,
      rating: 4.0,
      amenities: ["Breakfast", "Gym", "WiFi"],
      prediction: "Good value option",
      confidence: 78
    }
  ],
  cars: [
    {
      company: "Hertz",
      type: "Economy",
      price: 45,
      points: 3500,
      prediction: "Standard pricing",
      confidence: 80
    },
    {
      company: "Avis",
      type: "Midsize",
      price: 62,
      points: 4200,
      prediction: "Demand increasing",
      confidence: 76
    },
    {
      company: "Enterprise",
      type: "SUV",
      price: 89,
      points: 6800,
      prediction: "Peak season rates",
      confidence: 88
    }
  ],
  loyaltyPrograms: [
    {
      name: "Chase Ultimate Rewards",
      balance: 125000,
      value: 1.25
    },
    {
      name: "American Express MR",
      balance: 89000,
      value: 1.8
    },
    {
      name: "American Airlines",
      balance: 45000,
      value: 1.4
    },
    {
      name: "Marriott Bonvoy",
      balance: 180000,
      value: 0.8
    }
  ],
  aiInsights: [
    "You typically save 23% by booking flights on Tuesday",
    "Your travel pattern suggests you prefer afternoon departures",
    "You could save $340 by using points for this trip",
    "Price for this route drops 12% in the next 2 weeks historically"
  ]
};

// Current state
let currentSearchType = 'flights';
let currentResults = [];
let currentBookingData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupTabSwitching();
  setupFilterButtons();
  setupScrollEffects();
  
  // Simulate real-time updates
  setInterval(updateDealTimers, 1000);
  
  console.log('TravelAI initialized successfully');
}

// Tab switching functionality
function setupTabSwitching() {
  const tabs = document.querySelectorAll('.search-tab');
  const contents = document.querySelectorAll('.search-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabType = this.getAttribute('data-tab');
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Update active content
      contents.forEach(c => c.classList.remove('active'));
      document.getElementById(`${tabType}-search`).classList.add('active');
      
      currentSearchType = tabType;
    });
  });
}

// Filter button functionality
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filterType = this.getAttribute('data-filter');
      applyFilter(filterType);
    });
  });
}

// Apply filters to results
function applyFilter(filterType) {
  if (currentResults.length === 0) return;
  
  let sortedResults = [...currentResults];
  
  switch(filterType) {
    case 'best-deal':
      sortedResults.sort((a, b) => a.price - b.price);
      break;
    case 'fastest':
      sortedResults.sort((a, b) => {
        const aDuration = parseInt(a.duration);
        const bDuration = parseInt(b.duration);
        return aDuration - bDuration;
      });
      break;
    case 'most-points':
      sortedResults.sort((a, b) => b.points - a.points);
      break;
    case 'ai-recommended':
      sortedResults.sort((a, b) => b.confidence - a.confidence);
      break;
  }
  
  displayResults(sortedResults);
}

// Perform search functionality
function performSearch() {
  const searchBtn = document.querySelector('.search-btn');
  const originalText = searchBtn.innerHTML;
  
  // Show loading state
  searchBtn.innerHTML = '<span class="loading"></span> Searching with AI...';
  searchBtn.disabled = true;
  
  // Simulate API call delay
  setTimeout(() => {
    let results = [];
    
    switch(currentSearchType) {
      case 'flights':
        results = sampleData.flights;
        break;
      case 'hotels':
        results = sampleData.hotels;
        break;
      case 'cars':
        results = sampleData.cars;
        break;
      case 'packages':
        // Combine flight and hotel data for packages
        results = createPackageResults();
        break;
    }
    
    currentResults = results;
    displayResults(results);
    
    // Show results section
    document.getElementById('results').classList.remove('hidden');
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    // Reset button
    searchBtn.innerHTML = originalText;
    searchBtn.disabled = false;
  }, 2000);
}

// Create package results by combining flights and hotels
function createPackageResults() {
  return sampleData.flights.map((flight, index) => {
    const hotel = sampleData.hotels[index % sampleData.hotels.length];
    return {
      ...flight,
      hotel: hotel,
      price: flight.price + hotel.price,
      points: flight.points + hotel.points,
      type: 'package'
    };
  });
}

// Display search results
function displayResults(results) {
  const resultsContainer = document.getElementById('flight-results');
  
  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No results found. Please try different search criteria.</p>';
    return;
  }
  
  let resultsHTML = '';
  
  results.forEach((result, index) => {
    if (currentSearchType === 'flights') {
      resultsHTML += createFlightResultCard(result, index);
    } else if (currentSearchType === 'hotels') {
      resultsHTML += createHotelResultCard(result, index);
    } else if (currentSearchType === 'cars') {
      resultsHTML += createCarResultCard(result, index);
    } else if (currentSearchType === 'packages') {
      resultsHTML += createPackageResultCard(result, index);
    }
  });
  
  resultsContainer.innerHTML = resultsHTML;
  
  // Add click handlers to book buttons
  setupBookingButtons();
}

// Create flight result card HTML
function createFlightResultCard(flight, index) {
  return `
    <div class="result-card">
      <div class="result-header">
        <div class="airline-info">
          <div class="airline-logo">
            <i class="fas fa-plane"></i>
          </div>
          <div class="airline-details">
            <h4>${flight.airline}</h4>
            <p>${flight.route} • ${flight.stops}</p>
          </div>
        </div>
        <div class="price-info">
          <div class="cash-price">$${flight.price}</div>
          <div class="points-price">${flight.points.toLocaleString()} pts</div>
        </div>
      </div>
      
      <div class="result-details">
        <div class="flight-time">
          <div class="time-display">${flight.departure}</div>
          <div class="airport-code">JFK</div>
        </div>
        <div class="flight-duration">
          <i class="fas fa-clock"></i>
          ${flight.duration}
        </div>
        <div class="flight-time">
          <div class="time-display">${flight.arrival}</div>
          <div class="airport-code">LAX</div>
        </div>
      </div>
      
      <div class="ai-prediction">
        <div class="prediction-text">
          <i class="fas fa-brain"></i>
          <span>${flight.prediction}</span>
        </div>
        <div class="confidence-score">${flight.confidence}% confidence</div>
      </div>
      
      <div class="result-actions">
        <button class="btn btn--outline btn--sm" onclick="viewDetails(${index})">
          <i class="fas fa-info-circle"></i> Details
        </button>
        <button class="btn btn--primary book-btn" data-index="${index}" data-type="flight">
          <i class="fas fa-ticket-alt"></i> Book Now
        </button>
      </div>
    </div>
  `;
}

// Create hotel result card HTML
function createHotelResultCard(hotel, index) {
  const stars = '★'.repeat(Math.floor(hotel.rating)) + '☆'.repeat(5 - Math.floor(hotel.rating));
  
  return `
    <div class="result-card">
      <div class="result-header">
        <div class="airline-info">
          <div class="airline-logo">
            <i class="fas fa-bed"></i>
          </div>
          <div class="airline-details">
            <h4>${hotel.name}</h4>
            <p>${stars} (${hotel.rating})</p>
          </div>
        </div>
        <div class="price-info">
          <div class="cash-price">$${hotel.price}/night</div>
          <div class="points-price">${hotel.points.toLocaleString()} pts</div>
        </div>
      </div>
      
      <div class="ai-prediction">
        <div class="prediction-text">
          <i class="fas fa-brain"></i>
          <span>${hotel.prediction}</span>
        </div>
        <div class="confidence-score">${hotel.confidence}% confidence</div>
      </div>
      
      <div class="result-actions">
        <button class="btn btn--outline btn--sm" onclick="viewDetails(${index})">
          <i class="fas fa-info-circle"></i> Details
        </button>
        <button class="btn btn--primary book-btn" data-index="${index}" data-type="hotel">
          <i class="fas fa-bed"></i> Book Now
        </button>
      </div>
    </div>
  `;
}

// Create car result card HTML
function createCarResultCard(car, index) {
  return `
    <div class="result-card">
      <div class="result-header">
        <div class="airline-info">
          <div class="airline-logo">
            <i class="fas fa-car"></i>
          </div>
          <div class="airline-details">
            <h4>${car.company}</h4>
            <p>${car.type}</p>
          </div>
        </div>
        <div class="price-info">
          <div class="cash-price">$${car.price}/day</div>
          <div class="points-price">${car.points.toLocaleString()} pts</div>
        </div>
      </div>
      
      <div class="ai-prediction">
        <div class="prediction-text">
          <i class="fas fa-brain"></i>
          <span>${car.prediction}</span>
        </div>
        <div class="confidence-score">${car.confidence}% confidence</div>
      </div>
      
      <div class="result-actions">
        <button class="btn btn--outline btn--sm" onclick="viewDetails(${index})">
          <i class="fas fa-info-circle"></i> Details
        </button>
        <button class="btn btn--primary book-btn" data-index="${index}" data-type="car">
          <i class="fas fa-car"></i> Book Now
        </button>
      </div>
    </div>
  `;
}

// Create package result card HTML
function createPackageResultCard(pkg, index) {
  return `
    <div class="result-card">
      <div class="result-header">
        <div class="airline-info">
          <div class="airline-logo">
            <i class="fas fa-suitcase"></i>
          </div>
          <div class="airline-details">
            <h4>Flight + Hotel Package</h4>
            <p>${pkg.airline} + ${pkg.hotel.name}</p>
          </div>
        </div>
        <div class="price-info">
          <div class="cash-price">$${pkg.price}</div>
          <div class="points-price">${pkg.points.toLocaleString()} pts</div>
        </div>
      </div>
      
      <div class="ai-prediction">
        <div class="prediction-text">
          <i class="fas fa-brain"></i>
          <span>Package savings: ${Math.round((1 - pkg.price / (pkg.price * 1.15)) * 100)}% off individual bookings</span>
        </div>
        <div class="confidence-score">${pkg.confidence}% confidence</div>
      </div>
      
      <div class="result-actions">
        <button class="btn btn--outline btn--sm" onclick="viewDetails(${index})">
          <i class="fas fa-info-circle"></i> Details
        </button>
        <button class="btn btn--primary book-btn" data-index="${index}" data-type="package">
          <i class="fas fa-suitcase"></i> Book Package
        </button>
      </div>
    </div>
  `;
}

// Setup booking button handlers
function setupBookingButtons() {
  const bookButtons = document.querySelectorAll('.book-btn');
  
  bookButtons.forEach(button => {
    button.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      const type = this.getAttribute('data-type');
      
      openBookingModal(currentResults[index], type);
    });
  });
}

// Open booking modal
function openBookingModal(item, type) {
  currentBookingData = { item, type };
  
  const modal = document.getElementById('booking-modal');
  const summaryContainer = document.getElementById('booking-summary');
  
  let summaryHTML = '';
  
  if (type === 'flight') {
    summaryHTML = `
      <h3>Flight Booking Summary</h3>
      <div class="booking-detail">
        <strong>Airline:</strong> ${item.airline}<br>
        <strong>Route:</strong> ${item.route}<br>
        <strong>Duration:</strong> ${item.duration}<br>
        <strong>Departure:</strong> ${item.departure}<br>
        <strong>Arrival:</strong> ${item.arrival}
      </div>
    `;
  } else if (type === 'hotel') {
    summaryHTML = `
      <h3>Hotel Booking Summary</h3>
      <div class="booking-detail">
        <strong>Hotel:</strong> ${item.name}<br>
        <strong>Rating:</strong> ${item.rating} stars<br>
        <strong>Amenities:</strong> ${item.amenities.join(', ')}<br>
        <strong>Check-in:</strong> Sep 15, 2025<br>
        <strong>Check-out:</strong> Sep 22, 2025
      </div>
    `;
  } else if (type === 'car') {
    summaryHTML = `
      <h3>Car Rental Summary</h3>
      <div class="booking-detail">
        <strong>Company:</strong> ${item.company}<br>
        <strong>Car Type:</strong> ${item.type}<br>
        <strong>Pick-up:</strong> Sep 15, 2025<br>
        <strong>Return:</strong> Sep 22, 2025<br>
        <strong>Location:</strong> LAX Airport
      </div>
    `;
  } else if (type === 'package') {
    summaryHTML = `
      <h3>Package Booking Summary</h3>
      <div class="booking-detail">
        <strong>Flight:</strong> ${item.airline} ${item.route}<br>
        <strong>Hotel:</strong> ${item.hotel.name}<br>
        <strong>Duration:</strong> 7 days<br>
        <strong>Travel Dates:</strong> Sep 15-22, 2025
      </div>
    `;
  }
  
  summaryContainer.innerHTML = summaryHTML;
  modal.classList.remove('hidden');
  
  // Setup payment tab switching
  setupPaymentTabs();
}

// Setup payment tab switching
function setupPaymentTabs() {
  const tabs = document.querySelectorAll('.payment-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Here you could update the payment comparison based on the selected tab
      console.log('Payment method changed to:', this.getAttribute('data-payment'));
    });
  });
}

// Complete booking function
function completeBooking() {
  if (!currentBookingData) return;
  
  const button = document.querySelector('#booking-modal .btn--primary');
  const originalText = button.innerHTML;
  
  button.innerHTML = '<span class="loading"></span> Processing...';
  button.disabled = true;
  
  setTimeout(() => {
    alert('Booking confirmed! You will receive a confirmation email shortly.');
    hideBookingModal();
    
    button.innerHTML = originalText;
    button.disabled = false;
  }, 2000);
}

// Modal functions
function showProfile() {
  document.getElementById('profile-modal').classList.remove('hidden');
}

function hideProfile() {
  document.getElementById('profile-modal').classList.add('hidden');
}

function hideBookingModal() {
  document.getElementById('booking-modal').classList.add('hidden');
  currentBookingData = null;
}

// View details function
function viewDetails(index) {
  const item = currentResults[index];
  let details = '';
  
  if (currentSearchType === 'flights') {
    details = `
      Flight Details:
      Airline: ${item.airline}
      Route: ${item.route}
      Duration: ${item.duration}
      Departure: ${item.departure}
      Arrival: ${item.arrival}
      AI Prediction: ${item.prediction}
      Confidence: ${item.confidence}%
    `;
  } else if (currentSearchType === 'hotels') {
    details = `
      Hotel Details:
      Name: ${item.name}
      Rating: ${item.rating} stars
      Amenities: ${item.amenities.join(', ')}
      AI Prediction: ${item.prediction}
      Confidence: ${item.confidence}%
    `;
  } else if (currentSearchType === 'cars') {
    details = `
      Car Details:
      Company: ${item.company}
      Type: ${item.type}
      AI Prediction: ${item.prediction}
      Confidence: ${item.confidence}%
    `;
  }
  
  alert(details);
}

// Update deal timers
function updateDealTimers() {
  const timers = document.querySelectorAll('.deal-timer span');
  
  timers.forEach((timer, index) => {
    const currentText = timer.textContent;
    if (currentText.includes('h') && currentText.includes('m')) {
      // Simulate countdown - this is just for demo
      const matches = currentText.match(/(\d+)h (\d+)m/);
      if (matches) {
        let hours = parseInt(matches[1]);
        let minutes = parseInt(matches[2]);
        
        minutes--;
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        
        if (hours >= 0) {
          timer.textContent = `Expires in ${hours}h ${minutes}m`;
        } else {
          timer.textContent = 'Deal expired';
          timer.style.color = 'var(--color-text-secondary)';
        }
      }
    } else if (currentText.includes('d') && currentText.includes('h')) {
      // Handle day/hour countdown
      const matches = currentText.match(/(\d+)d (\d+)h/);
      if (matches) {
        let days = parseInt(matches[1]);
        let hours = parseInt(matches[2]);
        
        hours--;
        if (hours < 0) {
          hours = 23;
          days--;
        }
        
        if (days >= 0) {
          timer.textContent = `Expires in ${days}d ${hours}h`;
        }
      }
    }
  });
}

// Scroll effects
function setupScrollEffects() {
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.style.background = 'rgba(var(--color-surface-rgb), 0.95)';
    } else {
      header.style.background = 'var(--color-surface)';
    }
  });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Close modals when clicking outside
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal__backdrop')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
});

// Keyboard navigation for modals
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const visibleModal = document.querySelector('.modal:not(.hidden)');
    if (visibleModal) {
      visibleModal.classList.add('hidden');
    }
  }
});

// Initialize AI insights animation
function initializeInsights() {
  const insightCards = document.querySelectorAll('.insight-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.opacity = '1';
        }, index * 100);
      }
    });
  });
  
  insightCards.forEach(card => {
    card.style.transform = 'translateY(20px)';
    card.style.opacity = '0';
    card.style.transition = 'all 0.5s ease';
    observer.observe(card);
  });
}

// Call insights animation after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeInsights);

// Export functions for global access (if needed)
window.performSearch = performSearch;
window.showProfile = showProfile;
window.hideProfile = hideProfile;
window.hideBookingModal = hideBookingModal;
window.viewDetails = viewDetails;
window.completeBooking = completeBooking;