# Dog Placeholder & Card Generator

## Table of Contents

- [Part 1: English Version](#part-1-english-version)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [Technologies Used](#technologies-used)
  - [Installation and Local Development](#installation-and-local-development)
  - [Project Structure](#project-structure)
  - [API Usage and Handling](#api-usage-and-handling)
- [Part 2: Versiunea în Limba Română](#part-2-versiunea-în-limba-română)
  - [Prezentare generală](#prezentare-generală)
  - [Funcționalități principale](#funcționalități-principale)
  - [Tehnologii utilizate](#tehnologii-utilizate)
  - [Instalare și rulare locală](#instalare-și-rulare-locală)
  - [Structura proiectului](#structura-proiectului)
  - [Utilizarea și gestionarea API-ului](#utilizarea-și-gestionarea-api-ului)

---

# Part 1: English Version

## Overview

**Dog Placeholder & Card Generator** is a lightweight, responsive web application for creating custom dog image cards. Users can choose the card dimensions, add a caption or name, fetch a random dog image, and keep a persistent personal history of generated cards.

The application uses the [Dog CEO API](https://dog.ceo/dog-api/) to retrieve random dog images. Images are downloaded in the browser and converted to Base64 Data URLs before they are displayed and stored, so saved cards remain stable after page reloads and do not need to request the same image again.

## Key Features

- Custom card dimensions with configurable width and height in pixels.
- Caption or dog-name input for every generated card.
- Random dog image retrieval through the Dog CEO API.
- Image conversion to Base64/Data URL format for stable previews and persistence.
- Responsive interface built for mobile, tablet, and desktop screens.
- LocalStorage history that persists between browser sessions.
- Display of the current generated card and previously saved cards.
- Delete individual history items or clear the complete history.
- Image download support with sanitized caption-based filenames.
- Accessible form controls, status messages, and native browser validation.
- Error handling for failed network requests, invalid API responses, image conversion failures, and LocalStorage quota limits.
- Automatic removal of the oldest saved items when storage capacity is reached, where possible.

## Technologies Used

- **React** - Component-based UI, state management, form handling, and card actions.
- **Vite** - Local development server and production bundling.
- **CSS3** - Responsive styling using Flexbox, CSS Grid, custom properties, and media queries.
- **LocalStorage API** - Persistent browser-side history for generated cards.
- **Fetch API** - Communication with the Dog CEO image service.
- **FileReader API** - Conversion of downloaded image blobs to Base64 Data URLs.
- **Dog CEO API** - Source of random dog images.

## Installation and Local Development

This is a frontend React project powered by Vite. It does not require a backend server.

### Option 1: VS Code Live Server

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/candidoprisULBS/DogCardGenerator.git
   cd DogCardGenerator
   npm install
   ```

2. Open the project folder in Visual Studio Code.
3. Start the Vite development server:

```bash
npm run dev
```

4. Open the local URL shown in the terminal.

### Production build

Create a production bundle with `npm run build`, then preview it with `npm run preview`.

## Project Structure

```text
DogCardGenerator/
├── index.html       # HTML shell and React mount point
├── src/main.jsx     # React app, API calls, persistence, and card components
├── style.css        # Responsive layout, visual styling, and component states
├── package.json     # React/Vite scripts and dependencies
├── vite.config.js   # Vite React plugin configuration
└── README.md        # Project documentation
```

### Main files

- **`index.html`** provides the document shell and React mount point.
- **`src/main.jsx`** defines the generator form, current-card preview, saved-history area, API calls, LocalStorage persistence, and card actions.
- **`style.css`** provides the responsive Flexbox/Grid layout, visual design, form states, card styles, and mobile/desktop breakpoints.

## API Usage and Handling

The application requests one random image from the Dog CEO API:

```text
GET https://dog.ceo/api/breeds/image/random
```

A successful response contains an image URL:

```json
{
  "message": "https://images.dog.ceo/breeds/example/example.jpg",
  "status": "success"
}
```

The client then:

1. Validates the HTTP response and the API payload.
2. Fetches the returned image URL.
3. Converts the image blob to a Base64 Data URL with `FileReader`.
4. Stores the Data URL with the card metadata in LocalStorage.
5. Reuses the stored image when rendering history, avoiding another random-image request on reload.

Errors are handled without breaking the page. The interface displays a clear status message when the network is unavailable, the API returns an unsuccessful or malformed response, the image cannot be converted, or LocalStorage cannot accept more data. When possible, the oldest saved cards are removed to make room for a new card; if saving still fails, the generated preview remains available while the user is informed that the history could not be saved.

---

# Part 2: Versiunea în Limba Română

## Prezentare generală

**Dog Placeholder & Card Generator** este o aplicație web responsive pentru crearea unor carduri personalizate cu imagini de câini. Utilizatorii pot alege dimensiunile cardului, pot adăuga o legendă sau un nume, pot încărca o imagine aleatorie cu un câine și pot păstra un istoric persistent al cardurilor generate.

Aplicația utilizează [Dog CEO API](https://dog.ceo/dog-api/) pentru a obține imagini aleatorii cu câini. Imaginile sunt descărcate în browser și convertite în Data URL-uri Base64 înainte de afișare și salvare, astfel încât cardurile rămân disponibile după reîncărcarea paginii fără o nouă solicitare pentru aceeași imagine.

## Funcționalități principale

- Dimensiuni personalizate ale cardului, cu lățime și înălțime configurabile în pixeli.
- Câmp pentru legendă sau numele câinelui.
- Încărcarea unei imagini aleatorii prin Dog CEO API.
- Conversia imaginilor în format Base64/Data URL pentru previzualizare și salvare stabilă.
- Interfață responsive pentru telefoane, tablete și desktop.
- Istoric persistent folosind LocalStorage.
- Afișarea cardului generat curent și a cardurilor salvate anterior.
- Ștergerea unui singur element sau golirea întregului istoric.
- Descărcarea imaginii cu nume de fișier bazat pe legendă și igienizat.
- Controale accesibile, mesaje de stare și validare nativă a formularului.
- Gestionarea erorilor pentru probleme de rețea, răspunsuri API invalide, conversia imaginilor și limitele LocalStorage.
- Eliminarea automată a celor mai vechi elemente atunci când spațiul de stocare este insuficient, dacă acest lucru este posibil.

## Tehnologii utilizate

- **HTML5** - Structură semantică, formular, etichete și regiuni accesibile pentru mesaje.
- **CSS3** - Stilizare responsive cu Flexbox, CSS Grid, variabile CSS și media queries.
- **JavaScript ES6+** - Cereri asincrone, validare, manipularea DOM-ului și interacțiunile cardurilor.
- **LocalStorage API** - Salvarea istoricului direct în browser.
- **Fetch API** - Comunicarea cu serviciul Dog CEO.
- **FileReader API** - Conversia blob-urilor de imagine în Data URL-uri Base64.
- **Dog CEO API** - Sursa imaginilor aleatorii cu câini.

## Instalare și rulare locală

Acesta este un proiect frontend static și nu necesită backend, package manager sau etapă de build.

### Varianta 1: Live Server în VS Code

1. Clonează repository-ul:

   ```bash
   git clone https://github.com/candidoprisULBS/DogCardGenerator.git
   cd DogCardGenerator
   ```

2. Deschide folderul proiectului în Visual Studio Code.
3. Instalează extensia **Live Server**, dacă nu este deja instalată.
4. Deschide fișierul `index.html`.
5. Apasă click dreapta pe fișier și selectează **Open with Live Server**.
6. Accesează URL-ul local generat, de obicei `http://127.0.0.1:5500`.

### Varianta 2: Deschiderea directă a fișierului HTML

Deschide `index.html` într-un browser modern. Este recomandat un server local, deoarece securitatea browserului și regulile CORS pot varia atunci când fișierul este deschis prin protocolul `file://`.

## Structura proiectului

```text
DogCardGenerator/
├── index.html   # Marcajul aplicației, formularul și zonele pentru carduri
├── style.css    # Layout responsive, stiluri și stări vizuale
├── script.js    # API, conversie Base64, persistență și interacțiuni
└── README.md    # Documentația proiectului
```

### Fișiere principale

- **`index.html`** definește formularul generatorului, previzualizarea cardului curent, istoricul și structura paginii.
- **`style.css`** implementează layout-ul responsive cu Flexbox/Grid, designul vizual, stările formularului, stilurile cardurilor și breakpoint-urile pentru mobil și desktop.
- **`script.js`** validează datele, apelează API-ul, convertește imaginile în Data URL-uri, gestionează LocalStorage și implementează ștergerea și golirea istoricului.

## Utilizarea și gestionarea API-ului

Aplicația solicită o imagine aleatorie de la Dog CEO API:

```text
GET https://dog.ceo/api/breeds/image/random
```

Un răspuns valid conține URL-ul imaginii:

```json
{
  "message": "https://images.dog.ceo/breeds/example/example.jpg",
  "status": "success"
}
```

Clientul:

1. Verifică răspunsul HTTP și structura datelor primite.
2. Descarcă imaginea de la URL-ul returnat.
3. Convertește blob-ul imaginii într-un Data URL Base64 cu `FileReader`.
4. Salvează Data URL-ul împreună cu metadatele cardului în LocalStorage.
5. Reutilizează imaginea salvată la afișarea istoricului, fără o nouă cerere pentru o imagine aleatorie la reîncărcarea paginii.

Erorile sunt gestionate fără blocarea aplicației. Interfața afișează un mesaj clar când conexiunea nu este disponibilă, API-ul returnează un răspuns nereușit sau incorect, imaginea nu poate fi convertită ori LocalStorage nu mai are spațiu. Dacă este posibil, cele mai vechi carduri sunt eliminate pentru a elibera spațiu; dacă salvarea eșuează în continuare, previzualizarea cardului rămâne disponibilă, iar utilizatorul este informat că istoricul nu a putut fi salvat.
