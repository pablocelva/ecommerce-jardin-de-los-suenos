import {
  Collapse,
  Radio,
  Slider,
  Switch,
  Typography,
  Space,
  Button,
} from "antd";
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import styles from "./ProductFilters.module.css";

export type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export interface ProductFiltersState {
  sort: SortOption;
  inStockOnly: boolean;
  priceRange: [number, number];
}

interface ProductFiltersProps {
  filters: ProductFiltersState;
  priceBounds: [number, number];
  onChange: (filters: ProductFiltersState) => void;
  onReset: () => void;
  resultCount: number;
}

const ProductFilters = ({
  filters,
  priceBounds,
  onChange,
  onReset,
  resultCount,
}: ProductFiltersProps) => {
  const [minPrice, maxPrice] = priceBounds;

  const panelContent = (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Typography.Text type="secondary" className={styles.label}>
          Ordenar por
        </Typography.Text>
        <Radio.Group
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
          style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}
        >
          <Radio value="default">Relevancia</Radio>
          <Radio value="price-asc">Precio: menor a mayor</Radio>
          <Radio value="price-desc">Precio: mayor a menor</Radio>
          <Radio value="name-asc">Nombre: A → Z</Radio>
          <Radio value="name-desc">Nombre: Z → A</Radio>
        </Radio.Group>
      </div>

      <div>
        <Typography.Text type="secondary" className={styles.label}>
          Rango de precio
        </Typography.Text>
        <Slider
          range
          min={minPrice}
          max={maxPrice}
          step={1}
          value={filters.priceRange}
          onChange={(value) =>
            onChange({ ...filters, priceRange: value as [number, number] })
          }
          tooltip={{ formatter: (v) => `$${v}` }}
          style={{ marginTop: 12 }}
        />
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          ${filters.priceRange[0]} — ${filters.priceRange[1]}
        </Typography.Text>
      </div>

      <div className={styles.switchRow}>
        <Typography.Text>Solo productos en stock</Typography.Text>
        <Switch
          checked={filters.inStockOnly}
          onChange={(checked) => onChange({ ...filters, inStockOnly: checked })}
        />
      </div>

      <Button icon={<ReloadOutlined />} onClick={onReset} block>
        Limpiar filtros
      </Button>
    </Space>
  );

  return (
    <div className={styles.filters}>
      <div className={styles.header}>
        <Typography.Text strong>
          {resultCount === 1
            ? "1 producto encontrado"
            : `${resultCount} productos encontrados`}
        </Typography.Text>
      </div>
      <Collapse
        bordered={false}
        className={styles.collapse}
        items={[
          {
            key: "filters",
            label: (
              <span className={styles.collapseLabel}>
                <FilterOutlined /> Filtros y orden
              </span>
            ),
            children: panelContent,
          },
        ]}
      />
    </div>
  );
};

export default ProductFilters;
