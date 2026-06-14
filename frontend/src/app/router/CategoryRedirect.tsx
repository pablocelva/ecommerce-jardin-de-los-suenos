import { Navigate, useParams } from "react-router-dom";

const CategoryRedirect = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  return (
    <Navigate to={`/catalogo/categoria/${categoryId}`} replace />
  );
};

export default CategoryRedirect;
