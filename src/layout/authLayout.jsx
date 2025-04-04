import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Loading from '../components/Loading'

const authLayout = () => {
    return(
        <>
            <Suspense fallback={<Loading/>}>
                <Outlet/>
            </Suspense>
        </>
    )
}

export default authLayout;