import { useCatalog } from "@/features/catalog/api/catalog.queries";
import { useCart } from "@/shared/context/CartContext";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Row,
  Col,
  Drawer,
  Button,
  Grid,
  Empty,
  Spin,
  Typography,
  message,
  Breadcrumb,
  Pagination,
} from "antd";
import { AppstoreOutlined, FilterOutlined, HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductCard from "@/shared/components/ProductCard";
import SearchBar from "@/features/catalog/components/SearchBar";
import AppFooter from "@/shared/components/Footer";
import CategoryMenu from "@/features/catalog/components/CategoryMenu";
import ProductFilters, {
  type ProductFiltersState,
  type SortOption,
} from "@/features/catalog/components/ProductFilters";
import { fetchProductsByCategory } from "@/features/catalog/api/catalog.api";
import type { Categoria, Product } from "@/shared/schemas";
import styles from "./CatalogPage.module.css";

const { useBreakpoint } = Grid;

const PAGE_SIZE = 12;

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.precio - b.precio);
    case "price-desc":
      return sorted.sort((a, b) => b.precio - a.precio);
    case "name-asc":
      return sorted.sort((a, b) =>
        a.nombre_producto.localeCompare(b.nombre_producto),
      );
    case "name-desc":
      return sorted.sort((a, b) =>
        b.nombre_producto.localeCompare(a.nombre_producto),
      );
    default:
      return sorted;
  }
}

