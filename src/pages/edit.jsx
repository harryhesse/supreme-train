import { useParams } from "react-router";
import EditDocumentForm from "../components/EditDocumentForm";

export default function EditPage() {
  const { id } = useParams();

  return <EditDocumentForm id={id} />;
}
