# ProgettoEcommerce

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


--------------------------------------------------------------------------------------

# Progetto e-commerce

Mini e-commerce Angular 21 + Node.js/Express + MySQL.

---

## Struttura del progetto

```
progetto-ecommerce/
├── src/                        # Frontend Angular 21
│   ├── app/
│   │   ├── components/         # product-card, cart, checkout, product-detail, product-form
│   │   ├── pages/              # home, login, admin
│   │   ├── services/           # auth, cart, product
│   │   ├── guards/             # admin.guard
│   │   ├── directives/         # esaurito.directive
│   │   └── models/             # product.model
│   └── environments/           # environment.ts, environment.production.ts
├── backend/
│   ├── src/
│   │   ├── config/             # db.js, migrate.js, seed.js
│   │   ├── controllers/        # auth, products, orders
│   │   ├── routes/             # auth, products, orders
│   │   ├── middleware/         # auth.middleware (JWT)
│   │   └── server.js
│   ├── .env                    # variabili d'ambiente (non committare)
│   └── .env.example
├── proxy.conf.json             # proxy /api → backend in sviluppo
└── angular.json
```

---

## Prerequisiti

- **Node.js** >= 20
- **npm** >= 10
- **MySQL** >= 8.0
- **Angular CLI** >= 21: `npm install -g @angular/cli`

---

## Setup Backend

### 1. Installa dipendenze

```bash
cd backend
npm install
```

### 2. Configura il database

Copia il file `.env.example` in `.env` e compila i valori:

```bash
cp .env.example .env
```

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=ecommerce_db

JWT_SECRET=una_stringa_segreta_lunga_e_casuale

CORS_ORIGIN=http://localhost:4200
```

### 3. Crea le tabelle (migration)

```bash
npm run db:migrate
```

Crea il database `ecommerce_db` e le tabelle:
- `products`
- `orders`
- `order_items`
- `admins`

### 4. Popola il database (seed)

```bash
npm run db:seed
```

Inserisce 6 prodotti di esempio e l'utente admin:
- **Username:** `admin`
- **Password:** `admin123`

### 5. Avvia il server

```bash
npm run dev        # sviluppo con nodemon
npm start          # produzione
```

Server in ascolto su `http://localhost:3000`

---

## Setup Frontend

### 1. Installa dipendenze

```bash
cd ..    # dalla root del progetto
npm install
```

### 2. Avvia il frontend

```bash
npm start
```

Angular dev server su `http://localhost:4200`.

Il proxy (`proxy.conf.json`) redirige automaticamente tutte le chiamate `/api/*` verso `http://localhost:3000`.

---

## API Endpoints

### Autenticazione
| Metodo | Endpoint         | Auth  | Descrizione              |
|--------|------------------|-------|--------------------------|
| POST   | `/api/auth/login`| No    | Login admin, ritorna JWT |
| GET    | `/api/auth/me`   | JWT   | Verifica token corrente  |

### Prodotti
| Metodo | Endpoint            | Auth | Descrizione            |
|--------|---------------------|------|------------------------|
| GET    | `/api/products`     | No   | Lista tutti i prodotti |
| GET    | `/api/products/:id` | No   | Dettaglio prodotto     |
| POST   | `/api/products`     | JWT  | Crea prodotto          |
| PUT    | `/api/products/:id` | JWT  | Modifica prodotto      |
| DELETE | `/api/products/:id` | JWT  | Elimina prodotto       |

### Ordini
| Metodo | Endpoint          | Auth | Descrizione            |
|--------|-------------------|------|------------------------|
| POST   | `/api/orders`     | No   | Crea ordine (checkout) |
| GET    | `/api/orders`     | JWT  | Lista ordini (admin)   |
| GET    | `/api/orders/:id` | JWT  | Dettaglio ordine       |

---

## Build produzione

```bash
# Frontend
npm run build:prod
# Output in dist/progetto-ecommerce/

# Backend
cd backend
NODE_ENV=production npm start
```

---

## Note di sicurezza

- Non committare mai il file `backend/.env` — è già in `.gitignore`
- Cambia `JWT_SECRET` con una stringa sicura e casuale in produzione
- Cambia la password admin con `bcryptjs` prima del deploy
