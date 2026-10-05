# Live Design Studio

A self-hosted studio where you can watch an AI agent draw UI live, piece by piece or page by page.

## Architecture

```
Browser (you)
   |  HTTPS
   v
Caddy (public, auto-HTTPS, auth gate)
   |-- /studio/*    -> Studio UI (Vite dev server)
   |-- /api/*       -> FastAPI (auth, agent tools, events, git)
   |-- /ws          -> WebSocket (live updates)
   '-- /preview/*   -> Vite dev server (hot reload)

FastAPI --writes files--> Workspace volume <-- Vite watches
   |                          ^
   |                          '-- git (commit per agent turn)
   '-- WebSocket events --> Browser activity feed

Playwright (headless) --screenshots--> back to the agent
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- A domain name (for production)
- GitHub account (for pushing)

### Development

```bash
# Clone and enter
cd live-preview

# Copy environment example
cp .env.example .env
# Edit .env with your values

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access
# Studio UI: http://localhost/studio/
# API: http://localhost/api/
# Health: http://localhost/health
```

### Production Deployment

1. Set up a VM with Docker
2. Point your domain (e.g., `preview.yourdomain.com`) to the VM
3. Configure `.env` with your domain and secure secrets
4. Run `docker-compose up -d`
5. Caddy will automatically provision HTTPS certificates

## Project Structure

```
live-preview/
├── docker-compose.yml          # Main orchestration
├── Caddyfile                   # Reverse proxy config
├── .env.example                # Environment template
├── .gitignore
├── backend/                    # FastAPI server
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── core/
│       ├── api/
│       ├── services/
│       └── models/
├── workspace/                  # Agent's design project (Vite + React)
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── src/
│       ├── components/
│       ├── layout/
│       ├── sections/
│       ├── styles/
│       └── lib/
└── screenshotter/              # Playwright service
    ├── Dockerfile
    ├── package.json
    └── index.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/auth/me` - Get current user

### Files
- `GET /api/files?path=` - List files
- `GET /api/files/content?path=` - Read file
- `POST /api/files` - Write file
- `PATCH /api/files` - Edit file (patch)
- `DELETE /api/files?path=` - Delete file

### Components
- `GET /api/components` - List available component previews

### Git
- `POST /api/git/commit` - Commit changes
- `GET /api/git/history` - Get commit history
- `POST /api/git/checkout` - Checkout commit

### WebSocket
- `WS /api/ws` - Real-time events (file changes, commits)

## Agent Tools

The FastAPI backend provides these tools for the AI agent:

- `list_files(path)` - Browse workspace
- `read_file(path)` - Read file content
- `write_file(path, content)` - Create/update file
- `edit_file(path, old_string, new_string)` - Patch edit
- `delete_file(path)` - Delete file
- `list_components()` - Discover preview components
- `commit(message)` - Save version
- `screenshot(viewport, component)` - Capture preview

## Component Preview System

Components auto-discover via `*.preview.tsx` files:

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.preview.tsx
├── layout/
│   ├── Header.tsx
│   └── Header.preview.tsx
└── sections/
    ├── Hero.tsx
    └── Hero.preview.tsx
```

Views:
- **Single**: One component full-size
- **Grid**: All components as thumbnails
- **Page**: Sections stacked in order

## Development Workflow

1. Agent receives design request
2. Agent writes/edits files via API
3. Vite detects changes → hot reloads browser
4. WebSocket broadcasts file change events
5. (Optional) Screenshotter captures preview
6. Agent reviews screenshots, iterates
7. Agent commits version

## License

Private project - all rights reserved.