import React from 'react'
import '../App.css'
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";
import test from "../assets/tests.png";
import { Link } from "wouter";
import { CircleUserRound, ClipboardList  } from 'lucide-react';

function Header() {
    return (
        <header>
            <Link href={"/"}>
                <div>
                    <h1>BrainSnake</h1>
                    {/* <img className='logo' src={logo}></img> */}
                </div>
            </Link>
            <ol style={{
                height: '50px',
                width: '80px',
                listStyle: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
            }}>
                <li style={{marginLeft: '5px'}}>
                    <Link href={"/test"} className='disp-center'>
                        <ClipboardList 
                            size={35} />
                    </Link>
                </li>
                <li style={{marginLeft: '5px'}}>
                    <Link href={"/profile"} className='disp-center'>
                        <CircleUserRound
                            size={35} />
                    </Link>
                </li>
            </ol>
        </header >
    );
}

export default Header;
