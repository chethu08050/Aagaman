import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './ShowtimeSchedule.css';

const eventsData = [
  { icon: "🏎️💨", title: "Rally", time: "7:30 AM – 8:00 AM", angle: 0, gradient: "gradient-orange", description: "Rally to start the freshers' day.", venue: "College Campus", coordinator: "Srijan, Madan" },
  { icon: "🏛️", title: "In Front of the College", time: "8:00 AM – 8:20 AM", angle: 30, gradient: "gradient-purple", description: "Gather and brief students in front of the college.", venue: "College Front Gate", coordinator: "Nishanth, Chinmay" },
  { icon: "💥", title: "Flash Mob & Banner Launch", time: "8:20 AM – 8:45 AM", angle: 60, gradient: "gradient-coral", description: "Flash mob performance and official banner launch.", venue: "College Campus", coordinator: "Vishal, Krishna, Chaithanya" },
  { icon: "🚌", title: "Transportation to the Hall", time: "8:45 AM – 9:15 AM", angle: 90, gradient: "gradient-pink", description: "Move participants from campus to event hall.", venue: "Campus to Event Hall", coordinator: "Yuvaraj, Hazeez" },
  { icon: "🎉", title: "Welcoming the Freshers", time: "9:15 AM – 9:45 AM", angle: 120, gradient: "gradient-pink-light", description: "Official welcome and short speeches by 3rd year team.", venue: "Event Hall", coordinator: "Gouthami, Likhitha, Janani, Swathi" },
  { icon: "🎭", title: "Cultural Events (Morning)", time: "9:45 AM – 10:30 AM", angle: 150, gradient: "gradient-pink-purple", description: "Group Dance (2nd year A — 5 mins) • Solo Song (2nd year A — 3 mins) • Dialogue performance with different emotions (15–20 members — 15 mins) • Group Dance (2nd year C — 5 mins)", venue: "Event Hall Stage", coordinator: "Brunda, Rithika" },
  { icon: "🎓", title: "Formal Function", time: "10:30 AM – 12:00 PM", angle: 180, gradient: "gradient-red", description: "Official addresses, awards, and guest speeches.", venue: "Event Hall", coordinator: "Jnanasiri, Karthika, Thrishali" },
  { icon: "🎪", title: "Cultural Events (Midday)", time: "12:00 PM – 12:45 PM", angle: 210, gradient: "gradient-purple-dark", description: "Biscuit Game (15 members — 15 mins) • Group Dance (3rd year A — 3 mins) • You Make the Face I Make the Sound (15 members — 15 mins) • Group song (3rd year B — 3 mins)", venue: "Event Hall Stage", coordinator: "Nandan, Pranamya" },
  { icon: "🍽️", title: "Lunch Break", time: "12:45 PM – 1:30 PM", angle: 240, gradient: "gradient-red-pink", description: "Lunch for participants and guests.", venue: "Dining Hall", coordinator: "Rakshith, Darshan Alva" },
  { icon: "🎨", title: "Cultural Events (Afternoon)", time: "1:30 PM – 4:15 PM", angle: 270, gradient: "gradient-teal", description: "Solo song by Abdul Hazeez (4th year — 5 mins) • Balloon Blasting (20 members — 10 mins) • Group Dance (3rd year B — Girls — 4 mins) • Group song by Thrishali and Pooja (4th year — 4 mins) • Freeze Dance (15 members — 10 mins) • Solo Dance by Sadhana (3rd year — 4 mins) • Group Dance (3rd year A — Boys — 5 mins) • Saree Draping (20 members — 15 mins) • Group Dance by Nayana and team (4th year — 4.30 mins) • Solo song by Apeksha (4th year — 3 mins) • Blindfold Makeup (16–18 members — 15 mins) • Group Dance by Priya and team (4th year — 5 mins) • Solo song by BharathRaj (4th year — 5 mins) • Reverse order Challenge (15 members — 10 mins) • Group Dance by Team Unique (4th year — 3 mins) • Solo song by Thrishali (4th year — 4 mins) • Group Dance by CS Girls (4th year — 3 mins) • Pass the Balloon (20 members — 15 mins) • Solo Song by Pooja (4th year — 3 mins) • Powder and card (30 members — 20 mins) • Group Dance by 4th year boys (5 mins)", venue: "Event Hall Stage", coordinator: "Shanmukha, Jyothika" },
  { icon: "☕", title: "Tea Break", time: "4:15 PM – 4:30 PM", angle: 300, gradient: "gradient-yellow", description: "Short refreshment break.", venue: "Refreshment Area", coordinator: "Amarjith, Prajwal" },
  { icon: "🥁", title: "Water Drums", time: "4:30 PM – 6:00 PM", angle: 330, gradient: "gradient-blue", description: "Closing performance / Water drums finale.", venue: "Event Hall Stage", coordinator: "Srijan, Chethan Kumar" },
];

