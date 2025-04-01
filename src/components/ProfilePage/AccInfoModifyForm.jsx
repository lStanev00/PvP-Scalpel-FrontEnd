import { useContext, useState, useRef } from 'react';
import { UserContext } from '../../hooks/ContextVariables';
import { useNavigate } from 'react-router-dom';

export function UsernameForm ({currentUsername, setEditUsername}) {
    const {httpFetch, setUser} = useContext(UserContext);
    const [error, setError] = useState();
    const refList = useRef([]);

    const handleUsernameModification = async (e) => {
        e.preventDefault();

        setError(undefined);
        
        const newUsername = (new FormData(e.target)).get("username").trim();

        if (!newUsername) return setError(`Please provide username`);
        if (newUsername.length < 3) return setError(`Username have to be at last 3 symbols long!`);

        try {
            const req = await httpFetch(`/change/username`, {
                method: "PATCH",
                body: JSON.stringify({newUsername}),
            })

            const status = req.status;
            if (status == 400) return setError(`Please provide new Username`);
            if (status == 409) return setError(req.data.msg); 
            if (status == 500) return setError(`Internal server error! Please report or open issue on github.`); 
            if (status == 201){
                setUser(req.data)
                setTimeout(async () => {
                    await httpFetch("/verify/me")
                }, 500);

            }
        } catch (error) {
            return setError(`Fetch error: ${error}`);
        }
        
    }
    return(<>
        <div>
            <form ref={el => refList.current = el} style={{marginBottom:`10px`}} onSubmit={async (e) => await handleUsernameModification(e)}>

                <input type="text" name='username' defaultValue={currentUsername} />
                {error && (
                    <p style={{color:'red', fontWeight: `bold`}}>{error}</p>
                )}


            </form>
                <button style={{marginRight:`10px`}} onClick={(e) => {e.preventDefault();refList.current.requestSubmit()}}>Submit</button>
                <button onClick={(e) => {e.preventDefault();setEditUsername(false)}}>Cancel</button>
        </div>
    </>)
}

export function EmailForm ({ email, setEditEmail }) {
    const navigate = useNavigate();
    const refList = useRef([]);
    const [error, setError] = useState();
    const {httpFetch, setUser} = useContext(UserContext);

    const handleEmailModification = async (e) => {
        e.preventDefault();

        setError(undefined);
        
        const newEmail = (new FormData(e.target)).get("email").trim();

        if (!newEmail) return setError(`Please provide Email`);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) return setError(`Please provide a valid email address!`);

        try {
            const req = await httpFetch(`/change/email`, {
                method: "PATCH",
                body: JSON.stringify({newEmail}),
            })

            const status = req.status;
            if (status == 400) return setError(req.data.msg);
            if (status == 409) return setError(req.data.msg); 
            if (status == 500) return setError(`Internal server error! Please report or open issue on github.`); 
            if (status == 201){
                setUser(req.data)
                setTimeout(async () => {
                    await httpFetch("/verify/me");
                    navigate(`/validate/email`)
                }, 500);

            }
        } catch (error) {
            return setError(`Fetch error: ${error}`);
        }
        
    }


    return (<>
        <div>
            <form ref={(el) => refList.current = el} onSubmit={async (e) => await handleEmailModification(e)}>
                <input name="email" defaultValue={email} type="email" />
            </form>

            {error && (
                    <p style={{color:'red', fontWeight: `bold`}}>{error}</p>
            )}
            <button style={{marginRight:`10px`}} onClick={(e) => {e.preventDefault();refList.current.requestSubmit()}}>Submit</button>
            <button onClick={(e) => {e.preventDefault();setEmailUsername(false)}}>Cancel</button>
        </div>
    </>)
}