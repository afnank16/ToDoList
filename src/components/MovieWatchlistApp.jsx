import { useState, useEffect } from "react";

const SAMPLE_MOVIES = [
  { id: 1, title: "Inception", genre: "Sci-Fi", watched: false, rating: null },
  { id: 2, title: "The Godfather", genre: "Drama", watched: true, rating: 5 },
  { id: 3, title: "Interstellar", genre: "Sci-Fi", watched: false, rating: null },
  { id: 4, title: "Parasite", genre: "Thriller", watched: true, rating: 4 },
];

// ─── CONCEPT: Props + small reusable component ────────────────────────────────
function Badge({ text, color }) {
  const colors = {
    green: { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
    gray: { bg: "#f5f5f5", text: "#555", border: "#ddd" },
    blue: { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
    amber: { bg: "#fff8e1", text: "#e65100", border: "#ffcc80" },
  };
  const c = colors[color] || colors.gray;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
      padding: "2px 8px", borderRadius: 20,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {text}
    </span>
  );
}

// ─── CONCEPT: Props + event callbacks passed from parent ──────────────────────
function MovieCard({ movie, onToggleWatched, onRate, onDelete }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e8e8e8", borderRadius: 14,
      padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      opacity: movie.watched ? 0.75 : 1,
      transition: "opacity 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: "#1a1a1a",
            textDecoration: movie.watched ? "line-through" : "none" }}>
            {movie.title}
          </p>
          <div style={{ marginTop: 4, display: "flex", gap: 6 }}>
            <Badge text={movie.genre} color="blue" />
            <Badge text={movie.watched ? "Watched" : "Unwatched"} color={movie.watched ? "green" : "gray"} />
          </div>
        </div>
        <button onClick={() => onDelete(movie.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#ccc", fontSize: 18, lineHeight: 1, padding: 4,
        }}>✕</button>
      </div>

      {/* CONCEPT: Conditional rendering */}
      {movie.watched && (
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888" }}>Your rating</p>
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} onClick={() => onRate(movie.id, star)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 20, padding: 0, lineHeight: 1,
                color: movie.rating >= star ? "#f59e0b" : "#ddd",
              }}>★</button>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => onToggleWatched(movie.id)} style={{
        padding: "7px 14px", borderRadius: 8, cursor: "pointer",
        fontSize: 13, fontWeight: 500, border: "1px solid",
        background: movie.watched ? "#fff8e1" : "#e8f5e9",
        color: movie.watched ? "#b45309" : "#2e7d32",
        borderColor: movie.watched ? "#fcd34d" : "#86efac",
        alignSelf: "flex-start",
      }}>
        {movie.watched ? "Mark unwatched" : "Mark as watched"}
      </button>
    </div>
  );
}

