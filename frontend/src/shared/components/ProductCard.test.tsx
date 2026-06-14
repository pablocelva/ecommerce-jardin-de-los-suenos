import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ProductCard from "./ProductCard";

const defaultProps = {
  title: "Monstera Deliciosa",
  description: "Planta tropical de hojas grandes, ideal para interiores luminosos.",
  image: "https://example.com/monstera.jpg",
  price: 29.99,
  stock: 5,
};

describe("ProductCard", () => {
  it("muestra título, precio y stock", () => {
    render(<ProductCard {...defaultProps} />);

    expect(screen.getByText("Monstera Deliciosa")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("5 en stock")).toBeInTheDocument();
  });

  it("recorta descripciones largas", () => {
    const longDescription = "A".repeat(80);

    render(
      <ProductCard
        {...defaultProps}
        description={longDescription}
      />,
    );

    expect(screen.getByText(`${"A".repeat(72)}…`)).toBeInTheDocument();
  });

  it("muestra precio original y descuento cuando aplica", () => {
    render(
      <ProductCard
        {...defaultProps}
        originalPrice={39.99}
        discountPercent={25}
      />,
    );

    expect(screen.getByText("$39.99")).toBeInTheDocument();
    expect(screen.getByText("-25%")).toBeInTheDocument();
  });

  it("llama onView al pulsar Ver", () => {
    const onView = vi.fn();

    render(<ProductCard {...defaultProps} onView={onView} />);

    fireEvent.click(screen.getByRole("button", { name: /eyeVer/i }));

    expect(onView).toHaveBeenCalledTimes(1);
  });

  it("llama onView al pulsar la imagen", () => {
    const onView = vi.fn();

    render(<ProductCard {...defaultProps} onView={onView} />);

    fireEvent.click(
      screen.getByRole("button", { name: /ver detalle de monstera deliciosa/i }),
    );

    expect(onView).toHaveBeenCalledTimes(1);
  });

  it("llama onView con Enter en la imagen", () => {
    const onView = vi.fn();

    render(<ProductCard {...defaultProps} onView={onView} />);

    fireEvent.keyDown(
      screen.getByRole("button", { name: /ver detalle de monstera deliciosa/i }),
      { key: "Enter" },
    );

    expect(onView).toHaveBeenCalledTimes(1);
  });

  it("llama onAddToCart al pulsar Añadir", () => {
    const onAddToCart = vi.fn();

    render(<ProductCard {...defaultProps} onAddToCart={onAddToCart} />);

    fireEvent.click(screen.getByRole("button", { name: /añadir/i }));

    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });

  it("deshabilita Añadir cuando no hay stock", () => {
    render(<ProductCard {...defaultProps} stock={0} />);

    expect(screen.getByText("Agotado")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /añadir/i })).toBeDisabled();
  });
});
