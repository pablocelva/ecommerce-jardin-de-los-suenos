import { render, type RenderResult } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement } from "react";
import { CartProvider } from "@/shared/context/CartContext";

interface RenderOptions {
  route?: string;
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  { route = "/" }: RenderOptions = {},
): RenderResult {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <CartProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </CartProvider>
      </ConfigProvider>
    </QueryClientProvider>,
  );
}

export const mockCartItem = {
  id_producto: 1,
  nombre_producto: "Monstera",
  descripcion: "Planta de interior",
  precio: 25.5,
  stock: 10,
  quantity: 2,
};

export function seedCart(items = [mockCartItem]) {
  localStorage.setItem("cart", JSON.stringify(items));
}

export function seedAuthenticatedUser(
  user = {
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan@test.com",
    direccion: "Calle 123",
    ciudad: "Santiago",
  },
) {
  localStorage.setItem("userId", "1");
  localStorage.setItem("user", JSON.stringify(user));
}
