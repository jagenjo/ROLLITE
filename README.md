# ROLLITE

A web-based RPG Session Manager application.

## Features
- **Unified App**: Served by a single Node.js instance.
- **Client**: Lit-based frontend (`src/client`).
- **Server**: Express + Socket.IO server (`src/server`).

## Quick Start

### Development
Run both client and server in watch mode:
```bash
npm run dev
```

### Production
Build and start the application:
```bash
npm run build
npm start
```

## Structure
- `src/client`: Frontend source code.
- `src/server`: Backend source code.
- `dist/`: Compiled output (gitignored).
- `public/`: Static assets.

## Deployment

### Subfolder Configuration
If you deploy this application in a subfolder (e.g., `https://example.com/my-game/`), set the `BASE_PATH` environment variable during build and runtime.

**Linux/Mac:**
```bash
export BASE_PATH=/my-game/
npm run build
npm start
```

**Windows (PowerShell):**
```powershell
$env:BASE_PATH="/my-game/"
npm run build
npm start
```

This ensures assets and socket connections use the correct path prefix. Ensure your reverse proxy is configured to strip the path prefix when forwarding requests to the Node.js server (e.g. `proxy_pass http://localhost:4001/;`).
