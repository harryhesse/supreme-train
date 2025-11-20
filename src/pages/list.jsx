import InsertDocumentForm from "../components/InsertDocumentForm";
import DocumentList from "../components/DocumentList";

export default function ListPage() {
  return (
    <>
      <InsertDocumentForm />

      <hr />

      <DocumentList />
    </>
  );
}
