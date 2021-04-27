import React from 'react';

export default function NavigationBar(props) {

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">
                Dashboard
            </a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className={"nav-link " + (props.activePage === "police_violence" ? "active" : "")} href="/police_violence">Police Violence</a>
                    </li>
                    <li className="nav-item">
                        <a className={"nav-link " + (props.activePage === "firearm_purchases" ? "active" : "")} href="/firearm_purchases">Firearm Purchases</a>
                    </li>
                    <li className="nav-item">
                        <a className={"nav-link " + (props.activePage === "budget" ? "active" : "")} href="/budget">Budget</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}