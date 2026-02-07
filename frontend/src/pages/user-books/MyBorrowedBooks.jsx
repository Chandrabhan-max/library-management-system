import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./MyBorrowedBooks.css";

const MAX_BORROW_LIMIT = 6; 

export default function MyBorrowedBooks() {
  const [records, setRecords] = useState([]);
  const [confirmReturn, setConfirmReturn] = useState(null);
  const [renewPopup, setRenewPopup] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const loadBooks = async () => {
    const res = await api.get("/borrow/my");
    setRecords(res.data);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const getPlanDays = (issueDate, dueDate) => {
    const start = new Date(issueDate);
    const end = new Date(dueDate);
    return Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const renewBook = async (days) => {
    if (!renewPopup) return;

    setLoadingId(renewPopup.id);
    await api.post(`/borrow/renew/${renewPopup.id}`, { days });

    alert(`Book renewed for ${days} days`);
    setRenewPopup(null);
    setLoadingId(null);
    loadBooks();
  };

  const confirmReturnBook = async () => {
    if (!confirmReturn) return;

    setLoadingId(confirmReturn.id);
    await api.post(`/borrow/return/${confirmReturn.id}`);

    alert("Book returned successfully");
    setConfirmReturn(null);
    setLoadingId(null);
    loadBooks();
  };

  const remaining = MAX_BORROW_LIMIT - records.length;

  return (
    <div className="borrowed-page">
      <h2>My Borrowed Books</h2>

      <div className="borrow-info">
        {remaining > 0 ? (
          <>
            Borrowing Limit: <strong>{remaining}</strong> books left
          </>
        ) : (
          <>
            Borrowing limit reached: {MAX_BORROW_LIMIT} of {MAX_BORROW_LIMIT} books borrowed
          </>
        )}
      </div>

      {records.length === 0 ? (
        <p>You have not borrowed any books.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Book</th>
              <th>Plan</th>
              <th>Borrowed On</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Fine (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r, index) => (
              <tr key={r.id}>
                <td>{index + 1}</td>
                <td>{r.resource.name}</td>
                <td>{getPlanDays(r.issueDate, r.dueDate)} Days</td>
                <td>{new Date(r.issueDate).toLocaleDateString()}</td>
                <td>{new Date(r.dueDate).toLocaleDateString()}</td>
                <td>{r.overdue ? "Overdue" : "On Time"}</td>
                <td>{r.fine}</td>
                <td className="action-cell">
                  <button
                    className="renew-btn"
                    disabled={loadingId === r.id}
                    onClick={() => setRenewPopup(r)}
                  >
                    Renew
                  </button>
                  <button
                    className="return-btn"
                    disabled={loadingId === r.id}
                    onClick={() => setConfirmReturn(r)}
                  >
                    Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {renewPopup && (
        <div className="popup">
          <div className="popup-box">
            <h3>Select Renew Plan</h3>

            <button className="plan-btn" onClick={() => renewBook(7)}>7 Days</button>
            <button className="plan-btn" onClick={() => renewBook(15)}>15 Days</button>
            <button className="plan-btn" onClick={() => renewBook(30)}>30 Days</button>

            <button className="cancel-btn" onClick={() => setRenewPopup(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {confirmReturn && (
        <div className="popup">
          <div className="popup-box">
            <h3>Return Book?</h3>
            <p>{confirmReturn.resource.name}</p>

            <button className="confirm-btn" onClick={confirmReturnBook}>
              Confirm Return
            </button>

            <button className="cancel-btn" onClick={() => setConfirmReturn(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