const getOrbitRadius = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const minDimension = Math.min(width, height);
  if (width <= 360) return minDimension * 0.22;
  if (width <= 480) return minDimension * 0.24;
  if (width <= 768) return minDimension * 0.26;
  if (width <= 1024) return 320;
  if (width <= 1440) return 400;
  if (width <= 1920) return 450;
  return 500;
};

const calculatePosition = (angle, radius) => {
  const angleRad = (angle - 90) * (Math.PI / 180);
  const x = radius * Math.cos(angleRad);
  const y = radius * Math.sin(angleRad);
  return { x, y };
};

export default function ShowtimeSchedule() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState([]);
  const [revealedEvents, setRevealedEvents] = useState([]);
  const [orbitRotation, setOrbitRotation] = useState(0);
  const [cardPositions, setCardPositions] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const orbitRef = useRef(null);

  useEffect(() => {
    const updatePositions = () => {
      const radius = getOrbitRadius();
      const positions = eventsData.map((event) => calculatePosition(event.angle, radius));
      setCardPositions(positions);
    };
    updatePositions();
    const handleResize = () => updatePositions();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const sortedIndices = eventsData.map((event, index) => ({ index, angle: event.angle }))
      .sort((a, b) => a.angle - b.angle).map((item) => item.index);
    let currentStep = 0;
    setVisibleCards([sortedIndices[0]]);
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= sortedIndices.length) {
        clearInterval(interval);
        return;
      }
      setVisibleCards((prev) => [...prev, sortedIndices[currentStep]]);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let animationFrameId;
    let startTime = null;
    const rotate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rotationSpeed = 0.006;
      const rotation = (elapsed * rotationSpeed) % 360;
      setOrbitRotation(rotation);
      animationFrameId = requestAnimationFrame(rotate);
    };
    const startTimer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(rotate);
    }, 3800);
    return () => {
      clearTimeout(startTimer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const checkEventTimes = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const revealed = [];
      let latestEventIndex = 0;
      eventsData.forEach((event, index) => {
        const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)/);
        if (timeMatch) {
          let eventHour = parseInt(timeMatch[1]);
          const eventMinute = parseInt(timeMatch[2]);
          const period = timeMatch[3];
          if (period === "PM" && eventHour !== 12) eventHour += 12;
          else if (period === "AM" && eventHour === 12) eventHour = 0;
          if (currentHour > eventHour || (currentHour === eventHour && currentMinute >= eventMinute)) {
            revealed.push(index);
            latestEventIndex = index;
          }
        }
      });
      if (revealed.length === 0) {
        setRevealedEvents([]);
        setCurrentEventIndex(0);
      } else {
        setRevealedEvents(revealed);
        setCurrentEventIndex(latestEventIndex);
      }
    };
    checkEventTimes();
    const interval = setInterval(checkEventTimes, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (index) => {
    setCurrentEventIndex(index);
    setSelectedEvent(eventsData[index]);
  };

  return (
    <section className="showtime-section">
      <h1 className="showtime-heading">Moments to Come</h1>
      <div className="showtime-container-orbit">
        <div className="showtime-orbit-wrapper">
          <div className="showtime-center-bubble">
            <div className="showtime-glow-ring"></div>
            <div className="showtime-bubble-content">
              <div className="showtime-event-icon">{eventsData[currentEventIndex].icon}</div>
              <div className="showtime-current-label">CURRENT EVENT</div>
              <h2 className="showtime-event-title">{eventsData[currentEventIndex].title}</h2>
              <p className="showtime-event-time">{eventsData[currentEventIndex].time}</p>
            </div>
          </div>

          <div ref={orbitRef} className="showtime-orbit-container" style={{ transform: `rotate(${orbitRotation}deg)` }}>
            {eventsData.map((event, index) => (
              <EventCard
                key={index}
                event={event}
                index={index}
                visible={visibleCards.includes(index)}
                revealed={revealedEvents.includes(index)}
                position={cardPositions[index] || { x: 0, y: 0 }}
                rotation={-orbitRotation}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </section>
  );
}

function EventCard({ event, index, visible, revealed, position, rotation, onCardClick }) {
  const cardRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (visible && cardRef.current && !hasAnimated.current) {
      hasAnimated.current = true;
      // GSAP animation with back.out easing for pop-in effect
      gsap.fromTo(
        cardRef.current,
        {
          scale: 0,
          opacity: 0,
          x: 0,
          y: 0,
          rotation: 0,
        },
        {
          scale: 1,
          opacity: 1,
          x: position.x,
          y: position.y,
          rotation: rotation,
          duration: 0.6,
          ease: 'back.out(1.5)',
        }
      );
    } else if (visible && cardRef.current && hasAnimated.current) {
      // Smooth continuous updates during rotation
      if (cardRef.current._gsap) {
        gsap.set(cardRef.current, {
          x: position.x,
          y: position.y,
          rotation: rotation,
        });
      }
    }
  }, [visible, position.x, position.y, rotation]);

  return (
    <div
      ref={cardRef}
      className={`showtime-event-card ${visible ? 'visible' : ''}`}
      style={{ opacity: 0 }}
      onClick={() => onCardClick(index)}
    >
      <div className={`showtime-card-content ${event.gradient}`}>
        <div className="showtime-card-icon">{event.icon}</div>
        <h3>{event.title}</h3>
        <p>{event.time}</p>
      </div>
    </div>
  );
}

function EventModal({ event, onClose }) {
  if (!event) return null;
  const formatProgramDetails = (description) => {
    const items = description.split(/[•·]|\d+\)/).filter((item) => item.trim());
    return items;
  };
  const programItems = formatProgramDetails(event.description);
  const isSingleItem = programItems.length <= 1;

  return (
    <div className="showtime-modal-overlay" onClick={onClose}>
      <div className="showtime-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="showtime-modal-close" onClick={onClose}>×</button>
        <div className="showtime-modal-header">
          <div className="showtime-modal-icon">{event.icon}</div>
          <h2 className="showtime-modal-title">{event.title}</h2>
        </div>
        <div className="showtime-modal-body">
          <div className="showtime-modal-section">
            <div className="showtime-section-icon">🕒</div>
            <div className="showtime-section-content">
              <h3>Time</h3>
              <p>{event.time}</p>
            </div>
          </div>
          <div className="showtime-modal-section">
            <div className="showtime-section-icon">📍</div>
            <div className="showtime-section-content">
              <h3>Venue</h3>
              <p>{event.venue}</p>
            </div>
          </div>
          <div className="showtime-modal-section showtime-program-section">
            <div className="showtime-section-icon">📝</div>
            <div className="showtime-section-content">
              <h3>Program Details</h3>
              {isSingleItem ? (
                <p className="showtime-single-item">{event.description}</p>
              ) : (
                <ul className="showtime-program-list">
                  {programItems.map((item, index) => (
                    <li key={index}>{item.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="showtime-modal-section showtime-coordinator-section">
            <div className="showtime-section-icon">👤</div>
            <div className="showtime-section-content">
              <h3>Coordinator</h3>
              <p className="showtime-coordinator-name">{event.coordinator}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
