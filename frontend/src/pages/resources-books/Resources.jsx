import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/axios";
import "./Resources.css";

const MAX_BORROW_LIMIT = 6;

export default function Resources() {
  const [books, setBooks] = useState([]);
  const [borrowedKeys, setBorrowedKeys] = useState([]);
  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const loadBooks = async () => {
    const res = await api.get("/resources");

    const map = {};
    res.data.forEach((b) => {
      const key = `${b.name}-${b.author}-${b.genre}-${b.publishedYear}`;

      if (!map[key]) {
        map[key] = {
          key,
          name: b.name,
          author: b.author,
          genre: b.genre,
          publishedYear: b.publishedYear,
          total: 0,
          available: 0,
          ids: [],
        };
      }

      map[key].total += 1;
      if (b.available === true || b.available === 1) {
        map[key].available += 1;
        map[key].ids.push(b.id);
      }
    });

    setBooks(Object.values(map));
  };

  const loadMyBorrowed = async () => {
    const res = await api.get("/borrow/my");

    const keys = res.data.map((r) => {
      const b = r.resource;
      return `${b.name}-${b.author}-${b.genre}-${b.publishedYear}`;
    });

    setBorrowedKeys(keys);
  };

  useEffect(() => {
    loadBooks();
    loadMyBorrowed();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const g = params.get("genre");
    if (g) setGenre(g);
  }, [location.search]);

  const genres = [...new Set(books.map((b) => b.genre))];

  const filtered = books.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) &&
      b.author.toLowerCase().includes(author.toLowerCase()) &&
      (genre === "" || b.genre === genre) &&
      (year === "" || String(b.publishedYear).startsWith(year))
  );

  const borrow = async (days) => {
    if (!popup || popup.ids.length === 0) {
      alert("No available copy found");
      return;
    }

    setLoading(true);
    await api.post(`/borrow/${popup.ids[0]}`, { days });

    setPopup(null);
    await loadBooks();
    await loadMyBorrowed();
    setLoading(false);

    alert("Book borrowed successfully");
  };

  const handleBorrowClick = (book) => {
    if (borrowedKeys.includes(book.key)) {
      alert("You have already borrowed this book.");
      return;
    }

    if (borrowedKeys.length >= MAX_BORROW_LIMIT) {
      alert("Borrow limit reached (maximum 6 books).");
      return;
    }

    setPopup(book);
  };

  return (
    <div className="resources-page">
      <h2>Books</h2>

      <div className="filters">
        <input
          placeholder="Search title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Published Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Published</th>
            <th>Available</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((b, i) => (
            <tr key={b.key}>
              <td>{i + 1}</td>
              <td>{b.name}</td>
              <td>{b.author}</td>
              <td>{b.genre}</td>
              <td>{b.publishedYear}</td>
              <td>
                {b.available}/{b.total}
              </td>
              <td>
                {borrowedKeys.includes(b.key) ? (
                  <span className="issued">Already Borrowed</span>
                ) : borrowedKeys.length >= MAX_BORROW_LIMIT ? (
                  <span className="issued">Limit Reached</span>
                ) : b.available > 0 ? (
                  <button
                    className="borrow-btn"
                    onClick={() => handleBorrowClick(b)}
                  >
                    Borrow
                  </button>
                ) : (
                  <span className="issued">Not Available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {popup && (
        <div className="popup">
          <div className="popup-box">
            <h3>Select Borrow Plan</h3>

            <button
              className="plan-btn"
              disabled={loading}
              onClick={() => borrow(7)}
            >
              7 Days – ₹50
            </button>
            <button
              className="plan-btn"
              disabled={loading}
              onClick={() => borrow(15)}
            >
              15 Days – ₹90
            </button>
            <button
              className="plan-btn"
              disabled={loading}
              onClick={() => borrow(30)}
            >
              30 Days – ₹150
            </button>

            <button
              className="cancel-btn"
              onClick={() => setPopup(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
