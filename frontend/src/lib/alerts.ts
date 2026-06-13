import Swal from "sweetalert2";

export const showSuccess = (title: string, text?: string) =>
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#1F7D53",
  });

export const showError = (title: string, text?: string) =>
  Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#1F7D53",
  });

export const showWarning = (title: string, text?: string) =>
  Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: "#1F7D53",
  });

export const confirmAction = async (
  title: string,
  text: string,
  confirmText = "Confirmar",
) => {
  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
  });

  return result.isConfirmed;
};
