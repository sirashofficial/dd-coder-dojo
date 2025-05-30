# Code with Ubuntu Website

A modern, responsive website for Code with Ubuntu - building the next generation of developers through coding education and community engagement.

## 🚀 Quick Start

1. **Start Local Server**:
   ```bash
   # Windows
   .\start-server.ps1
   # or
   python -m http.server 8000
   ```

2. **View Website**:
   - Main site: `http://localhost:8000`
   - Calendar: `http://localhost:8000/community.html`

## 📁 Project Structure

```
├── 📄 Main Pages
│   ├── index.html          # Homepage
│   ├── about.html          # About Us
│   ├── programs.html       # Programs & Classes
│   ├── community.html      # Interactive Calendar
│   ├── gallery.html        # Project Gallery
│   ├── resources.html      # Learning Resources
│   ├── contact.html        # Contact Form
│   └── register.html       # Registration
│
├── 🎨 Styling
│   └── css/
│       ├── main.css        # Core styles
│       ├── enhancements.css
│       └── pages/          # Page-specific styles
│
├── ⚡ Scripts
│   └── js/
│       ├── main.js         # Core functionality
│       ├── components/     # Reusable components
│       ├── pages/          # Page-specific scripts
│       ├── analytics/      # Advanced analytics system
│       ├── business-intelligence/ # BI dashboard with charts
│       ├── user-insights/  # Personalization & behavior tracking
│       ├── ab-testing/     # Statistical testing framework
│       └── data-management/ # Data management layer
│
├── 📊 Data
│   └── data/
│       ├── events.json     # Calendar events
│       ├── programs.json   # Course information
│       └── team.json       # Staff & mentors
│
├── 🖼️ Assets
│   └── images/
│       ├── events/         # Event thumbnails
│       ├── projects/       # Student work
│       └── team/           # Staff photos
│
├── 🏗️ Build & Deploy
│   ├── build/              # Build scripts
│   ├── dist/               # Production files
│   └── archive/            # Test & debug files
│
└── 📚 Documentation
    └── docs/               # Project documentation
```

## ✨ Features

- **📅 Interactive Calendar** - FullCalendar integration with event management
- **📱 Responsive Design** - Mobile-first, accessible interface
- **⚡ PWA Support** - Service worker for offline functionality
- **🎨 Modern UI/UX** - Clean, professional design
- **📊 Advanced Analytics** - Comprehensive data management and insights
- **🧠 Business Intelligence** - Real-time dashboard with Chart.js visualization
- **👤 User Insights** - Personalized recommendations and behavior tracking
- **🧪 A/B Testing** - Statistical testing framework for optimization
- **📈 Performance Monitoring** - User experience and engagement tracking

## 🛠️ Development

### Build Production
```bash
.\build\build-production.ps1
```

### Testing
```bash
.\build\test-website.ps1
```

## 📞 Contact

- **Website**: [Code with Ubuntu](http://localhost:8000)
- **Email**: Contact via website form
- **Community**: Join our coding sessions!

---

*Building the next generation of developers through hands-on coding education and community support.*
