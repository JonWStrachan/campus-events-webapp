import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category_id: '',
    organizer_id: '',
    description: ''
  });

  useEffect(() => {
    fetch('http://localhost:3001/events')
      .then(res => res.json())
      .then(data => setEvents(data));

    fetch('http://localhost:3001/categories')
      .then(res => res.json())
      .then(data => setCategories(data));

    fetch('http://localhost:3001/organizers')
      .then(res => res.json())
      .then(data => setOrganizers(data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dateOnly = formData.date; // 'YYYY-MM-DD'
    const timeOnly = formData.time; // 'HH:MM'

    const payload = {
      ...formData,
      date: dateOnly,
      time: timeOnly,
      category_id: Number(formData.category_id),
      organizer_id: Number(formData.organizer_id)
    };

    fetch('http://localhost:3001/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => { throw new Error(text); });
        }
        return res.text();
      })
      .then(() => {
        // Refresh events
        fetch('http://localhost:3001/events')
          .then(res => res.json())
          .then(data => setEvents(data));

        setFormData({
          title: '',
          date: '',
          time: '',
          location: '',
          category_id: '',
          organizer_id: '',
          description: ''
        });
      })
      .catch(err => {
        console.error('Error submitting event:', err.message);
      });
  };

  const deleteAllEvents = () => {
    fetch('http://localhost:3001/events', { method: 'DELETE' })
      .then(() => setEvents([]));
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <img src="/uk-logo.png" alt="UK Logo" style={{ height: '60px', marginRight: '1rem' }} />
        <h1 style={{ color: '#005DAA' }}>Campus Events</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', maxWidth: '400px', marginBottom: '2rem' }}>
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <input name="date" type="date" value={formData.date} onChange={handleChange} required />
        <input name="time" type="time" value={formData.time} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />

        <select name="category_id" value={formData.category_id} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select name="organizer_id" value={formData.organizer_id} onChange={handleChange} required>
          <option value="">Select Organizer</option>
          {organizers.map(org => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>

        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="submit" style={{ backgroundColor: '#005DAA', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}>Add Event</button>
          <button
            type="button"
            onClick={deleteAllEvents}
            style={{ backgroundColor: '#005DAA', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}>
            🗑️ Delete All Events
          </button>
        </div>
      </form>

      {events.map(event => (
        <div key={event.id} style={{ background: 'white', padding: '1rem', marginBottom: '1rem', border: '1px solid #ccc', borderLeft: '4px solid #005DAA', borderRadius: '4px' }}>
          <h3>{event.title}</h3>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>

          <p><strong>Time:</strong> {new Date(`1970-01-01T${event.time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}</p>

          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Category:</strong> {event.category}</p>
          <p><strong>Organizer:</strong> {event.organizer}</p>
          <p>{event.description}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
