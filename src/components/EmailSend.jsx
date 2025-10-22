import Style from "../Styles/modular/validateEmail.module.css";

export default function GotoEmail({ email }) {
    return (
        <>
            <div className={Style.banner}>
                <h4>Check your Email</h4>
                <FiMail className={Style.iconPulse} />
            </div>

            <div className={Style.container}>
                <div className={Style.messageBox}>
                    <p>
                        We've sent a verification email to{" "}
                        <span className={Style.emailHighlight}>
                            {email ? email : "your email."}
                        </span>
                    </p>
                    <p className={Style.subText}>
                        Please check your inbox (and spam folder) to complete your registration.
                    </p>
                </div>
            </div>
        </>
    );
}
