import { Input, Button } from "antd";

const SearchBar = () => {
return (
    <>
        <div className="search-bar-container">
            <div className="search-bar">
                <Input
                className="search-input"
                placeholder="Buscar producto"
                size="large"
                />
                <Button className="search-button" type="primary" size="large">
                Buscar
                </Button>
            </div>
        </div>
        <div className="banner-container">
            <img
            src="https://plus.unsplash.com/premium_photo-1670020262456-774caa9d216c?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Banner promocional"
            className="banner-image"
            />
        </div>
    </>
);
};

export default SearchBar;
