import { Menu, Typography } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import type { Categoria } from "@/shared/schemas";

interface CategoryMenuProps {
  categorias: Categoria[];
  selectedCategory: Categoria | null;
  onSelect: (categoria: Categoria | null) => void;
}

const CategoryMenu = ({
  categorias,
  selectedCategory,
  onSelect,
}: CategoryMenuProps) => {
  return (
    <div className="category-menu">
      <Typography.Title level={5} className="category-menu-title">
        Categorías
      </Typography.Title>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[
          selectedCategory
            ? String(selectedCategory.id_categoria)
            : "all",
        ]}
        items={[
          {
            key: "all",
            icon: <AppstoreOutlined />,
            label: "Todas las plantas",
            onClick: () => onSelect(null),
          },
          ...categorias.map((cat) => ({
            key: String(cat.id_categoria),
            label: cat.nombre_categoria,
            onClick: () => onSelect(cat),
          })),
        ]}
        className="category-menu-list"
      />
    </div>
  );
};

export default CategoryMenu;
