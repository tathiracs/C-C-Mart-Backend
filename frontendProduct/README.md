# C&C Mart - React Frontend

A modern React frontend for C&C Mart grocery shop, featuring a green-themed design perfect for a grocery store.

## Features

- 🛒 Modern grocery shop interface
- 🎨 Beautiful green color theme
- 📱 Responsive design
- 🏪 Product catalog with sample items
- 📄 Multiple pages (Home, Products, About, Contact)
- 🖼️ Product image gallery

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontendProduct
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will be available at http://localhost:3000

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Navigation component
│   └── ProductCard.js     # Product display component
├── pages/
│   ├── Home.js           # Homepage
│   ├── Products.js       # Products listing
│   ├── ProductDetails.js # Product detail view
│   ├── About.js          # About page
│   └── Contact.js        # Contact page
├── data/
│   └── sampleProducts.js # Sample product data
├── assets/               # Image assets
└── App.js               # Main app component
```

## Color Theme

The app uses various shades of green:
- Primary Green: #228B22
- Accent Green: #43a047
- Light Green: #e8f5e9
- Dark Green: #145214
- Success Green: #4caf50

## Sample Products

The frontend includes sample products with placeholder images:
- Basmati Rice
- Anchor Milk
- Elephant House Milk
- Kirisamba Coconut
- Lifebuoy Soap
- Ballpoint Pen

## Note

This is a standalone frontend demo with sample data. It does not connect to the backend API. All product data is stored in `src/data/sampleProducts.js`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)