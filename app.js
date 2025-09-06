// app.js

// Sample fallback data
const sampleData = {
  flights: [
    { airline:"American Airlines", price: 456, duration:"6h 15m" },
    { airline:"Delta",            price: 489, duration:"6h 30m" },
    { airline:"JetBlue",          price: 398, duration:"6h 45m" }
  ],
  hotels: [
    { name:"Budget Inn", price:59, rating:3.8 },
    { name:"City Lodge", price:79, rating:4.1 },
    { name:"Grand Stay", price:129, rating:4.5 }
  ],
  cars: [
    { company:"Hertz",      type:"Economy", price:39 },
    { company:"Avis",       type:"Compact", price:49 },
    { company:"Enterprise", type:"SUV",     price:69 }
  ]
};

// Parse date flexibly into DD/MM/YYYY
function formatDateForKiwi(rawDate) {
  let parts;
  if (rawDate.includes('-')) {
    parts = rawDate.split('-');              // ["YYYY","MM","DD"]
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  } else {
    parts = rawDate.split('/');              // ["MM","DD","YYYY"]
    return `${parts[1]}/${parts[0]}/${parts[2]}`;
  }
}

// 1. Flights via Kiwi API with CORS proxy
async function searchFlights({ from, to, date }) {
  const dateStr = formatDateForKiwi(date);
  const kiwiUrl = new URL('https://api.skypicker.com/flights');
  kiwiUrl.searchParams.set('fly_from', from);
  kiwiUrl.searchParams.set('fly_to', to);
  kiwiUrl.searchParams.set('date_from', dateStr);
  kiwiUrl.searchParams.set('date_to', dateStr);
  kiwiUrl.searchParams.set('partner', 'picky');
  kiwiUrl.searchParams.set('limit', 5);
  kiwiUrl.searchParams.set('curr', 'USD');

  const proxy = 'https://api.allorigins.win/raw?url=';
  try {
    const res = await fetch(proxy + encodeURIComponent(kiwiUrl.toString()));
    if (!res.ok) throw new Error(`Flights error ${res.status}`);
    const data = await res.json();
    return data.data.map(f => ({
      airline: f.airlines[0] || 'N/A',
      price: f.price,
      duration: f.fly_duration
    }));
  } catch (err) {
    console.warn('Kiwi fetch failed, falling back to sample data:', err);
    return sampleData.flights;
  }
}

// 2. Hotels (mock data)
async function searchHotels() {
  return sampleData.hotels;
}

// 3. Cars (mock data)
async function searchCars() {
  return sampleData.cars;
}

// Render results
async function handleSearch() {
  const from      = document.getElementById('from').value.trim();
  const to        = document.getElementById('to').value.trim();
  const date      = document.getElementById('date').value.trim();
  const resultsEl = document.getElementById('results');
  resultsEl.innerHTML = 'Searching…';

  try {
    const [flights, hotels, cars] = await Promise.all([
      searchFlights({ from, to, date }),
      searchHotels(),
      searchCars()
    ]);

    let html = '<h2>Flights</h2><ul>';
    flights.forEach(f => {
      html += `<li>${f.airline}: $${f.price} (${f.duration})</li>`;
    });
    html += '</ul><h2>Hotels</h2><ul>';
    hotels.forEach(h => {
      html += `<li>${h.name}: $${h.price} ★${h.rating}</li>`;
    });
    html += '</ul><h2>Cars</h2><ul>';
    cars.forEach(c => {
      html += `<li>${c.company} ${c.type}: $${c.price}</li>`;
    });
    html += '</ul>';

    resultsEl.innerHTML = html;
  } catch (err) {
    resultsEl.innerHTML = `<p class="error">Unexpected error: ${err.message}</p>`;
  }
}

document.getElementById('searchBtn').addEventListener('click', handleSearch);
