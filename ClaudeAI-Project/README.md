# EcomStore - Full-Stack Ecommerce Website

A complete ecommerce platform built with Next.js, React, SCSS, and Node.js.

## 🎯 Features

- **Frontend**
  - Modern React components with Next.js
  - Responsive SCSS styling
  - Product listing and details pages
  - Shopping cart functionality
  - Contact and About pages
  - SEO optimized

- **Backend**
  - Express.js REST API
  - Product management
  - Cart handling
  - Order management
  - CORS enabled

- **UI/UX**
  - Clean, modern design
  - Mobile responsive
  - Smooth animations
  - Easy navigation

## 📁 Project Structure

```
ClaudeAI-Project/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.js          # Root layout
│   │   ├── page.js            # Home page
│   │   ├── products/          # Products page
│   │   ├── cart/              # Cart page
│   │   ├── about/             # About page
│   │   └── contact/           # Contact page
│   ├── components/             # React components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── HeroSection.jsx
│   ├── styles/                 # SCSS files
│   │   ├── variables.scss
│   │   ├── globals.scss
│   │   ├── navbar.scss
│   │   ├── home.scss
│   │   └── footer.scss
│   └── utils/                  # Utility functions
│       ├── api.js
│       └── helpers.js
├── backend/
│   ├── server.js              # Express server
│   ├── routes/                # API routes
│   │   ├── products.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── controllers/           # Route controllers
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   └── models/                # Data models
│       ├── Product.js
│       ├── Cart.js
│       └── Order.js
├── public/                    # Static assets
├── package.json               # Dependencies
├── next.config.js            # Next.js config
├── .env.local                # Environment variables
└── .eslintrc.json            # ESLint config
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Navigate to the project directory**

   ```bash
   cd "c:\WORK\LEARN NOW\ClaudeAI-Project"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install additional dependencies**
   ```bash
   npm install --save-dev sass nodemon concurrently
   ```

### Running the Project

#### Option 1: Run frontend only

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

#### Option 2: Run backend only

```bash
npm run backend
```

Backend API will be available at `http://localhost:5000`

#### Option 3: Run both (recommended)

```bash
npm run dev-all
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## 📚 API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart

- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `PUT /api/cart/update/:id` - Update item quantity
- `DELETE /api/cart` - Clear cart

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Cancel order

## 🎨 Styling

The project uses SCSS for styling with:

- Variables for colors and spacing
- Responsive grid system
- Utility classes
- Component-specific styles
- Mobile-first design

## 🔧 Configuration

### Environment Variables (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📦 Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build Next.js for production
- `npm run start` - Start Next.js production server
- `npm run lint` - Run ESLint
- `npm run backend` - Start Express backend
- `npm run dev-backend` - Start backend with nodemon (auto-reload)
- `npm run dev-all` - Run both frontend and backend simultaneously

## 🎓 Learning Resources

This project demonstrates:

- Next.js 14 with App Router
- React hooks and components
- SCSS styling and responsive design
- Express.js REST API
- RESTful API design
- Full-stack development workflow

## 📝 Next Steps

1. **Database Integration**: Replace mock data with a real database (MongoDB, PostgreSQL)
2. **Authentication**: Add user authentication and authorization
3. **Payment Processing**: Integrate payment gateway (Stripe, PayPal)
4. **Search & Filters**: Add advanced product search and filtering
5. **Reviews & Ratings**: Implement user reviews system
6. **Admin Dashboard**: Create admin panel for product management
7. **Deployment**: Deploy to Vercel (frontend) and Heroku/AWS (backend)

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

This project is open source and available under the MIT License.

## 💡 Tips

- Use mock data for development before connecting to a real database
- Test API endpoints using Postman or Thunder Client
- Use browser DevTools for debugging React components
- Check Next.js and Express documentation for advanced features

---

**Happy coding! 🚀**
