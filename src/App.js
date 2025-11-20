import HeroSection from './HeroSection';
import ShowtimeSchedule from './ShowtimeSchedule';
import VenueSection from './VenueSection';
import PartyFooter from './PartyFooter';
import DomeGallery from './DomeGallery';
import './App.css';

export default function App() {
  console.log('App component is rendering');
  
  return (
    <div className="App">
      {/* Hero Section with Ghost Cursor Effect */}
      <HeroSection />

      {/* Showtime Schedule Section */}
      <ShowtimeSchedule />

      {/* Gallery Title Section */}
      <section className="gallery-header-section">
        <h1 className="gallery-title">
          <span className="gallery-title-glow">Frames of Friendship & Fun</span>
        </h1>
      </section>

      {/* Gallery Section - Full viewport */}
      <section style={{ width: '100vw', height: '100vh' }}>
        <DomeGallery grayscale={false} />
      </section>

      {/* Venue Section */}
      <VenueSection
        title="Venue Details"
        date="November 21, 2025"
        time="7:30 AM - 6:00 PM"
        venueName="K.V.G Samudaya Bhavana"
        venueAddress="Right where the vibes are 🔥"
        description="Join us for an unforgettable evening of celebration! Experience amazing performances, delicious food, exciting games, and create memories that will last a lifetime. Don't miss this spectacular welcome party for our new CS family!"
        mapEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62422.58932394712!2d75.3708693!3d12.5568038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba4f25075dd907f%3A0x2183d1361d09098c!2sK.V.G%20Samudaya%20Bhavana!5e0!3m2!1sen!2sin!4v1732000000000!5m2!1sen!2sin"
        directions={[
          { icon: "🚌", text: "College buses available from 8:45–9:15 AM (10-minute journey)" },
          { icon: "🛵", text: "5-minute ride from College Campus" },
          { icon: "🅿️", text: "Parking available in Samudaya Bhavana" }
        ]}
      />

      {/* Footer Section */}
      <PartyFooter
        collegeName="Computer Science Department"
        branchName="K.V.G COLLEGE OF ENGINEERING"
        eventName="AAGAMAN 2025"
        logoSrc="/logo.png"
        contact={null}
        socialLinks={{
          instagram: "https://www.instagram.com/cs_manicz2k22?igsh=cjBndDhhejg1Mnc3",
          youtube: null,
          email: null
        }}
      />
    </div>
  );
}
