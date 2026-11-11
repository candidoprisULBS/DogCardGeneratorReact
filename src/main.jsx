import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../style.css";

const STORAGE_KEY = "dogCards";

function getSavedCards() {
  const storedCards = localStorage.getItem(STORAGE_KEY);
  if (!storedCards) return [];

  try {
    const cards = JSON.parse(storedCards);
    return Array.isArray(cards) ? cards : [];
  } catch (error) {
    console.error("Unable to read saved dog cards.", error);
    return [];
  }
}

function isQuotaExceededError(error) {
  return (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" ||
      error.code === 22 ||
      error.code === 1014)
  );
}

function saveCards(cards, removeOldestOnQuota = true) {
  const cardsToSave = [...cards];
  let removedCount = 0;

  while (true) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cardsToSave));
      return { saved: true, removedCount, cards: cardsToSave };
    } catch (error) {
      if (
        !isQuotaExceededError(error) ||
        !removeOldestOnQuota ||
        cardsToSave.length <= 1
      ) {
        console.error("Unable to save dog cards to LocalStorage.", error);
        return { saved: false, removedCount, cards };
      }
      cardsToSave.pop();
      removedCount += 1;
    }
  }
}

async function loadImageAsDataUrl(url) {
  const imageResponse = await fetch(url);
  if (!imageResponse.ok)
    throw new Error(
      `Image request failed with status ${imageResponse.status}.`,
    );

  const blob = await imageResponse.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result !== "string") {
        reject(new Error("The image could not be converted to a Data URL."));
        return;
      }
      resolve(reader.result);
    });
    reader.addEventListener("error", () =>
      reject(reader.error || new Error("The image could not be read.")),
    );
    reader.readAsDataURL(blob);
  });
}

async function fetchRandomDogImage() {
  const apiResponse = await fetch("https://dog.ceo/api/breeds/image/random");
  if (!apiResponse.ok)
    throw new Error(
      `Dog image API request failed with status ${apiResponse.status}.`,
    );

  const data = await apiResponse.json();
  if (data.status !== "success" || typeof data.message !== "string") {
    throw new Error("The dog image API returned an invalid response.");
  }
  return {
    imageUrl: data.message,
    imageSrc: await loadImageAsDataUrl(data.message),
  };
}

