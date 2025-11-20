import { useEffect, useRef } from 'react';
import './VenueSection.css';

export default function VenueSection({
  title = "Venue & Event Details",
  date = "December 15, 2025",
  time = "6:00 PM - 10:00 PM",
  venueName = "College Auditorium",
  venueAddress = "Main Campus, Building A",
  description = "Join us for an unforgettable evening filled with music, dance, food, and fun! A night to celebrate new beginnings and create lasting memories.",
  mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648750455!2d-73.98823492346654!3d40.74844097138558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
  directions = [
    { icon: "🚌", text: "Take Bus 45 or 67 from Main Gate" },
    { icon: "🚶", text: "5 minutes walk from College Gate 2" },
    { icon: "🅿️", text: "Parking available in Block C" }
  ]
}) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('venue-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const openInMaps = () => {
    const cleanUrl = mapEmbedUrl.replace('/embed?', '/?').split('!')[0];
    window.open(cleanUrl, '_blank');
  };

  return (
    <section ref={sectionRef} className="venue-section">
      <div className="venue-container">
        {/* Title */}
        <h2 className="venue-title">
          <span className="venue-title-glow">{title}</span>
        </h2>

        {/* Event Info Grid */}
        <div className="venue-grid">
          {/* Date & Time Card */}
          <div className="venue-card venue-datetime">
            <div className="venue-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="venue-info">
              <h3>Date & Time</h3>
              <p className="venue-highlight">{date}</p>
              <p className="venue-subtext">{time}</p>
            </div>
          </div>

          {/* Location Card */}
          <div className="venue-card venue-location">
            <div className="venue-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="venue-info">
              <h3>Venue</h3>
              <p className="venue-highlight">{venueName}</p>
              <p className="venue-subtext">{venueAddress}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="venue-description">
          <p>{description}</p>
        </div>

        {/* Map Container */}
        <div className="venue-map-container">
          <div className="venue-map-wrapper">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Venue Location"
              frameBorder="0"
            />
            <div className="venue-map-overlay" />
            <button className="venue-map-cta" onClick={openInMaps}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Open in Maps
            </button>
          </div>
        </div>

        {/* Directions */}
        <div className="venue-directions">
          <h3 className="venue-directions-title">How to Reach</h3>
          <div className="venue-directions-grid">
            {directions.map((direction, index) => (
              <div key={index} className="venue-direction-item">
                <span className="venue-direction-icon">{direction.icon}</span>
                <p>{direction.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="venue-glow venue-glow-1" />
      <div className="venue-glow venue-glow-2" />
    </section>
  );
}
