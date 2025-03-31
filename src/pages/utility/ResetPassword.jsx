import { Link, useSearchParams } from "react-router-dom";
import EmailFormRequest from "../../components/ResetPassword/EmailFormRequest";
export default function ResetPassword () {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    
    if(!token) return (<><EmailFormRequest /></>)
    
    

}