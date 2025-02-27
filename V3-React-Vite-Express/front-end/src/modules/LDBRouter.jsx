import { Link } from "react-router-dom"

export default function LDBRotuer() {
    return (
        <>
        <div class="bracket-buttons">
            <button id="shuffle" className="bracket-btn">Solo Shuffle</button>
            <button id="twos" className="bracket-btn">2v2 Arena</button>
            <button id="threes" className="bracket-btn">3v3 Arena</button>
            <button id="blitz" className="bracket-btn">Blitz BG</button>
            <button id="rbg" className="bracket-btn">Rated BG</button>
        </div>
        </>
    )
};