const CatalogPage = () => {
  const { productos, categorias, imagenes, loading, error } = useCatalog();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId?: string }>();
  const screens = useBreakpoint();
  const isCompact = !screens.lg;

  const [data, setData] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const priceBounds = useMemo((): [number, number] => {
    if (productos.length === 0) return [0, 500];
    const prices = productos.map((p) => p.precio);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [productos]);

  const defaultFilters = useMemo(
    (): ProductFiltersState => ({
      sort: "default",
      inStockOnly: false,
      priceRange: priceBounds,
    }),
    [priceBounds],
  );

  const [filters, setFilters] = useState<ProductFiltersState>(defaultFilters);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, priceRange: priceBounds }));
  }, [priceBounds]);

  const fetchCategoryProducts = useCallback(async (categoria: Categoria) => {
    setCategoryLoading(true);
    try {
      const products = await fetchProductsByCategory(categoria.id_categoria);
      setData(products);
    } catch (err) {
      console.error("Error al obtener los productos:", err);
      setData([]);
    } finally {
      setCategoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (categoryId) {
      if (categorias.length === 0) return;

      const categoria = categorias.find(
        (cat) => String(cat.id_categoria) === categoryId,
      );

      if (!categoria) {
        navigate("/catalogo", { replace: true });
        return;
      }

      setSelectedCategory(categoria);
      void fetchCategoryProducts(categoria);
      return;
    }

    setSelectedCategory(null);
    setData(productos);
  }, [categoryId, categorias, productos, navigate, fetchCategoryProducts]);

  const handleCategoryClick = (categoria: Categoria | null) => {
    setCategoryDrawerOpen(false);

    if (categoria) {
      navigate(`/catalogo/categoria/${categoria.id_categoria}`);
    } else {
      navigate("/catalogo");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, searchTerm, filters]);

  const filteredData = useMemo(() => {
    let result = data;

    if (searchTerm) {
      result = result.filter((p) =>
        p.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filters.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    result = result.filter(
      (p) =>
        p.precio >= filters.priceRange[0] && p.precio <= filters.priceRange[1],
    );

    return sortProducts(result, filters.sort);
  }, [data, searchTerm, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSearchTerm("");
  }, [defaultFilters]);

  const getProductImage = (id: number) =>
    imagenes.find((img) => img.id_producto === id)?.url ??
    "https://images.unsplash.com/photo-1466781783364-36c667e68334?w=600&q=80";

  const filtersPanel = (
    <ProductFilters
      filters={filters}
      priceBounds={priceBounds}
      onChange={setFilters}
      onReset={handleResetFilters}
      resultCount={filteredData.length}
    />
  );

  const categoryPanel = (
    <CategoryMenu
      categorias={categorias}
      selectedCategory={selectedCategory}
      onSelect={handleCategoryClick}
    />
  );

  const isLoading = loading || categoryLoading;

  const breadcrumbItems = [
    {
      title: (
        <Link to="/">
          <HomeOutlined /> Inicio
        </Link>
      ),
    },
    {
      title: selectedCategory ? (
        <Link to="/catalogo">Catálogo</Link>
      ) : (
        "Catálogo"
      ),
    },
    ...(selectedCategory
      ? [{ title: selectedCategory.nombre_categoria }]
      : []),
  ];

  return (
    <>
      <div className={styles.page}>
        {!isCompact && (
          <aside className={styles.sider}>{categoryPanel}</aside>
        )}

        <main className={styles.main}>
          <div className={styles.top}>
            <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />

            <div className={styles.toolbar}>
              {isCompact && (
                <div className={styles.mobileActions}>
                  <Button
                    icon={<AppstoreOutlined />}
                    onClick={() => setCategoryDrawerOpen(true)}
                  >
                    Categorías
                  </Button>
                  <Button
                    icon={<FilterOutlined />}
                    onClick={() => setFilterDrawerOpen(true)}
                  >
                    Filtros
                  </Button>
                </div>
              )}

              <SearchBar onSearch={setSearchTerm} value={searchTerm} />

              {!isCompact && filtersPanel}
            </div>

            <div className={styles.header}>
              <Typography.Title level={3} className={styles.title}>
                {selectedCategory
                  ? selectedCategory.nombre_categoria
                  : "Catálogo de plantas"}
              </Typography.Title>
              <Typography.Text type="secondary">
                {selectedCategory
                  ? `Explora nuestra selección de ${selectedCategory.nombre_categoria.toLowerCase()} · ${filteredData.length} productos`
                  : `${filteredData.length} productos disponibles`}
              </Typography.Text>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.loading}>
              <Spin size="large" tip="Cargando plantas…" />
            </div>
          ) : error ? (
            <Empty description={error} />
          ) : filteredData.length > 0 ? (
            <>
              <Row gutter={[16, 16]} className={styles.productGrid}>
                {paginatedData.map((producto) => (
                  <Col
                    key={producto.id_producto}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    xl={6}
                    className={styles.productGridCol}
                  >
                    <ProductCard
                      image={getProductImage(producto.id_producto)}
                      title={producto.nombre_producto}
                      description={producto.descripcion}
                      price={producto.precio}
                      stock={producto.stock}
                      onView={() => navigate(`/product/${producto.id_producto}`)}
                      onAddToCart={() => {
                        addToCart(producto);
                        message.success(
                          `${producto.nombre_producto} añadido al carrito`,
                        );
                      }}
                    />
                  </Col>
                ))}
              </Row>

              <div className={styles.pagination}>
                <Pagination
                  current={currentPage}
                  pageSize={PAGE_SIZE}
                  total={filteredData.length}
                  onChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  showSizeChanger={false}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} de ${total} productos`
                  }
                />
              </div>
            </>
          ) : (
            <Empty
              description="No se encontraron plantas con esos criterios"
              className={styles.empty}
            >
              <Button type="primary" onClick={handleResetFilters}>
                Limpiar filtros
              </Button>
            </Empty>
          )}
        </main>
      </div>

      <Drawer
        title="Categorías"
        placement="left"
        open={categoryDrawerOpen}
        onClose={() => setCategoryDrawerOpen(false)}
        className="category-drawer"
        styles={{ body: { padding: 0, background: "#1c3224" } }}
      >
        {categoryPanel}
      </Drawer>

      <Drawer
        title="Filtros"
        placement="bottom"
        height="auto"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        className="filter-drawer"
      >
        {filtersPanel}
      </Drawer>

      <AppFooter />
    </>
  );
};

export default CatalogPage;
