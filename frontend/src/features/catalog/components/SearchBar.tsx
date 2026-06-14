import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchBarProps {
  onSearch: (term: string) => void;
  value?: string;
}

const SearchBar = ({ onSearch, value }: SearchBarProps) => {
  return (
    <Input.Search
      placeholder="Buscar plantas, suculentas, flores…"
      allowClear
      size="large"
      value={value}
      enterButton={<SearchOutlined />}
      onChange={(e) => onSearch(e.target.value)}
      onSearch={onSearch}
      className="catalog-search"
    />
  );
};

export default SearchBar;
