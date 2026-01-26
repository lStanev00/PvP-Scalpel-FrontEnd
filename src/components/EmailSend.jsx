import { FiMail } from "react-icons/fi";
import Style from "../Styles/modular/LogReg.module.css";

export default function GotoEmail({ email }) {
    const emailDomain = typeof email === "string" ? email.split("@")[1]?.toLowerCase() : "";
    const domainMap = {
        "gmail.com": "https://mail.google.com",
        "googlemail.com": "https://mail.google.com",
        "yahoo.com": "https://mail.yahoo.com",
        "yahoo.co.uk": "https://mail.yahoo.com",
        "outlook.com": "https://outlook.live.com",
        "hotmail.com": "https://outlook.live.com",
        "live.com": "https://outlook.live.com",
        "icloud.com": "https://www.icloud.com/mail",
        "me.com": "https://www.icloud.com/mail",
        "proton.me": "https://mail.proton.me",
        "protonmail.com": "https://mail.proton.me",
        "aol.com": "https://mail.aol.com",
    };
    const isValidDomain =
        Boolean(emailDomain) &&
        /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(emailDomain) &&
        !emailDomain.includes(" ");
    const fallbackDomain = isValidDomain ? emailDomain.replace(/^www\./, "") : "";
    const inboxUrl = isValidDomain ? domainMap[emailDomain] || `https://${fallbackDomain}` : "";
    const buttonLabel = fallbackDomain ? `Open ${fallbackDomain}` : "Open inbox";

    return (
        <section className={Style.container}>
            <section className={Style["inner-section"]}>
                <h4>Check your Email</h4>
                <div className={Style.iconBadge} aria-hidden="true">
                    <FiMail />
                </div>
            </section>

            <section className={Style["inner-section"]}>
                <p className={Style.infoText}>
                    We've sent a verification email to{" "}
                    <span className={Style.emailHighlight}>
                        {email ? email : "your email."}
                    </span>
                </p>
                <p className={Style.infoText}>
                    Please check your inbox (and spam folder) to complete your registration.
                </p>
                {inboxUrl && (
                    <a
                        className={Style.actionButton}
                        href={inboxUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {buttonLabel}
                    </a>
                )}
            </section>
        </section>
    );
}
