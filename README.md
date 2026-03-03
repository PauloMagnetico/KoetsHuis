# KoetsHuis

Een webapplicatie voor het bijhouden van renovatiekosten. Twee personen (Laurens en Julia) kunnen uitgaven registreren, categoriseren en het saldo bekijken — zodat altijd duidelijk is wie wat heeft betaald en wie wat verschuldigd is.

## Wat doet de app?

De app bestaat uit drie pagina's:

- **Overzicht** — toont het totaal uitgegeven bedrag, het aandeel van elke persoon en het actuele saldo (wie is hoeveel verschuldigd aan de ander).
- **Uitgaven** — voeg nieuwe uitgaven toe (omschrijving, bedrag, categorie en betaler) en verwijder bestaande uitgaven.
- **Dashboard** — visuele grafieken met een uitsplitsing per categorie (taartdiagram) en een vergelijking per persoon per categorie (staafdiagram).

### Technische stack

| Onderdeel  | Technologie                        |
|------------|------------------------------------|
| Frontend   | React 19 + TypeScript + Vite       |
| Backend    | Node.js + Express + TypeScript     |
| Database   | MongoDB (via Mongoose)             |
| Container  | Docker + Docker Compose            |

---

## De app starten

### Vereisten

- [Docker](https://www.docker.com/) en Docker Compose geïnstalleerd

### Stap 1 — Repository klonen

```bash
git clone https://github.com/PauloMagnetico/KoetsHuis.git
cd KoetsHuis
```

### Stap 2 — Starten met Docker Compose

```bash
docker compose up --build
```

Dit start drie services:

| Service   | Beschikbaar op              |
|-----------|-----------------------------|
| Frontend  | http://localhost:5174        |
| Backend   | http://localhost:3001        |
| MongoDB   | localhost:27018              |

Open de browser en ga naar [http://localhost:5174](http://localhost:5174).

### Stap 3 — Stoppen

```bash
docker compose down
```

Om ook de opgeslagen data (MongoDB-volume) te verwijderen:

```bash
docker compose down -v
```

---

## Lokaal ontwikkelen (zonder Docker)

### Vereisten

- [Node.js](https://nodejs.org/) v20 of hoger
- Een draaiende MongoDB-instantie (lokaal of via [MongoDB Atlas](https://www.mongodb.com/atlas))

### Frontend

```bash
npm install
npm run dev
```

De frontend is beschikbaar op [http://localhost:5173](http://localhost:5173).

### Backend

```bash
cd server
npm install
npm run dev
```

Stel de omgevingsvariabele in voor de database:

```bash
DB_URL=mongodb://localhost:27017/koetshuis
```
