# GitHub Copilot Instructions for EcomStore

## Project Overview

This is a full-stack ecommerce website built with:

- **Frontend**: Next.js 14, React, SCSS
- **Backend**: Node.js, Express.js
- **Architecture**: Modern component-based design with RESTful API

## Key Features

- Product listing and management
- Shopping cart functionality
- Order management
- Contact and informational pages
- Responsive design

## Project Structure

- `/src` - Next.js frontend with React components
- `/backend` - Express.js REST API
- `/src/styles` - SCSS files for styling
- `/public` - Static assets

## Development Guidelines

### Frontend Development

1. Use functional components with hooks
2. Keep components in `/src/components/`
3. Pages go in `/src/app/` following App Router conventions
4. Import SCSS modules for component styles
5. Use utility functions from `/src/utils/`

### Backend Development

1. Follow MVC pattern with routes, controllers, models
2. Add new routes in `/backend/routes/`
3. Controllers handle business logic
4. Models manage data structure
5. Always return JSON responses

### Styling

1. Use SCSS for all styles
2. Reference `/src/styles/variables.scss` for colors and spacing
3. Use grid system from `globals.scss`
4. Follow mobile-first responsive design

### API Integration

1. Use fetch API or axios for backend calls
2. Base URL: `http://localhost:5000/api`
3. Handle errors gracefully
4. Display mock data as fallback

## Running the Project

```bash
# Install dependencies
npm install

# Run frontend only
npm run dev

# Run backend only
npm run backend

# Run both simultaneously
npm run dev-all
```

## File Naming Conventions

- React components: PascalCase (.jsx)
- Utility files: camelCase (.js)
- SCSS files: kebab-case (.scss)
- Routes: lowercase (.js)

## Common Tasks

### Adding a New Page

1. Create file in `/src/app/[pagename]/page.js`
2. Create corresponding SCSS in `/src/styles/[pagename].scss`
3. Add navigation link in Navbar component

### Adding a New API Endpoint

1. Create route in `/backend/routes/`
2. Create controller in `/backend/controllers/`
3. Add model logic if needed in `/backend/models/`
4. Import route in `/backend/server.js`

### Adding a New Component

1. Create file in `/src/components/[ComponentName].jsx`
2. Use 'use client' directive for client components
3. Import SCSS module for styling
4. Export as default

## Best Practices

- Keep components small and focused
- Use meaningful variable and function names
- Add error handling for API calls
- Use environment variables for configuration
- Follow the existing code style
- Add comments for complex logic
- Test components in development mode

## Troubleshooting

- **Port already in use**: Change PORT in .env or kill process on port 3000/5000
- **Module not found**: Run `npm install` to install dependencies
- **CORS issues**: Verify API_URL in .env.local
- **Styles not applying**: Ensure SCSS files are properly imported

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com)
- [SCSS Documentation](https://sass-lang.com)
- [React Documentation](https://react.dev)
