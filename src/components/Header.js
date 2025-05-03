import React from 'react'
import '../App.css'
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";
import test from "../assets/tests.png";
import { Link } from "wouter";

function Header() {
    return (
        <header>
            <Link href={"/"}>
                <div>
                    <h1>BrainSnake</h1>
                    <img className='logo' src={logo}></img>
                </div>
            </Link>
            <ol style={{
                 listStyle: 'none',
                 display: 'flex',
                 alignItems: 'center'
            }}>
                <li style={{ width: '40px', height: '40px' }}>
                    <Link href={"/test"}>
                        <img style={{ width: '40px', height: '40px' }} src={test} />
                    </Link>
                </li>
                <li style={{ width: '40px', height: '40px' }}>
                    <Link href={"/profile"}>
                        <img style={{ width: '40px', height: '40px' }} src={profile} />
                    </Link>
                </li>
            </ol>
        </header>
    );
}

export default Header;
