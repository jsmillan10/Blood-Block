import React from 'react';

function Header(props) {
    return (
        <div className="header-home">
            <div className="fila-logo">
                <h3 className="logo-eps"><span className="bold">EPS</span> Sanitas</h3>
                <button className="btn-header btn-ingresar">Ingresar</button>
            </div>
        </div>
    );
}

export default Header;