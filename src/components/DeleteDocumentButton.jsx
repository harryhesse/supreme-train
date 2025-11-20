import React from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

export default function DeleteDocumentButton({ documentId, onDeleted }) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/documents-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
          apikey: SUPABASE_KEY,
        },
        body: JSON.stringify({ id: documentId }),
      });

      const data = await res.json();
      if (res.ok) {
        onDeleted?.(documentId);
      } else {
        console.error("Error deleting document:", data);
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Delete failed");
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
