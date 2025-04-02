import { useContext } from "react";
import { UserContext } from "../hooks/ContextVariables";

export default function Posts() {
    const {httpFetch} = useContext(UserContext);

    return (<>
        Building now..
    </>)
}