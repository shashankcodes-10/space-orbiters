# Space Orbiters

> **Original Project:** https://github.com/saswat2004/SPACE_ORBITERS

Space Orbiters is a space-exploration project with React frontends, a Node.js/Express backend, Socket.IO real-time chat, and PostgreSQL persistence.

This repository is based on the original **SPACE_ORBITERS** project above and has been restructured, fixed, and containerized to make the application easier to run, deploy, and maintain.

## Latest Changes — EC2 & DNS-Ready Deployment

The deployment setup was recently reworked to go live behind a real domain on EC2 without exposing multiple ports:

- **Reverse proxy added (`nginx-proxy`)** — a single Nginx container is now the only thing exposed to the internet (port `80`). It routes by path: `/` → `main-app`, `/solar` → `solar-system`, `/chat` → `chatroom`, `/api` & `/socket.io` → `backend`. Full details in [Reverse Proxy & Path-Based Routing](#reverse-proxy--path-based-routing).
- **No more per-app ports** — `main-app`, `solar-system`, and `chatroom` used to be published on host ports `5173`/`5174`/`5175`. They're now internal-only (`expose: 80`), reachable exclusively through `nginx-proxy`.
- **EC2 Security Group simplified** — only **SSH (22)** and **HTTP (80)** need to be open now; the old rules for 5173/5174/5175 can be removed. See [EC2 Deployment](#ec2-deployment).
- **DNS-ready** — once an Elastic IP is attached and a DNS A record points at it, the app is reachable at `http://yourdomain.com/` with no port number needed. See [DNS & Domain Setup](#dns--domain-setup).
- **Builds locally instead of pulling from Docker Hub** — `docker-compose.yml` now builds all four app images directly from their `Dockerfile.multistage` files via `docker compose up -d --build`, so deployment only needs the repo + Docker on the instance. See [Local Multi-Stage Builds](#9-local-multi-stage-builds-no-docker-hub-pull-required).
- **`main-app` assets compressed** — the `assets/` folder dropped from 89 MB to 9.4 MB (video re-encoded, images converted to WebP, GIF converted to video) for faster page loads. See [Frontend Asset Optimization](#11-frontend-asset-optimization).

## Architecture

```text
React main app ───────┐
                      │
React solar system ───┼─── nginx-proxy ───> Node.js + Express + Socket.IO
                      │      (path-based        │
Chat browser ─────────┘       routing)          │ SQL
                                                 ▼
                                            PostgreSQL
```

## Project Structure

```text
SPACE_ORBITERS/
├── frontend/
│   ├── main-app/              # Main React + Vite website
│   ├── solar-system/          # React + Three.js solar-system application
│   └── chatroom/              # HTML/CSS/JS chat client
│
├── backend/
│   ├── src/
│   │   ├── db/                # PostgreSQL connection pool
│   │   ├── routes/            # REST API routes
│   │   ├── socket/            # Socket.IO chat + PostgreSQL persistence
│   │   └── server.js          # Express + Socket.IO entry point
│   ├── package.json
│   ├── Dockerfile
│   └── Dockerfile.multistage
│
├── init/
│   ├── 01-schema.sql          # PostgreSQL schema
│   └── 02-seed.sql            # PostgreSQL seed data
│
├── nginx-proxy/
│   └── default.conf           # Reverse proxy: path-based routing to all services
│
├── docker-compose.yml
└── README.md
```

## System Design — Full Project on EC2 with DevSecOps

The application runs as a single Docker Compose stack on one AWS EC2 (Ubuntu) instance, sitting behind an **Nginx reverse proxy** that is the only container exposed to the internet. The EC2 Security Group only needs two inbound rules: **SSH (22)** and **HTTP (80)** — no more per-frontend ports.

![Space Orbiters AWS deployment architecture](docs/aws-deployment-architecture.png)

**Edge tier** — `nginx-proxy` (host port `80` → container port `80`) is the single public entry point. It routes requests by path to the correct frontend and forwards `/api/` and `/socket.io/` to the backend. See [Reverse Proxy & Path-Based Routing](#reverse-proxy--path-based-routing) below.

**Presentation tier** — `main-app`, `solar-system`, and `chatroom`, each served by their own Nginx inside the container. These containers are **not** published to the host anymore (`expose: 80` only) — they're reachable exclusively through `nginx-proxy` over the internal Docker network.

**Application tier** — the Node.js/Express + Socket.IO backend on port 3000, reachable only inside the Docker network via the service name `backend:3000` — never exposed with a public IP.

**Data tier** — PostgreSQL 16 (Alpine) on port 5432, also internal-only, reachable via `postgres:5432`, with data persisted on the `space-vol` volume mounted at `/var/lib/postgresql/data` so it survives container restarts.

All containers communicate over the `space-orbiters` Docker network by service name rather than by public IP. All application images (`backend`, `main-app`, `solar-system`, `chatroom`) are now **built directly on the EC2 instance** from each service's `Dockerfile.multistage` via `docker compose up --build`, rather than pulled from Docker Hub — see [Run With Docker Compose](#run-with-docker-compose).

The diagram also shows the target Jenkins CI/CD pipeline (GitHub → Jenkins → Build & Test → SonarQube → OWASP Dependency Check → Trivy scans → Docker Hub → EC2 deployment) — as noted in [DevSecOps](#devsecops) below, this pipeline is planned and not yet implemented; the EC2/Docker Compose deployment portion above is what's currently in place.

## Application Preview

The three frontend applications, all served through one domain via the reverse proxy:

#### Main App — `http://yourdomain.com/`

![Main App homepage](docs/main-app-home.png)

#### Solar System — `http://yourdomain.com/solar`

![Solar System dashboard](docs/solar-system-dashboard.png)

#### Chatroom — `http://yourdomain.com/chat`

![Chatroom app](docs/chatroom-app.png)

> **Note:** locally (before DNS is set up), replace `yourdomain.com` with `localhost` — e.g. `http://localhost/solar`. No port number is needed; `nginx-proxy` listens on the default HTTP port 80.

## Improvements and Contributions

This repository contains several changes and improvements made on top of the original project.

### 1. Project Structure

The original project structure was difficult to maintain — each app (`Spaceorbitersmain`, `chatroom`, `spaceorbiterclickplanets`) lived as a loose top-level folder, each with its own duplicate config files (`package.json`, `package-lock.json`), alongside a root-level `package.json`/`package-lock.json` that didn't clearly belong to any single app.

**Before:**

```text
SPACE_ORBITERS/
├── Spaceorbitersmain/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── chatroom/
│   ├── public/
│   ├── utils/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── spaceorbiterclickplanets/
│   └── ...
│
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

The application was reorganized into clear frontend and backend sections instead:

**After:**

```text
frontend/
├── main-app/
├── solar-system/
└── chatroom/

backend/
└── src/
    ├── db/
    ├── routes/
    └── socket/
```

This makes each application easier to develop, containerize, and deploy independently.

### 2. Main App Navigation Fixes

The main application's navigation and routing behavior was fixed so that the different application sections can be accessed correctly.

Changes were made in the main application's components, including:

- `Hero.jsx`
- `Navbar.jsx`

The navigation between the main application and the other application sections was corrected to work properly with the deployed application.

### 3. Deployment and Routing Changes

Hardcoded local development URLs were removed or replaced where required so that the application can run outside the local development environment.

The application was configured to work with the production Docker/Nginx setup and can be deployed on an AWS EC2 instance without depending on `localhost` addresses in the frontend.

### 4. Database Migration: MongoDB → PostgreSQL

The original application used MongoDB. The database layer was changed to **PostgreSQL**.

The backend was updated to:

- Use the `pg` PostgreSQL client.
- Create a PostgreSQL connection pool.
- Read PostgreSQL connection details from environment variables.
- Connect to PostgreSQL through the Docker Compose service name.
- Persist chat and application data in PostgreSQL.

The PostgreSQL database is initialized using SQL files:

```text
init/
├── 01-schema.sql
└── 02-seed.sql
```

The PostgreSQL service uses a persistent Docker volume so database data survives container recreation.

### 5. Backend Environment Configuration

The backend supports PostgreSQL connection configuration through environment variables.

Example:

```text
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=space_orbiters
POSTGRES_USER=space_orbiters
POSTGRES_PASSWORD=change_me
```

The application can also construct a PostgreSQL connection URL from these values.

### 6. Dockerization

Docker support was added for the application components.

Both regular and optimized multi-stage Dockerfiles were added where applicable.

The multi-stage builds separate the build environment from the production runtime environment, keeping unnecessary build dependencies out of the final runtime image.

The production frontend containers use Nginx to serve the built frontend applications.

### 7. Docker Image Optimization

Multi-stage Docker builds were used to significantly reduce the size of the production images by keeping build dependencies out of the final runtime images.

| Image | Before (single-stage) | After (multi-stage) | Size reduction |
|---|---|---|---|
| `front-solar` | 2.75 GB | 33.22 MB | ~98.8% |
| `front-main` | 2.3 GB | 202.4 MB | ~91.2% |
| `front-chat` | 257.21 MB | 18.02 MB | ~93.0% |
| `backend` | 1.61 GB | 164.76 MB | ~89.8% |

The largest gains came from the frontend images — `front-solar` in particular dropped from 2.75 GB to about 33 MB once the Node/npm build toolchain was excluded from the final Nginx-served runtime image. The backend followed the same pattern, cutting roughly 90% of its size by separating the `npm ci` build stage from the final runtime stage.

#### Before Optimization

![Docker image sizes before optimization](docs/docker-image-sizes-before.png)

#### After Multi-Stage Optimization

![Docker image sizes after multi-stage optimization](docs/docker-image-sizes-after.png)

> **Note:** for these screenshots to render on GitHub, the actual image files need to exist at `docs/docker-image-sizes-before.png` and `docs/docker-image-sizes-after.png` in the repo — add a `docs/` folder with these two images if it isn't already committed.

### 8. Docker Compose Deployment

The application is orchestrated using Docker Compose.

The Compose setup contains:

```text
postgres
backend
main-app
solar-system
chatroom
nginx-proxy
```

Only `nginx-proxy` is published to the host — all frontend and backend traffic is routed through it:

```text
nginx-proxy   → 80 (public)
main-app      → internal only (expose: 80)
solar-system  → internal only (expose: 80)
chatroom      → internal only (expose: 80)
```

The backend runs on:

```text
3000
```

and PostgreSQL runs internally on:

```text
5432
```

The services communicate through the Docker network:

```text
space-orbiters
```

The backend connects to PostgreSQL using:

```text
postgres:5432
```

rather than using `localhost`.

### 9. Local Multi-Stage Builds (No Docker Hub Pull Required)

The Compose configuration builds each application image directly from its `Dockerfile.multistage`, rather than pulling prebuilt images from Docker Hub.

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile.multistage

main-app:
  build:
    context: ./frontend/main-app
    dockerfile: Dockerfile.multistage

solar-system:
  build:
    context: ./frontend/solar-system
    dockerfile: Dockerfile.multistage

chatroom:
  build:
    context: ./frontend/chatroom
    dockerfile: Dockerfile.multistage
```

Deployment therefore only requires the repository itself on the EC2 instance — `docker compose up -d --build` builds and starts the complete stack in one command, with no separate push/pull step against Docker Hub needed.

### 10. Reverse Proxy & Path-Based Routing

An `nginx-proxy` service was added as the single public entry point, replacing the old setup where each frontend published its own host port (`5173`/`5174`/`5175`).

`nginx-proxy/default.conf` routes by path:

```text
/            → main-app
/solar/      → solar-system
/chat/       → chatroom
/api/        → backend
/socket.io/  → backend (WebSocket upgrade)
```

To support being served from a subpath, `solar-system` was configured with:

- `vite.config.js` → `base: '/solar/'`, so its built asset URLs resolve correctly under `/solar/`.
- `main.jsx` → `<BrowserRouter basename="/solar">`, so client-side route navigation (e.g. `/profile`) resolves as `/solar/profile`.

`chatroom` required no changes since it already uses relative asset paths.

This means only port `80` (and `443`, once TLS is added) needs to be open on the EC2 instance — see [DNS & Domain Setup](#dns--domain-setup) below.

### 11. Frontend Asset Optimization

Several oversized media assets in `main-app` were compressed without changing what's displayed:

| Asset | Before | After | Change |
|---|---|---|---|
| `earth-bg.mp4` | 81 MB | 8.8 MB | Downscaled to 1280px wide, re-encoded with `libx264 -crf 32` |
| `galaxy.png` → `.webp` | 1.8 MB | 164 KB | Converted to WebP, `-q 80` |
| `background.png` → `.webp` | 1.3 MB | 85 KB | Converted to WebP, `-q 80` |
| `moon-surface-hd.png` → `.webp` | 604 KB | 38 KB | Converted to WebP, `-q 80` |
| `chatbot.png` → `.webp` | 246 KB | 25 KB | Converted to WebP, `-q 80` |
| `logo.png` → `.webp` | 197 KB | 75 KB | Converted to WebP, `-q 80` |
| `wave Gif.gif` → `wave-anim.mp4` | 3.7 MB | 98 KB | GIF converted to a looping muted `<video>` |

**Total `assets/` folder: 89 MB → 9.4 MB.**

`main-app/default.conf` also had gzip compression and long-lived cache headers added for static assets:

```nginx
gzip on;
gzip_types text/plain text/css application/javascript application/json image/svg+xml;
gzip_min_length 1024;

location ~* \.(js|css|png|jpg|jpeg|webp|mp4|webm|svg|ico)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

## Backend API

The backend runs on port `3000`.

- `GET /` — backend information
- `GET /api/health` — backend + PostgreSQL health
- `GET /api/planets` — PostgreSQL planet records
- `GET /api/users` — PostgreSQL users
- `GET /api/messages` — PostgreSQL chat history
- `GET /api/launches` — backend proxy for launch data
- `/chat/` — browser chat client

## PostgreSQL

The application uses PostgreSQL as its persistent database.

The database contains tables for application data such as:

- `users`
- `planets`
- `messages`

Chat messages are persisted in PostgreSQL rather than being kept only in application memory.

PostgreSQL data is stored using the Docker named volume:

```text
space-vol
```

mounted at:

```text
/var/lib/postgresql/data
```

## Run With Docker Compose

Create/configure the environment variables required by the Compose configuration (`.env` — `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT`), then build and start the application:

```bash
docker compose up -d --build
```

This builds all four application images locally from their `Dockerfile.multistage` files and starts the full stack — no Docker Hub pull required.

Check the running services:

```bash
docker compose ps
```

The application is available at:

```text
http://localhost/          → Main App
http://localhost/solar     → Solar System
http://localhost/chat      → Chatroom
```

To rebuild just one service after a code change (instead of the whole stack):

```bash
docker compose up -d --build main-app
```

## EC2 Deployment

1. **Launch an EC2 instance** (Ubuntu, free-tier eligible `t3.micro`/`t4g.micro` is enough to start).

2. **Security Group inbound rules** — only two are needed now:

   | Type | Port | Source |
   |---|---|---|
   | SSH | 22 | Your IP (or `0.0.0.0/0` if you need remote access from anywhere) |
   | HTTP | 80 | `0.0.0.0/0` |

   The old rules for 5173/5174/5175 are no longer needed — remove them if present, since `nginx-proxy` is now the only exposed service.

3. **Install Docker and Docker Compose** on the instance:

```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose-plugin
   sudo usermod -aG docker $USER
   # log out and back in for the group change to apply
```

4. **Copy the project to the instance** (via `git clone`, `scp`, or extracting an uploaded zip), including your `.env` file.

5. **Build and start the stack:**

```bash
   cd SPACE_ORBITERS
   docker compose up -d --build
```

6. **Verify it's reachable** by visiting `http://<your-ec2-public-ip>/` in a browser — you should see the Main App without typing any port number.

## DNS & Domain Setup

Once the app is reachable at `http://<ec2-public-ip>/`, point a domain at it so people can use `http://yourdomain.com/` instead of the raw IP.

1. **Get (or reserve) a static public IP.** EC2's default public IP changes if the instance restarts. Allocate an **Elastic IP** in the EC2 console and associate it with your instance — this keeps the IP fixed. (Note: Elastic IPs are **not free** — AWS charges ~$0.005/hr for any allocated public IPv4 address, attached or not, so release it if you stop using the instance.)

2. **Add a DNS A record** with your domain registrar / DNS provider (Route 53, GoDaddy, Namecheap, Cloudflare, etc.):

   | Type | Name | Value |
   |---|---|---|
   | A | `@` (or `yourdomain.com`) | `<your Elastic IP>` |
   | A | `www` (optional) | `<your Elastic IP>` |

3. **Wait for DNS propagation** (usually a few minutes, can take up to ~48 hours depending on your provider's TTL).

4. **Test it** — `http://yourdomain.com/` should now load the Main App, `http://yourdomain.com/solar` the Solar System app, and `http://yourdomain.com/chat` the Chatroom, all without any port number, since `nginx-proxy` is bound to the default HTTP port 80.

5. **(Optional) Add HTTPS.** For production use, put [Certbot](https://certbot.eff.org/) (Let's Encrypt) in front of `nginx-proxy`, or terminate TLS at an AWS Application Load Balancer / CloudFront distribution pointed at the instance. This isn't set up yet in this repo — it's a natural next step once the domain is live on plain HTTP.

## Data Flow

### Planet Data

```text
Main React frontend
        ↓
GET /api/planets
        ↓
Express backend
        ↓
PostgreSQL
        ↓
planets table
```

### Chat

```text
Chatroom
   ↓
Socket.IO
   ↓
Node.js backend
   ↓
PostgreSQL
   ↓
messages + users
```

### Launch Data

```text
Main React frontend
        ↓
GET /api/launches
        ↓
Node.js backend
        ↓
External launch API
```

External NASA/space resources used by the existing UI remain external resources.

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Three.js
- React Three Fiber
- Material UI
- D3.js
- Axios
- Nginx

### Backend

- Node.js
- Express
- Socket.IO
- PostgreSQL
- `pg`
- CORS
- dotenv

### Database

- PostgreSQL 16
- SQL schema and seed scripts

### DevOps / Deployment

- Docker
- Docker Compose (local multi-stage builds)
- Nginx (frontend serving + reverse proxy / path-based routing)
- AWS EC2
- AWS Elastic IP + DNS A record

## Current Deployment Architecture

```text
                          Internet
                              │
                        DNS A record
                       (yourdomain.com)
                              │
                            :80
                              │
                              ▼
                       ┌─────────────┐
                       │ nginx-proxy │
                       │  (public)   │
                       └──────┬──────┘
              ┌───────────────┼───────────────┬──────────────┐
              │ /              │ /solar         │ /chat        │ /api, /socket.io
              ▼               ▼                ▼              │
        ┌─────────┐     ┌─────────┐     ┌──────────┐          │
        │ Main App│     │  Solar  │     │ Chatroom │          │
        │  Nginx  │     │  Nginx  │     │  Nginx   │          │
        │(internal)│    │(internal)│    │(internal)│          │
        └────┬────┘     └────┬────┘     └────┬─────┘          │
             │               │               │                │
             └───────────────┴───────────────┴────────────────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │   Backend   │
                              │ Node + API  │
                              │    :3000    │
                              └──────┬──────┘
                                     │
                                 PostgreSQL
                                    :5432
                                     │
                                     ▼
                                space-vol
```

All containers run on the Docker network:

```text
space-orbiters
```

`nginx-proxy` is the only container with a published host port (`80`). Every other service uses `expose` and is reachable solely over the internal Docker network.

## DevSecOps

A Jenkins-based DevSecOps pipeline is planned for this project.

The planned pipeline will include:

```text
GitHub
   ↓
Jenkins
   ↓
SonarQube Analysis
   ↓
SonarQube Quality Gate
   ↓
OWASP Dependency Check
   ↓
Trivy Filesystem Scan
   ↓
Docker Image Build
   ↓
Trivy Image Scan
   ↓
Docker Hub
   ↓
EC2 Deployment
```

> Jenkins CI/CD integration is planned and will be added separately.
