import Style from '../../Styles/modular/Verify.module.css';
import {  useNavigate, useParams  } from 'react-router-dom';
import {  useContext, useEffect, useRef, useState  } from 'react'; 
import { handleKeydown, handlePaste } from '../../helpers/6digitHandlers';
import { UserContext } from '../../hooks/ContextVariables';
export default function VlidateToken() {
    const navigate = useNavigate();
    const { scenario } = useParams();
    const sixDigitRef = useRef([]);
    const {httpFetch} = useContext(UserContext);
    const [error, setError] = useState();

    const handleValidatePatch = async ( e ) => {
        let sixDigitCode = ``;
        const subURL = `/validate/token`

        setError(undefined);
    
        for (const el of sixDigitRef.current) {
            if (el.value === ``) {
                setError(`Please provide the FULL 6 digits code provided on your email!`)
            }
            sixDigitCode += String(el.value);
        }
    
        const req = await httpFetch(subURL, {
            method: "PATCH",
            body: JSON.stringify({
                token: sixDigitCode,
                option: scenario
            })
        })
        let msg = ``;
        const status = req.status;
        if (status == 400) return setError(`There's no such token`)
        if (status == 500) {
            msg = `Internal server error!`
            if (import.meta.env.MODE == `development`) {
                msg += ` Please submit error ticked at issues in the github repo.`
            } else {
                msg += ` Please report to an admin => Discord Lychezar or Drunk ingame guild chat announce. Thanks in advance happy hittin ^^`  
            }
        } else if (status == 401) msg = `Bad authorization 6 digit code!`
        else if (status == 201) {

            setTimeout(async () => {
                await httpFetch("/verify/me");
            }, 300);
            return navigate(`/profile`);
        }

        if (msg != ``) return setError(msg);
    
    }

        return (<>
        <div className={Style.banner}>Verify email</div>
        <section className={Style.container}>

            <div>
                <div>Please fill the boxes with the provided 6 digits code in your email</div>
            </div>
            <br />
            
            <div className={Style.codeContainer}>
                <input 
                    ref={
                        (el) => sixDigitRef.current[0] = el
                    } 
                    maxLength={1} 
                    id='0' 
                    tabIndex={0}
                    className={Style.codeBox} 
                    type="text" 
                    onKeyDown={(e) => handleKeydown(e, sixDigitRef)}
                    onPaste={(e) => handlePaste(e, sixDigitRef)}
                    />
                <input 
                ref={
                        (el) => sixDigitRef.current[1] = el
                    } 
                    maxLength={1} 
                    id='1' 
                    tabIndex={1}
                    className={Style.codeBox} 
                    type="text" 
                    onKeyDown={(e) => handleKeydown(e, sixDigitRef)}
                    onPaste={(e) => handlePaste(e, sixDigitRef)}
                    />
                <input 
                    ref={
                        (el) => sixDigitRef.current[2] = el
                    } 
                    maxLength={1} 
                    id='2' 
                    tabIndex={2}
                    className={Style.codeBox} 
                    type="text" 
                    onKeyDown={(e) => handleKeydown(e, sixDigitRef)}
                    onPaste={(e) => handlePaste(e, sixDigitRef)}
                    />
                <input 
                    ref={
                        (el) => sixDigitRef.current[3] = el
                    } 
                    maxLength={1} 
                    id='3' 
                    tabIndex={3}
                    className={Style.codeBox} 
                    type="text" 
                    onKeyDown={(e) => handleKeydown(e, sixDigitRef)}
                    onPaste={(e) => handlePaste(e, sixDigitRef)}
                    />
                <input 
                    ref={
                        (el) => sixDigitRef.current[4] = el
                    } 
                    maxLength={1} 
                    id='4' 
                    tabIndex={4}
                    className={Style.codeBox} 
                    type="text" 
                    onKeyDown={(e) => handleKeydown(e, sixDigitRef)}
                    onPaste={(e) => handlePaste(e, sixDigitRef)}
                    />
                <input 
                    ref={
                        (el) => sixDigitRef.current[5] = el
                    } 
                    maxLength={1} 
                    id='5' 
                    tabIndex={5}
                    className={Style.codeBox} 
                    type="text" 
                    onKeyDown={(e) => handleKeydown(e, sixDigitRef)}
                    onPaste={(e) => handlePaste(e, sixDigitRef)}
                    />
            </div>
            
            {error && (
                <>
                <div style={{color:`red`}}>
                    {error}
                </div>
                </>
            )}

            <button onClick={async(e) => await handleValidatePatch(e)}>Verify email</button>

        </section>
        </>)
}
