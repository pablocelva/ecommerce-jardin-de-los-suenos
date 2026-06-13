import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrdersService } from "../../src/modules/orders/orders.service.js";
import { ordersRepository } from "../../src/modules/orders/orders.repository.js";
import { mockOrder, validOrderBody } from "../helpers/fixtures.js";

vi.mock("../../src/modules/orders/orders.repository.js", () => ({
  ordersRepository: {
    findAll: vi.fn(),
    findByUserId: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("OrdersService (unit)", () => {
  const service = new OrdersService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllOrders", () => {
    it("convierte precio_total a number", async () => {
      vi.mocked(ordersRepository.findAll).mockResolvedValue([mockOrder]);

      const orders = await service.getAllOrders();

      expect(orders[0]?.precio_total).toBe(64.97);
      expect(orders[0]?.detalle).toHaveLength(1);
    });
  });

  describe("createOrder", () => {
    it("envía total como string al repositorio", async () => {
      vi.mocked(ordersRepository.create).mockResolvedValue(mockOrder);

      await service.createOrder(validOrderBody);

      expect(ordersRepository.create).toHaveBeenCalledWith({
        id_usuario: validOrderBody.id_usuario,
        precio_total: "25.99",
        detalle: validOrderBody.detalle,
        direccion: validOrderBody.direccion,
        estado: validOrderBody.estado,
      });
    });
  });

  describe("updateOrderStatus", () => {
    it("actualiza estado del pedido", async () => {
      vi.mocked(ordersRepository.updateStatus).mockResolvedValue({
        ...mockOrder,
        estado: "shipped",
      });

      const order = await service.updateOrderStatus(1, "shipped");

      expect(order.estado).toBe("shipped");
    });

    it("lanza error si el pedido no existe", async () => {
      vi.mocked(ordersRepository.updateStatus).mockResolvedValue(undefined);

      await expect(
        service.updateOrderStatus(999, "shipped"),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe("getOrdersByUserId", () => {
    it("retorna pedidos del usuario", async () => {
      vi.mocked(ordersRepository.findByUserId).mockResolvedValue([mockOrder]);

      const orders = await service.getOrdersByUserId(2);

      expect(orders).toHaveLength(1);
      expect(orders[0]?.id_usuario).toBe(2);
    });
  });
});
