# PLXBD - Movie Streaming Platform

PLXBD is a modern web application for streaming and downloading movies, TV series, and anime.

## Features

- Modern and responsive UI design
- Movie, TV series, and anime streaming
- Multiple quality download options (480p, 720p, 1080p)
- Dual streaming sources (Gold and Diamond)
- Admin dashboard with content management
- TMDb and IMDb API integration
- Visitor tracking system
- Search functionality
- Trending and latest content sections

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- TMDb API key
- IMDb API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/plxbd.git
cd plxbd
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
- Add your MongoDB connection string
- Set your session and JWT secrets
- Add your TMDb and IMDb API keys

5. Start the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Admin Access

The default admin credentials are:
- Username: admin
- Password: admin

Access the admin panel by navigating to: `http://your-domain/plxbd`

## Project Structure

```
plxbd/
├── models/          # Database models
├── routes/          # Route handlers
├── public/          # Static files
│   ├── css/        # Stylesheets
│   ├── js/         # Client-side JavaScript
│   └── images/     # Images and assets
├── views/          # EJS templates
│   ├── admin/      # Admin panel views
│   └── partials/   # Reusable view components
├── app.js          # Application entry point
└── package.json    # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TMDb for providing movie and TV show data
- IMDb for additional movie information
- All contributors who help improve the platform
