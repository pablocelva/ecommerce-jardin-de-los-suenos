import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import CartPage from "./CartPage";
import {
  mockCartItem,
  renderWithProviders,
  seedCart,
} from "@/test/test-utils";

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

describe("CartPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("muestra estado vacío sin productos", async () => {
    renderWithProviders(<CartPage />, { route: "/cart" });

    expect(await screen.findByText("Tu carrito está vacío")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explorar catálogo/i })).toBeInTheDocument();
  });

  it("lista productos y calcula el total", async () => {
    seedCart([mockCartItem]);

    renderWithProviders(<CartPage />, { route: "/cart" });

    expect(await screen.findByText("Monstera")).toBeInTheDocument();
    expect(screen.getAllByText("$51.00").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /proceder al pago/i })).toBeInTheDocument();
  });

  it("muestra cantidad y subtotal por producto", async () => {
    seedCart([mockCartItem]);

    renderWithProviders(<CartPage />, { route: "/cart" });

    await waitFor(() => {
      expect(screen.getByText("Monstera")).toBeInTheDocument();
    });

    expect(screen.getByText("$25.50 c/u")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
  });
});
