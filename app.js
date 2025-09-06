// app.js

// 1. Flights via Kiwi API (no key required)
async function searchFlights({ from, to, date }) {
  const [year, month, day] = date.split('-');
  const dateStr = `${day}/${month}/${year}`;
  const url = new URL('https://api.skypicker.com/flights');
  url.searchParams.set('fly_from', from);
  url.searchParams.set('fly_to', to);
  url.searchParams.set('date_from', dateStr);
  url.searchParams.set('date_to', dateStr);
  url.searchParams.set('partner', 'picky');
  url.searchParams.set('limit', 5);
  url.searchParams.set('curr', 'USD');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Flights error ${res.status}`);
  const data = await res.json();
  return data.data.map(f => ({
    airline: f.airlines[0] || 'N/A',
    price: f.price,
    duration: f.fly_duration,
    departure: new Date(f.dTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    arrival: new Date(f.aTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));
}

// 2. Hotels via mock data
async function searchHotels({ city }) {
  const hotels = [
    { name: 'Budget Inn', price: 59, rating: 3.8 },
    { name: 'City Lodge', price: 79, rating: 4.1 },
    { name: 'Grand Stay', price: 129, rating: 4.5 }
  ];
  return hotels.map(h => ({
    ...h,
    points: Math.round(h.price * 100)
  }));
}

// 3. Cars mock data
async function searchCars() {
  return [
    { company: 'Hertz', type: 'Economy', price: 39 },
    { company: 'Avis', type: 'Compact', price: 49 },
    { company: 'Enterprise', type: 'SUV', price: 69 }
  ];
}

// Handle Search button
async function handleSearch() {
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const date = document.getElementById('date').value;
  const resultsEl = document.getElementById('results');
  resultsEl.innerHTML = 'Searching…';

  try {
    const [flights, hotels, cars] = await Promise.all([
      searchFlights({ from, to, date }),
      searchHotels({ city: to }),
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
    resultsEl.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
}

document.getElementById('searchBtn').addEventListener('click', handleSearch);