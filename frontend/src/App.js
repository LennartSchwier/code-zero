import React, {useState} from 'react';
import HeadSail from "./components/HeadSail";
import {Switch, Route, Redirect} from "react-router-dom";
import TrimInput from "./components/TrimInput";
import MainSail from "./components/MainSail";
import Dashboard from "./components/Dashboard";
import usePositioning from "./hooks/usePositioning";
import Login from "./components/Login";
import useLoginData from "./hooks/useLoginData";
import ProtectedRoute from "./routing/ProtectedRoute";
import WeatherDataContextProvider from "./contexts/WeatherDataContextProvider";


export default function App() {

    const [latitude, longitude, errorMessage] = usePositioning();
    const [loginData, setLoginData] = useLoginData();
    const [course, setCourse] = useState(null);

    return (
        <WeatherDataContextProvider>
            <Switch>
                <Route path={"/login"}>
                    <Login loginData={loginData} setLoginData={setLoginData}/>
                </Route>
                <ProtectedRoute path={"/dashboard"}>
                    <Dashboard latitude={latitude} longitude={longitude} errorMessage={errorMessage} />
                </ProtectedRoute>
                <ProtectedRoute path={"/triminput"}>
                    <TrimInput course={course} setCourse={setCourse}
                               latitude={latitude} longitude={longitude}
                    />
                </ProtectedRoute>
                <ProtectedRoute path={"/headsail"}>
                    <HeadSail
                        course={course}
                    />
                </ProtectedRoute>
                <ProtectedRoute path={"/mainsail"}>
                    <MainSail
                        course={course}
                    />
                </ProtectedRoute>
                <Route path={"/"}>
                    <Redirect to={"/dashboard"}/>
                </Route>
            </Switch>
        </WeatherDataContextProvider>
  );
}

