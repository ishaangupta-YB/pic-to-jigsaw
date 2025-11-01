# Interactive Jigsaw Puzzle

A web-based interactive jigsaw puzzle game that allows users to upload any image and create a personalized puzzle challenge.

## Features

- **Image Upload**: Drag & drop or browse to upload any image
- **Multiple Difficulty Levels**: Choose from 4x4 (Easy) to 10x10 (Expert) grid sizes
- **Drag & Drop Gameplay**: Intuitive piece manipulation with mouse and touch support
- **Smart Snap-to-Grid**: Pieces automatically snap when placed near correct position
- **Hint System**: Toggle grid overlay to see correct piece positions
- **Progress Tracking**: Real-time statistics showing pieces placed and time elapsed
- **Mobile Responsive**: Optimized for both desktop and mobile devices

## Live Demo

Deploy to Cloudflare Pages for instant hosting!

## Getting Started

### Local Development

Simply open `index.html` in any modern web browser. No build process or dependencies required!

### Deploy to Cloudflare Pages

#### Option 1: Using Wrangler CLI

\`\`\`bash
# Install wrangler (if not already installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the app
npm run deploy
\`\`\`

#### Option 2: Using Cloudflare Dashboard

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Click "Create a project"
3. Connect your Git repository
4. Configure build settings:
   - Build command: (leave empty)
   - Build output directory: \`/\`
5. Click "Save and Deploy"

#### Option 3: Direct Upload

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Click "Create a project" → "Upload assets"
3. Drag and drop the entire project folder
4. Click "Deploy site"

## Project Structure

\`\`\`
pic-to-jigsaw/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All application styles
├── js/
│   ├── app.js             # Main puzzle game logic
│   └── iframe-highlight.js # Iframe element tracking (optional)
├── package.json           # Project metadata and scripts
├── README.md              # This file
└── CLAUDE.md              # Developer guidance for Claude Code
\`\`\`

## How to Play

1. Upload an image by clicking the upload area or dragging an image onto it
2. Select your preferred difficulty level (4x4 to 10x10 pieces)
3. Click "Start Puzzle" to begin
4. Drag puzzle pieces to their correct positions
5. Pieces will snap into place when positioned correctly
6. Use "Show Hint" to see the correct grid layout
7. Complete the puzzle as fast as you can!

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies Used

- HTML5 Canvas for rendering
- Vanilla JavaScript (ES6+)
- CSS3 with responsive design
- No external dependencies

## License

MIT License - feel free to use and modify as needed.
