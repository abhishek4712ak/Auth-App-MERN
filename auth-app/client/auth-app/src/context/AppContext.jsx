import { createContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = "https://auth-app-mern-2.onrender.com";
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);
    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/user-data?Content-Type=application/json');
            data.success ? setUserData(data.userData) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const value = {
        backendUrl,
        isLoggedIn,
        userData,
        setIsLoggedIn,
        setUserData,
        getUserData
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
    

}   



