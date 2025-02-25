import { useState, useEffect } from "react"
export default function GoToTopButton() {

    const [click, setClick] = useState(false);
    const [isVisible, setVisible] = useState(false);


    const toTop = () => {
        setClick(true);
    }

    useEffect(() =>{
        const show = () => {
            setVisible(window.scrollY > 200)
        }

        window.addEventListener(`scroll`, show);

        return () => {
            window.removeEventListener(`scroll`, show)
        }
    },[])


    useEffect(() => {
        if(click && isVisible) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            setClick(false);
            setVisible(false);
        }
    }, [click, isVisible])


    return (
        <>
            <button onClick={toTop} className={isVisible? "go-to-top-btn show" : "go-to-top-btn"} id="goToTopBtn">↑ Top</button>
        </>
    )
}