# Vue Vite Vuetify Template

🚀 A personal starter template for Vue 3 projects using **Vite** and **Vuetify 3**, ready for **GitHub Pages deployment**.

This repository serves as a foundation for future projects. Clone it, update the content, and deploy quickly without reconfiguring the basics.




## Project Structure

```
src/
├─ assets/          # Images, icons, etc.
├─ components/      # Reusable Vue components (Navbar, etc.)
├─ pages/           # Page components (Home.vue, About.vue, etc.)
├─ plugins/
│   └─ vuetify.js   # Vuetify setup
├─ router/
│   └─ index.js     # Vue Router configuration
└─ App.vue          # Main layout component
vite.config.js      # Vite configuration
```


- **App.vue**: Provides the main layout, includes Navbar, and renders `<router-view>` for pages.  
- **Home.vue**: Contains the start page content, project info, and template instructions.  



## Available Scripts

Command          | Description
-----------------|-------------------------------------------------
yarn dev         | Run the project locally in development mode.
yarn build       | Build the project for production.
yarn preview     | Preview the production build locally.



## Deployment

This template is preconfigured to deploy to **GitHub Pages**.  

### Key Points

- `vite.config.js` uses `base` based on `VITE_BASE_URL`:

base: process.env.VITE_BASE_URL || '/vuetemplate/'

- GitHub Actions workflow automatically builds and pushes to `gh-pages`.  

### Steps

1. Make sure the GitHub repo name matches the base URL:

env:
  VITE_BASE_URL: /vuetemplate/

2. Push to `main` → GitHub Actions deploys the app to:

https://edgar-treischl.github.io/vuetemplate/

3. SPA routing is supported via copying `index.html` to `404.html` in the workflow.


## Customization

- Add new components in `src/components/`.  
- Add new pages in `src/pages/` and register routes in `src/router/index.js`.  
- Update layouts in `App.vue`.  
- Modify Vuetify theme in `src/plugins/vuetify.js`.  
- Update Navbar links in `src/components/Navbar.vue`.



## Useful Links

- Vite Documentation: https://vitejs.dev/  
- Vuetify Documentation: https://vuetifyjs.com/  
- Vue 3 Documentation: https://vuejs.org/  


🎯 This template is designed to help me quickly start new Vue 3 + Vuetify projects with CI/CD setup for GitHub Pages. Copy, modify, and deploy as needed!
