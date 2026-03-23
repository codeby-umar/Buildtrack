import React from 'react'
import TopSelection from '../components/TopSelection';
import BestProdects from '../components/BestProducts';
import CurrentDeals from "../components/CurrentDeals";

function Home() {
  return (
    <div className='conatiner'>
         <TopSelection/>
         <CurrentDeals/>
         <BestProdects/>
    </div>
  )
}

export default Home