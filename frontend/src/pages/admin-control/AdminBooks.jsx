import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./AdminBooks.css";

const GENRES = [
  "Fantasy",
  "Sci-Fi",
  "Horror",
  "Thriller",
  "History",
  "Travel",
  "Sports",
  "Music",
  "Poetry",
  "Psychology",
  "Romance",
  "Mystery",
  "Hindu Epic",
];

function AdminBooks() {
  const [books, setBooks] = useState([]);

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");

  const [editKey, setEditKey] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const loadBooks = async () => {
    const res = await api.get("/resources");
    const grouped = {};

    res.data.forEach((b) => {
      const key = `${b.name}-${b.author}-${b.publishedYear}`;
      if (!grouped[key]) {
        grouped[key] = {
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

      grouped[key].total += 1;
      if (b.available) grouped[key].available += 1;
      grouped[key].ids.push(b.id);
    });

    setBooks(Object.values(grouped));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const resetForm = () => {
    setName("");
    setAuthor("");
    setGenre("");
    setYear("");
    setEditKey(null);
    setShowForm(false);
  };

  const submitBook = async () => {
    if (!name || !author || !genre || !year) {
      alert("All fields are required");
      return;
    }

    if (editKey) {
      const book = books.find((b) => b.key === editKey);
      for (const id of book.ids) {
        await api.patch(`/resources/${id}`, {
          name,
          author,
          genre,
          publishedYear: Number(year),
        });
      }
      alert("Book updated successfully");
    } else {
      await api.post("/resources", {
        name,
        author,
        genre,
        publishedYear: Number(year),
      });
      alert("Book copy added");
    }

    resetForm();
    loadBooks();
  };

  const startEdit = (book) => {
    setEditKey(book.key);
    setName(book.name);
    setAuthor(book.author);
    setGenre(book.genre);
    setYear(book.publishedYear);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteOneCopy = async (ids, availableCount) => {
    if (availableCount === 0) {
      alert("No available copies");
      return;
    }

    if (!window.confirm("Delete one available copy?")) return;

    const res = await api.get("/resources");
    const copy = res.data.find(
      (b) => ids.includes(b.id) && b.available === true
    );

    if (!copy) {
      alert("No available copy found");
      return;
    }

    await api.delete(`/resources/${copy.id}`);
    loadBooks();
  };

  const filteredBooks = books.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.genre.toLowerCase().includes(search.toLowerCase()) ||
      String(b.publishedYear).includes(search)
  );

  return (
    <div className="admin-page">
      <h2>Admin – Book Management</h2>

      <input
        className="search-input"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {!showForm && (
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Book
        </button>
      )}

      {showForm && (
        <div className="admin-card">
          <h3>{editKey ? "Edit Book" : "Add New Book"}</h3>

          <div className="form-grid">
            <input
              placeholder="Book Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />

            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="">Select Genre</option>
              {GENRES.map((g) => (
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

          <div className="form-actions">
            <button className="btn-primary" onClick={submitBook}>
              {editKey ? "Update Book" : "Add Book"}
            </button>
            <button className="btn-grey" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Published</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredBooks.map((b, i) => (
            <tr key={b.key}>
              <td>{i + 1}</td>
              <td>{b.name}</td>
              <td>{b.author}</td>
              <td>{b.genre}</td>
              <td>{b.publishedYear}</td>
              <td>
                {b.available}/{b.total}
              </td>
              <td className="actions">
                <button className="btn-grey" onClick={() => startEdit(b)}>
                  Edit
                </button>
                <button
                  className="btn-danger"
                  disabled={b.available === 0}
                  onClick={() => deleteOneCopy(b.ids, b.available)}
                >
                  Delete 1 Copy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBooks;
