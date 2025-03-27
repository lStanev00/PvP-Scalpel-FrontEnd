import Style from '../Styles/modular/validateEmail.module.css'
export default function GotoEmail() {
    return (<>
            <div className={Style["banner"]}>
                <h4>Check your email</h4>
                <h4 className={Style["emojiPulse"]}>📨</h4>
            </div>
        <div className={Style["container"]}>
            <div style={{fontSize: "25px"}}>
                <p>We've sent you a verification link. Please confirm your account to continue.</p>
            </div>
        </div>
    </>
      );
}