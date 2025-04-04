import Router from "./router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { handleError } from "./utils/functions";
import axiosInstance from './configs/axios.config';
import { setUser } from "./store/slice/auth";

function App(){
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(!token) return;
    const getSession = async () => {
      try {
        const {data} = await axiosInstance.get('/common/session');
        if(!data.error){
          dispatch(setUser(data.data))
        }
      } catch (error) {
        handleError(error) 
      }
    };
    // getSession();
  },[token, dispatch])
  return <Router/>
}

export default App;