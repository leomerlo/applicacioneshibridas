import { Navigate } from "react-router-dom"

function RoutePrivate({children}: {children: React.ReactNode}){

    if(!localStorage.getItem('token')){
        return <Navigate to="/login" />
    }

    return children
}

export default RoutePrivate