function DogCard({ card, showDeleteButton = false, onDelete }) {
  return (
    <article className="dog-card">
      {card.imageSrc ? (
        <img src={card.imageSrc} alt={card.caption} loading="lazy" />
      ) : (
        <div className="image-placeholder">
          This older card has no saved image.
        </div>
      )}
      <div className="card-details">
        <p className="card-caption">{card.caption}</p>
        <p className="card-meta">
          {card.width} × {card.height}px
        </p>
        {showDeleteButton && (
          <div className="card-actions">
            <button
              className="delete-button"
              type="button"
              aria-label={`Delete ${card.caption}`}
              onClick={() => onDelete(card.id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function App() {
  const [cards, setCards] = useState(() => getSavedCards());
  const [formValues, setFormValues] = useState({
    width: "400",
    height: "300",
    caption: "",
  });
  const [status, setStatus] = useState({ message: "", isError: false });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cards.length === 0) localStorage.removeItem(STORAGE_KEY);
  }, [cards]);

  function updateField(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const width = Number(formValues.width);
    const height = Number(formValues.height);
    const caption = formValues.caption.trim();

    if (!event.currentTarget.checkValidity() || !caption) {
      setFormValues((current) => ({ ...current, caption }));
      event.currentTarget.reportValidity();
      return;
    }

    setIsLoading(true);
    setStatus({ message: "Fetching your dog image...", isError: false });
    try {
      const { imageUrl, imageSrc } = await fetchRandomDogImage();
      const card = {
        id:
          typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        width,
        height,
        caption,
        url: imageUrl,
        imageSrc,
        timestamp: new Date().toISOString(),
      };
      const result = saveCards([card, ...cards]);
      setCards(result.cards);
      setStatus({
        message: result.saved
          ? result.removedCount > 0
            ? "Dog card saved. The oldest history item was removed to free space."
            : "Dog card saved."
          : "Card preview created, but history storage is full. Delete an older card and try again.",
        isError: !result.saved,
      });
    } catch (error) {
      console.error("Unable to generate and save the dog card.", error);
      setStatus({
        message:
          "The dog image could not be loaded. Please check your connection and try again.",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function deleteCard(cardId) {
    const remainingCards = cards.filter((card) => card.id !== cardId);
    const result = saveCards(remainingCards, false);
    if (result.saved) setCards(remainingCards);
  }

  function clearHistory() {
    if (cards.length > 0 && window.confirm("Clear all saved dog cards?")) {
      localStorage.removeItem(STORAGE_KEY);
      setCards([]);
    }
  }

  const currentCard = cards[0];
  return (
    <>
      <header className="site-header">
        <div className="container">
          <p className="eyebrow">Place.dog creative toolkit</p>
          <h1>Dog Placeholder Card Generator</h1>
          <p className="intro">
            Create a custom dog image, give it a caption, and keep your favorite
            cards for later.
          </p>
        </div>
      </header>
      <main className="container">
        <div className="generator-layout">
          <section
            className="panel form-panel"
            aria-labelledby="generator-title"
          >
            <div className="section-heading">
              <p className="eyebrow">Start creating</p>
              <h2 id="generator-title">Design a new card</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="field-group">
                  <label htmlFor="width">
                    Width <span>(px)</span>
                  </label>
                  <input
                    id="width"
                    name="width"
                    type="number"
                    min="100"
                    max="1000"
                    value={formValues.width}
                    onChange={updateField}
                    required
                  />
                </div>
                <div className="field-group">
                  <label htmlFor="height">
                    Height <span>(px)</span>
                  </label>
                  <input
                    id="height"
                    name="height"
                    type="number"
                    min="100"
                    max="1000"
                    value={formValues.height}
                    onChange={updateField}
                    required
                  />
                </div>
              </div>
              <div className="field-group">
                <label htmlFor="caption">Caption</label>
                <input
                  id="caption"
                  name="caption"
                  type="text"
                  placeholder="A very good dog"
                  value={formValues.caption}
                  onChange={updateField}
                  required
                />
              </div>
              <button
                className="button button-primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Fetching Dog..." : "Generate Dog Card"}
              </button>
              <p
                className={`form-status${status.isError ? " error" : ""}`}
                role="status"
                aria-live="polite"
              >
                {status.message}
              </p>
            </form>
          </section>
          <section
            className="panel current-panel"
            aria-labelledby="current-title"
          >
            <div className="section-heading">
              <p className="eyebrow">Preview</p>
              <h2 id="current-title">Current card</h2>
            </div>
            <div className={`current-card${currentCard ? "" : " empty-state"}`}>
              {currentCard ? (
                <DogCard card={currentCard} />
              ) : (
                <p>Your generated card will appear here.</p>
              )}
            </div>
          </section>
        </div>
        <section className="history-section" aria-labelledby="history-title">
          <div className="history-heading">
            <div className="section-heading">
              <p className="eyebrow">Your collection</p>
              <h2 id="history-title">Saved history</h2>
            </div>
            <button
              className="button button-secondary"
              type="button"
              onClick={clearHistory}
            >
              Clear History
            </button>
          </div>
          <div className="history-grid" aria-live="polite">
            {cards.length > 0 ? (
              cards.map((card) => (
                <DogCard
                  key={card.id}
                  card={card}
                  showDeleteButton
                  onDelete={deleteCard}
                />
              ))
            ) : (
              <p className="empty-state">
                No saved cards yet. Generate your first one above.
              </p>
            )}
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>
            Images provided by{" "}
            <a href="https://place.dog" target="_blank" rel="noreferrer">
              place.dog
            </a>
            .
          </p>
        </div>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
