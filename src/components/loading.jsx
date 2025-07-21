import MagnifierSearchStyle from "../Styles/modular/MaginifierSearch.module.css"

export default function Loading( {height = undefined}) {
    return (
            <div className={MagnifierSearchStyle.animationContainer}>
                    <video
                        src="/animations/output1.webm"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={MagnifierSearchStyle.animation}
                        height={height ? `${height}px` :"100%"}
                    />
            </div>

    )
}