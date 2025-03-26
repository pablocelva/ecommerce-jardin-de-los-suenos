import { Input, Button } from "antd";

const SearchBar = ({ onSearch }) => {
    return (
        <div className="search-bar-container">
        <div className="search-bar">
            <Input
            className="search-input"
            placeholder="Buscar producto"
            size="large"
            onChange={(e) => onSearch(e.target.value)}  // Llamamos a la función onSearch cuando cambia el valor
            />
            <button>
            Buscar
            </button>
        </div>
        </div>
    );
};

export default SearchBar;
