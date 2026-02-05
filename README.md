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
