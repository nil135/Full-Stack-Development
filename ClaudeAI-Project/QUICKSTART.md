# Quick Start Guide - EcomStore

## 🎯 Installation Steps

### Step 1: Install Node.js

If you haven't installed Node.js yet:

1. Download from https://nodejs.org/ (LTS version recommended)
2. Run the installer and follow the prompts
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Dependencies

Open PowerShell in the project folder:

```bash
npm install
```

This will install:

- Next.js
- React
- Express.js
- SCSS (sass)
- ESLint
- Other required packages

### Step 3: Start Development

#### Option A: Run Frontend Only

```bash
npm run dev
```

Visit: http://localhost:3000

#### Option B: Run Backend Only

```bash
npm run backend
```

API: http://localhost:5000

#### Option C: Run Both (Recommended)

```bash
npm run dev-all
```

This requires the `concurrently` package (already in dependencies)

## 📱 Testing the Application

### Frontend Features to Test

1. **Home Page** - http://localhost:3000
   - Hero section
   - Featured products grid
   - Navigation bar

2. **Products Page** - http://localhost:3000/products
   - Product listings

3. **Cart Page** - http://localhost:3000/cart
   - Shopping cart functionality

4. **About Page** - http://localhost:3000/about
   - Company information

5. **Contact Page** - http://localhost:3000/contact
   - Contact form

### API Endpoints to Test

Use Postman or visit in browser:

1. Get Products: http://localhost:5000/api/products
2. Health Check: http://localhost:5000/api/health
3. Get Cart: http://localhost:5000/api/cart
4. Get Orders: http://localhost:5000/api/orders

## 🛠️ Common Issues & Solutions

### Issue: npm not recognized

**Solution**: Reinstall Node.js and restart terminal

### Issue: Port 3000 or 5000 already in use

**Solution**:

```bash
# PowerShell - Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or change the port in .env.local
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Issue: Module not found error

**Solution**:

```bash
# Delete node_modules and reinstall
Remove-Item node_modules -Recurse -Force
npm install
```

### Issue: SCSS not compiling

**Solution**: Make sure sass is installed

```bash
npm install --save-dev sass
```

## 📦 Project Dependencies

### Frontend

- next: React framework
- react: UI library
- sass: SCSS compiler

### Backend

- express: Web framework
- cors: Cross-Origin Resource Sharing

### Development

- nodemon: Auto-reload server
- concurrently: Run multiple commands
- eslint: Code quality

## 🚀 Build for Production

### Build Frontend

```bash
npm run build
npm run start
```

### Prepare Backend for Production

```bash
# Set environment variable
$env:NODE_ENV = "production"

# Start server
npm run backend
```

## 📚 File Structure Quick Reference

```
Frontend:
- src/app/ → Pages
- src/components/ → Reusable components
- src/styles/ → SCSS files
- src/utils/ → Helper functions

Backend:
- backend/routes/ → API endpoints
- backend/controllers/ → Business logic
- backend/models/ → Data structures
```

## 💡 Next Steps

1. **Customize Colors** - Edit `src/styles/variables.scss`
2. **Add Products** - Modify mock data in `src/app/page.js`
3. **Add Images** - Put files in `public/` folder
4. **Connect Database** - Replace mock data with real database
5. **Add Payment** - Integrate Stripe or PayPal

## 🆘 Getting Help

1. Check README.md for detailed documentation
2. Review .github/copilot-instructions.md for development guidelines
3. Check Next.js docs: https://nextjs.org/docs
4. Check Express docs: https://expressjs.com

---

**Happy developing! 🎉**
