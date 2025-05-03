import React from 'react'
import { Sections } from '../components'
import '../App.css'


export default function Home() {
    return (
        <main>
            <div>
                <p className='welcome-text'>BrainSnake — это интерактивный справочник по языку программирования Python, интегрированный в Telegram.
                Он предоставляет структурированную информацию, примеры кода и удобный интерфейс для быстрого освоения и повторения материала прямо внутри мессенджера.</p>
                <Sections></Sections>
            </div>
        </main>
    );
}