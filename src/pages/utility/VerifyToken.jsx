import Style from '../../Styles/modular/Verify.module.css';
import {  useParams  } from 'react-router-dom';
import {  useEffect, useRef  } from 'react'; 
import { handleKeydown, handlePaste } from '../../helpers/6digitHandlers';
export default function VerifyToken() {
    const { scenario } = useParams();
    const sixDigitRef = useRef([]);

    useEffect(() => {
        if (sixDigitRef.current.length > 4) {
            for (const input of sixDigitRef.current) {
                input.addEventListener("paste", (e) => handlePaste(e, sixDigitRef));
            };
        };

        return () => {
            for (const input of sixDigitRef.current) {
                input.removeEventListener("paste", (e) => handlePaste(e, sixDigitRef));
                
            }
        }
    })

    if (scenario == `email`) {
        return (<>


        <div className={Style.banner}>Verify email</div>
        <section className={Style.container}>

            <div>
                <div>Please fill the boxes with the provided code in your email</div>
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
                    />
            </div>

            <button type="submit">Verify email</button>

        </section>
        </>)
    }
}
