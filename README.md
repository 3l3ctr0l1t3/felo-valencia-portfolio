# Felo Valencia - Sound Designer Portfolio

A professional portfolio website for Felo Valencia, a Sound Designer specializing in Film & Television Audio Post-Production.

**Live Site:** https://3l3ctr0l1t3.github.io/felo-valencia-portfolio/

## Tech Stack

- **Framework:** Vue 3 (Composition API)
- **UI Library:** Vuetify 3
- **Build Tool:** Vite
- **Internationalization:** vue-i18n (English/Spanish)
- **Routing:** Vue Router
- **Deployment:** GitHub Pages (via GitHub Actions)

## Project Structure

```
felo-valencia-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/
│   └── images/
│       ├── logo.png            # Site logo (cyan, transparent background)
│       └── projects/           # 60+ project poster images from IMDB
├── src/
│   ├── App.vue                 # Main app component (navbar, footer, theme toggle)
│   ├── main.js                 # Vue app initialization
│   ├── data/
│   │   └── projects.json       # 81 projects data
│   ├── locales/
│   │   ├── en.json             # English translations
│   │   └── es.json             # Spanish translations
│   ├── plugins/
│   │   ├── i18n.js             # vue-i18n configuration
│   │   └── vuetify.js          # Vuetify theme configuration
│   ├── router/
│   │   └── index.js            # Vue Router configuration
│   └── views/
│       ├── Home.vue            # Homepage with hero and featured projects
│       └── Portfolio.vue       # Portfolio page with filtering and pagination
├── index.html
├── package.json
└── vite.config.js              # Vite config with GitHub Pages base URL
```

## Features

### Theme Support
- **Dark Mode:** Deep blue/black gradient backgrounds with cyan accents
- **Light Mode:** Light gray backgrounds with teal accents
- Theme toggle button in header (sun/moon icon)
- Theme preference persists in localStorage

### Internationalization
- Bilingual support: English (EN) and Spanish (ES)
- Language toggle in header
- Language preference persists in localStorage
- Project roles and descriptions are localized

### Portfolio
- **81 projects** from IMDB (films, TV series, documentaries)
- **Filtering** by category: All Projects, Films, TV Series, Documentaries
- **Pagination:** 20 projects per page
- **Sorting:** By year (newest first), then by category priority (Films > TV Series > Documentaries)
- **Project cards** with poster image, title, year, role, and awards preview
- **Project detail dialog** with full description, director, and awards

### Responsive Design
- Mobile-friendly navigation drawer
- Responsive grid layout (1-4 columns based on screen size)
- Adaptive image sizing

## Development

### Prerequisites
- Node.js 18+
- npm

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Local URL: `http://localhost:5173/felo-valencia-portfolio/`

### Build for Production
```bash
npm run build
```
Output directory: `dist/`

### Preview Production Build
```bash
npm run preview
```

## Deployment

The site automatically deploys to GitHub Pages when pushing to the `master` branch.

### GitHub Actions Workflow
- Triggers on push to `master`
- Builds the Vue app
- Deploys to GitHub Pages

### Manual Deployment
1. Build the project: `npm run build`
2. The `dist/` folder contains the static files
3. Deploy to any static hosting service

### Important Configuration
- `vite.config.js` has `base: '/felo-valencia-portfolio/'` for GitHub Pages
- Image paths use `import.meta.env.BASE_URL` to work in both dev and production

## Data Structure

### projects.json
```json
{
  "projects": [
    {
      "id": 1,
      "title": "Project Title",
      "year": 2024,
      "category": "film",          // film, series, documentary
      "image": "/images/projects/project-name.jpg",
      "imdb": "https://www.imdb.com/title/tt1234567/",
      "role": {
        "en": "Dialogue Editor",
        "es": "Editor de Diálogos"
      },
      "description": {
        "en": "English description...",
        "es": "Spanish description..."
      },
      "awards": ["Award 1", "Award 2"],
      "director": "Director Name"
    }
  ]
}
```

### Categories
- `film` - Feature films and short films
- `series` - TV series (displayed as "TV Series")
- `documentary` - Documentary films

## Theme Configuration

### Dark Theme (vuetify.js)
```javascript
{
  background: '#0a0a0f',
  surface: '#12121a',
  'surface-variant': '#1a1a25',
  primary: '#00bcd4',      // Cyan
  secondary: '#e91e63',    // Pink
}
```

### Light Theme (vuetify.js)
```javascript
{
  background: '#f5f5f5',
  surface: '#ffffff',
  'surface-variant': '#e8e8e8',
  primary: '#0097a7',      // Teal
  secondary: '#c2185b',    // Dark pink
}
```

## Utility Scripts

### fetch_all_projects.py
Python script to download project poster images from IMDB.

### merge_projects.py
Python script to merge new projects with existing data while preserving descriptions and awards.

## Adding New Projects

1. Add project data to `src/data/projects.json`
2. Download poster image to `public/images/projects/`
3. Image naming convention: `project-title-lowercase-with-dashes.jpg`
4. Ensure bilingual role and description fields

## Contact Information

- **Email:** info@felovalencia.com
- **LinkedIn:** https://www.linkedin.com/in/felipe-v-129a0596/
- **Instagram:** https://www.instagram.com/felovalencip
- **IMDB:** https://www.imdb.com/name/nm6759619/

## License

All rights reserved. This portfolio and its contents are the property of Felo Valencia.
