import { Link, useSearchParams } from "react-router-dom";
import EmailFormRequest from "../../components/ResetPassword/EmailFormRequest";
import HandlePasswordReset from "../../components/ResetPassword/HandlePasswordReset";
export default function ResetPassword () {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    
    if(!token) return (<><EmailFormRequest /></>)
    
    return (<><HandlePasswordReset token={token}/></>)
}