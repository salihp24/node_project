import React from 'react'
import Navbar from './Navbar'
import ProductList from '../Components/ProductList'
import BannerSlider from './BannerSlider'

function Home() {
  return (
    <div>
      <BannerSlider/>
      <ProductList />
    </div>
  )
}

export default Home