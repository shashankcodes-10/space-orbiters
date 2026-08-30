import React from 'react'
import {Route,Routes} from 'react-router-dom';
import MainBodies from '../pages/MainBodies';
import NasaImages from '../pages/NasaImages';
import Picture from '../pages/Picture';
import Home from '../pages/Home';
import Images from '../pages/Images';
import SatelliteInfo from '../pages/SatelliteInfo';
import Spaces from '../components/Spaces';


function routes() {
    return (
       
       <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/images' element={<Images/>} />
        <Route path='/spaces' element={<Spaces/>} />
        <Route path='/Satellite' element={<SatelliteInfo/>} />
        <Route path='/NasaImages' element={<NasaImages/>} />

        <Route path='/MainBodies' element={<MainBodies/>} />
        <Route path='/Picture' element={<Picture/>} />
        </Routes>

  )
}

export default routes;