// ─── CONCEPT: Props for a controlled input form ───────────────────────────────
function AddMovieForm({ onAdd }) {
  // CONCEPT: useState for form fields
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("Drama");

  function handleSubmit() {
    if (!title.trim()) return;
    onAdd(title.trim(), genre);
    setTitle("");     // reset after submit
    setGenre("Drama");
  }

  return (
    <div style={{
      background: "#f9f9fb", border: "1px dashed #d0d0d8",
      borderRadius: 14, padding: "16px 18px",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#555" }}>Add a movie</p>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        placeholder="Movie title..."
        style={{
          padding: "8px 12px", borderRadius: 8, border: "1px solid #e0e0e0",
          fontSize: 14, outline: "none", background: "#fff",
        }}
      />
      <select value={genre} onChange={e => setGenre(e.target.value)} style={{
        padding: "8px 12px", borderRadius: 8, border: "1px solid #e0e0e0",
        fontSize: 14, background: "#fff", cursor: "pointer",
      }}>
        {["Drama", "Sci-Fi", "Thriller", "Comedy", "Action", "Horror"].map(g => (
          <option key={g}>{g}</option>
        ))}
      </select>
      <button onClick={handleSubmit} style={{
        padding: "9px 18px", borderRadius: 8, cursor: "pointer",
        fontWeight: 600, fontSize: 14,
        background: "#1a1a2e", color: "#fff", border: "none",
        opacity: title.trim() ? 1 : 0.4,
      }}>
        + Add to list
      </button>
    </div>
  );
}

// ─── MAIN APP COMPONENT ───────────────────────────────────────────────────────
export default function FinalApp() {
  // CONCEPT: useState with an array
  const [movies, setMovies] = useState(SAMPLE_MOVIES);

  // CONCEPT: useState for filter
  const [filter, setFilter] = useState("all"); // "all" | "watched" | "unwatched"

  // CONCEPT: useState for a derived UI value
  const [search, setSearch] = useState("");

  // CONCEPT: useEffect — runs whenever movies changes, syncs to localStorage
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(movies));
  }, [movies]);

  // CONCEPT: useEffect with empty [] — runs once on mount (like componentDidMount)
  useEffect(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) setMovies(JSON.parse(saved));
  }, []);

  // ─── handlers: these update state, triggering re-render ──────────────────
  function addMovie(title, genre) {
    const newMovie = { id: Date.now(), title, genre, watched: false, rating: null };
    // CONCEPT: updating arrays in state — always create a NEW array
    setMovies(prev => [...prev, newMovie]);
  }

  function toggleWatched(id) {
    setMovies(prev =>
      prev.map(m => m.id === id ? { ...m, watched: !m.watched, rating: null } : m)
    );
  }

  function rateMovie(id, rating) {
    setMovies(prev =>
      prev.map(m => m.id === id ? { ...m, rating } : m)
    );
  }

  function deleteMovie(id) {
    setMovies(prev => prev.filter(m => m.id !== id));
  }

  // CONCEPT: derived state — compute from existing state, no useState needed
  const filtered = movies
    .filter(m => filter === "all" || (filter === "watched" ? m.watched : !m.watched))
    .filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  const watchedCount = movies.filter(m => m.watched).length;

  // ─── render ──────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#f4f4f8", fontFamily: "'Segoe UI', sans-serif",
      padding: "32px 16px",
    }}>
      <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#1a1a2e" }}>🎬 Watchlist</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#888" }}>
            {watchedCount} of {movies.length} watched
          </p>
        </div>

        {/* Stats row — CONCEPT: derived values rendered directly */}
        <div style={{ display: "flex", gap: 10 }}>
          {["all", "watched", "unwatched"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, cursor: "pointer",
              fontSize: 13, fontWeight: 500, border: "1px solid",
              background: filter === f ? "#1a1a2e" : "#fff",
              color: filter === f ? "#fff" : "#555",
              borderColor: filter === f ? "#1a1a2e" : "#e0e0e0",
              textTransform: "capitalize",
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* Search — CONCEPT: controlled input */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search movies..."
          style={{
            padding: "9px 14px", borderRadius: 10, border: "1px solid #e0e0e0",
            fontSize: 14, background: "#fff", outline: "none",
          }}
        />

        {/* Movie list — CONCEPT: rendering a list with .map() */}
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", fontSize: 14 }}>No movies found.</p>
        ) : (
          filtered.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleWatched={toggleWatched}
              onRate={rateMovie}
              onDelete={deleteMovie}
            />
          ))
        )}

        {/* Add movie form — CONCEPT: lifting state up (onAdd callback) */}
        <AddMovieForm onAdd={addMovie} />

        {/* Concepts legend */}
        <div style={{
          background: "#fff", border: "1px solid #e8e8e8", borderRadius: 14,
          padding: "14px 18px",
        }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: "#555" }}>
            React concepts in this app
          </p>
          {[
            ["useState — primitive", "filter, search, title, genre"],
            ["useState — array", "movies list (add, update, delete)"],
            ["useEffect — on mount", "load from localStorage"],
            ["useEffect — on change", "save to localStorage"],
            ["Props", "movie data passed to MovieCard"], 
            ["Callback props", "onToggleWatched, onRate, onDelete"],
            ["Derived state", "filtered list, watchedCount"],
            ["Controlled inputs", "search box, add form"],
            ["Conditional render", "star rating only when watched"],
            ["List rendering", ".map() with key prop"],
          ].map(([concept, detail]) => (
            <div key={concept} style={{
              display: "flex", justifyContent: "space-between",
              padding: "5px 0", borderBottom: "1px solid #f0f0f0", gap: 8,
            }}>
              <span style={{ fontSize: 13, color: "#1a1a2e", fontWeight: 500 }}>{concept}</span>
              <span style={{ fontSize: 12, color: "#999", textAlign: "right" }}>{detail}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}