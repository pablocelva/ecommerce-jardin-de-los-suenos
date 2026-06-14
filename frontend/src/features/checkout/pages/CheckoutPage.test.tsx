import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import CheckoutPage from "./CheckoutPage";
import {
  mockCartItem,
  renderWithProviders,
  seedAuthenticatedUser,
  seedCart,
} from "@/test/test-utils";
import { savePendingCheckout } from "@/shared/lib/checkoutStorage";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@/features/catalog/api/catalog.queries", () => ({
  useCatalog: () => ({
    productos: [],
    categorias: [],
    imagenes: [{ id_producto: 1, url: "https://example.com/monstera.jpg" }],
    loading: false,
    error: null,
    refetchProducts: vi.fn(),
  }),
}));

vi.mock("@/shared/lib/alerts", () => ({
  showWarning: vi.fn(),
}));

vi.mock("@/shared/lib/checkoutStorage", () => ({
  savePendingCheckout: vi.fn(),
}));

describe("CheckoutPage", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    navigateMock.mockReset();
    vi.mocked(savePendingCheckout).mockReset();
  });

  it("redirige a login si no hay sesión", async () => {
    seedCart([mockCartItem]);

    renderWithProviders(<CheckoutPage />, { route: "/checkout" });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });

  it("muestra estado vacío con sesión activa", async () => {
    seedAuthenticatedUser();

    renderWithProviders(<CheckoutPage />, { route: "/checkout" });

    expect(
      await screen.findByText("No hay productos para finalizar la compra"),
    ).toBeInTheDocument();
  });

  it("muestra resumen del pedido con productos en carrito", async () => {
    seedAuthenticatedUser();
    seedCart([mockCartItem]);

    renderWithProviders(<CheckoutPage />, { route: "/checkout" });

    expect(await screen.findByText("Finalizar compra")).toBeInTheDocument();
    expect(screen.getByText("Monstera")).toBeInTheDocument();
    expect(screen.getAllByText("$51.00").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /continuar al pago/i }),
    ).toBeInTheDocument();
  });

  it("prellena el formulario con datos del usuario", async () => {
    seedAuthenticatedUser();
    seedCart([mockCartItem]);

    renderWithProviders(<CheckoutPage />, { route: "/checkout" });

    expect(await screen.findByDisplayValue("Juan")).toBeInTheDocument();
    expect(screen.getByDisplayValue("juan@test.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Calle 123")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Santiago")).toBeInTheDocument();
  });

  it("guarda checkout pendiente y navega al pago", async () => {
    seedAuthenticatedUser();
    seedCart([mockCartItem]);

    renderWithProviders(<CheckoutPage />, { route: "/checkout" });

    fireEvent.click(
      await screen.findByRole("button", { name: /continuar al pago/i }),
    );

    await waitFor(() => {
      expect(savePendingCheckout).toHaveBeenCalledWith(
        expect.objectContaining({
          id_usuario: 1,
          nombre_cliente: "Juan",
          email_cliente: "juan@test.com",
          total: 51,
          estado: "pending",
          direccion: "Calle 123",
          ciudad: "Santiago",
          detalle: [
            expect.objectContaining({
              id_producto: 1,
              nombre_producto: "Monstera",
              cantidad: 2,
              precio_unitario: 25.5,
            }),
          ],
        }),
      );
      expect(navigateMock).toHaveBeenCalledWith("/checkout/payment");
    });
  });
});
