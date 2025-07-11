import MagnifierSearchStyle from "../Styles/modular/MaginifierSearch.module.css"

export default function Loading() {
    return (
            <div className={MagnifierSearchStyle.animationContainer}>
                    <video
                        src="/animations/output1.webm"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={MagnifierSearchStyle.animation}
                        height={"100%"}
                    />
            </div>

    )
}