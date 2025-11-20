import React, { useEffect, useState } from "react";
import DeleteDocumentButton from "./DeleteDocumentButton";

const TABLE = "documents";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

export default function DocumentList() {
  const [docs, setDocs] = useState([]);

  const fetchDocs = async () => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/${TABLE}?deleted_at=is.null`,
        {
          headers: { apikey: SUPABASE_KEY },
        }
      );
      const data = await res.json();
      setDocs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div>
      <h2>Documents</h2>
      {docs.length === 0 && <p>No documents found.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {docs.map((doc) => (
          <li
            key={doc.id}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              marginBottom: "8px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{doc.title}</span>
            <div>
              <button
                onClick={() => (window.location.href = `/edit/${doc.id}`)}
              >
                Edit
              </button>
              <DeleteDocumentButton
                documentId={doc.id}
                onDeleted={() =>
                  setDocs((prev) => prev.filter((d) => d.id !== doc.id))
                }
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
