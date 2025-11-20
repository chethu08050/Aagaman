import './PartyFooter.css';

export default function PartyFooter({
  collegeName = "Computer Science Department",
  branchName = "Bachelor of Engineering",
  eventName = "Fresher's Party",
  logoSrc = null,
  contact = {
    email: "csdept@college.edu",
    phone: "+91 98765 43210"
  },
  socialLinks = {
    instagram: "https://instagram.com/csdept",
    youtube: "https://youtube.com/@csdept",
    email: "mailto:csdept@college.edu"
  }
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="party-footer">
      {/* Top Neon Border */}
      <div className="footer-border" />

      <div className="footer-container">
        {/* Logo & Brand Section */}
        <div className="footer-brand">
          {logoSrc ? (
            <div className="footer-logo">
              <img src={logoSrc} alt="Logo" />
            </div>
          ) : (
            <div className="footer-logo-placeholder">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" stroke="url(#footerGradient)" strokeWidth="4"/>
                <text x="50" y="58" fontSize="32" fontWeight="700" textAnchor="middle" fill="#fff">
                  CS
                </text>
                <defs>
                  <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}
          
          <div className="footer-brand-text">
            <h3 className="footer-college">{collegeName}</h3>
            <p className="footer-branch">{branchName}</p>
            <p className="footer-event">{eventName}</p>
          </div>
        </div>

        {/* Contact Section */}
        {contact && (
          <div className="footer-contact">
            <h4 className="footer-heading">Get in Touch</h4>
            <div className="footer-contact-items">
              <a href={`mailto:${contact.email}`} className="footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>{contact.email}</span>
              </a>
              <a href={`tel:${contact.phone}`} className="footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>{contact.phone}</span>
              </a>
            </div>
          </div>
        )}

        {/* Social Media Section */}
        <div className="footer-social">
          <h4 className="footer-heading">Follow Us</h4>
          <div className="footer-social-icons">
            {socialLinks.instagram && (
              <a 
                href={socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-icon"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            
            {socialLinks.youtube && (
              <a 
                href={socialLinks.youtube} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-icon"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
            
            {socialLinks.email && (
              <a 
                href={socialLinks.email} 
                className="footer-social-icon"
                aria-label="Email"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Motto Section */}
        <div className="footer-motto">
          <h4 className="footer-heading">CS Manicz Motto</h4>
          <div className="footer-motto-text">
            <p>A new chapter begins with every step you take. Here's to moments that become memories and friends who become family. Welcome to a journey filled with learning, laughter, and limitless possibilities.</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <div className="footer-divider" />
        <p className="footer-copyright">
          © {currentYear} {collegeName}(Seniors). Made with 💜 for CS Freshers.
        </p>
      </div>

      {/* Decorative Glow */}
      <div className="footer-glow" />
    </footer>
  );
}
