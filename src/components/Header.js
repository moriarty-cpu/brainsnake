import React from 'react'
import '../App.css'
import logo from "../assets/logo.png";

function Header() {
    return (
        <header>
            <div>
                <h1>BrainSnake</h1>
               <img src={logo}></img>
            </div>
        </header>
    );
}

export default Header;
