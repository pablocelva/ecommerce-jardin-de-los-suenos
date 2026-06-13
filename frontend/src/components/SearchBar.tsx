import { Input } from "antd";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <Input
          className="search-input"
          placeholder="Buscar producto"
          size="large"
          onChange={(e) => onSearch(e.target.value)}
        />
        <button type="button">Buscar</button>
      </div>
    </div>
  );
};

export default SearchBar;
