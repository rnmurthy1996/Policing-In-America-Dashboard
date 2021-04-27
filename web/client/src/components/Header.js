import React from "react";


export default function Header(props) {

    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="row col-12 d-flex justify-content-center text-white">
                <span className="h3">{props.label}</span>
            </div>
        </nav>
    )
}