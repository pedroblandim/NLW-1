import React from 'react';

interface HeaderProps {
    // title?: String; ? indica que não é obrigatória
    title: String;
}

// FC -> function component
const Header: React.FC<HeaderProps> = (props) => {
    return (
        <header>
            <h1>{props.title}</h1>
        </header>
    );
}

export default Header;