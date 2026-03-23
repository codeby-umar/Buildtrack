import React from 'react'
import TopSelection from '../components/TopSelection';
import BestProdects from '../components/BestProducts';

function Home() {
  return (
    <div className='conatiner'>
         <TopSelection/>
         <BestProdects/>
    </div>
  )
}

export default Home