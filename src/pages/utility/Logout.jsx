import { useContext, useEffect } from "react";
import { UserContext } from "../../hooks/ContextVariables";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const {httpFetch} = useContext(UserContext);
    const navigate = useNavigate();


    const logoutReq = async () => {
        const req = await httpFetch(`/logout`);

        if (req.status == 200) {
            await new Promise(resolve => setTimeout(resolve, 300)); 
            const endSession = await httpFetch(`/verify/me`);

            if (endSession.status === 200) await new Promise(resolve => setTimeout(resolve, 300));

            if (endSession.status == 403) return navigate(`/`);
        }
    }

    useEffect(() => {
        (async () => {
          await logoutReq();
        })();
      }, []);
      

    return (<>Loading...</>)

}