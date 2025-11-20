# 🎉 Fresher's Party Gallery - 3D Dome Experience

An immersive 3D gallery application showcasing Fresher's Party photos and videos with stunning visual effects. Built specifically for Computer Science B.E. students.

![Gallery Preview](https://img.shields.io/badge/React-18.2.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🌟 **Core Features**
- **3D Dome Layout** - Photos and videos arranged in an interactive 3D sphere
- **Smooth Rotation** - Drag to rotate, with automatic cinematic rotation
- **Auto-Pause on Hover** - Rotation pauses when exploring tiles
- **Fullscreen View** - Click tiles to enlarge with smooth animations
- **Video Support** - MP4 videos with audio playback
- **Mobile Responsive** - Optimized for touch devices

### 🎨 **Visual Effects**
1. **Particle System** - 80 animated particles with constellation connections
2. **Dynamic Spotlight** - Follows mouse cursor with glowing effects
3. **Holographic Overlays** - Futuristic scanlines and glitch effects
4. **Chromatic Aberration** - RGB split effect on hover
5. **Neon Glow** - Purple/blue neon borders and shadows
6. **Color-Adaptive Lighting** - Ambient light matches content colors
7. **Audio Visualization** - Real-time frequency bars for videos

### 🚀 **Performance Optimizations**
- Throttled particle animations (50% reduced CPU usage)
- Optimized 3D transforms with RAF scheduling
- Lazy loading for media files
- Reduced rendering load with 25 segments
- Mobile-specific optimizations

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fresher-gallery-app.git

# Navigate to project directory
cd fresher-gallery-app

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 🎯 Usage

1. **Rotation**: Click and drag to rotate the 3D dome
2. **Hover**: Move mouse over tiles to see effects and pause rotation
3. **View**: Click any tile to see fullscreen version
4. **Videos**: Videos play automatically with audio when enlarged
5. **Close**: Click outside the enlarged view or press ESC to close

## 📁 Project Structure

```
fresher-gallery-app/
├── public/
│   └── media/              # Photos and videos (40 files)
├── src/
│   ├── DomeGallery.jsx     # Main 3D gallery component
│   ├── DomeGallery.css     # Styles and animations
│   ├── App.js              # Root component
│   └── index.js            # Entry point
└── package.json
```

## 🛠️ Technologies Used

- **React 18.2.0** - UI framework
- **@use-gesture/react** - Drag/touch interactions
- **Canvas API** - Particle system rendering
- **Web Audio API** - Audio visualization
- **CSS 3D Transforms** - 3D dome layout
- **RequestAnimationFrame** - Smooth 60fps animations

## 🎨 Customization

### Change Gallery Content
Edit `src/DomeGallery.jsx` and update the `DEFAULT_IMAGES` array:

```javascript
const DEFAULT_IMAGES = [
  { src: '/media/your-image.jpg', alt: 'Description' },
  { src: '/media/your-video.mp4', alt: 'Description' }
];
```

### Adjust Visual Effects
Modify constants in `src/DomeGallery.jsx`:

```javascript
const DEFAULTS = {
  segments: 25,              // Number of tiles (lower = better performance)
  dragSensitivity: 15,       // Rotation sensitivity
  enlargeTransitionMs: 250,  // Animation speed
  maxVerticalRotationDeg: 75 // Vertical rotation limit
};
```

### Change Color Scheme
Update CSS variables in `src/DomeGallery.css`:

```css
.sphere-root {
  --adaptive-color: rgb(138, 43, 226); /* Purple */
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%);
}
```

## 📱 Mobile Support

The gallery is fully optimized for mobile devices:
- Touch-enabled rotation
- Reduced particle count
- Simplified animations
- Responsive sizing (480px, 768px breakpoints)
- Touch feedback on tiles

## 🐛 Troubleshooting

**Videos not loading?**
- Ensure videos are in `public/media/` directory
- Check browser console for CORS errors
- Try `preload="auto"` for faster loading

**Performance issues?**
- Reduce `segments` in DEFAULTS (currently 25)
- Lower particle count in particle system code
- Disable effects on hover for mobile

**3D not displaying?**
- Ensure browser supports CSS 3D transforms
- Check `transform-style: preserve-3d` is applied
- Update browser to latest version

## 📄 License

MIT License - feel free to use this project for your own events!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

Created with ❤️ for Computer Science B.E. Fresher's Party 2025

## 🌟 Show Your Support

Give a ⭐️ if you like this project!
