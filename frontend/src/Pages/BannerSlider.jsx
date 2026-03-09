import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BannerSlider.css"




const Banners=[
    {
    id: 1,
    image: "/images/1.png",
    title: "Premium Watches",
    subtitle: "Crafted for timeless elegance",
    buttonText: "Shop Now",
    link: "/products"
  },
  {
    id: 2,
    image: "/images/2.png",
    title: "Luxury Collection",
    subtitle: "Designed for modern lifestyle",
    buttonText: "Explore",
    link: "/products"
  },
  {
    id: 3,
    image: "/images/3.png",
    title: "New Arrivals",
    subtitle: "Exclusive designs just for you",
    buttonText: "View Collection",
    link: "/products"
  }
]


function BannerSlider() {
    const [index,setIndex]=useState(0)
    const navigate=useNavigate()

    useEffect(()=>{
        const interval=setInterval(()=>{
            setIndex(prev=>(prev+1)%Banners.length)
        }, 4000)
        return ()=> clearInterval(interval)
    },[])
    const currentBanner=Banners[index]
  return (
    <div className="banner-slider-wrapper">
      <div className="banner-slide">
        <img
          src={currentBanner.image}
          alt={currentBanner.title}
        />

        <div className="banner-text-content">
          <h1>{currentBanner.title}</h1>
          <p>{currentBanner.subtitle}</p>

          <button
            className="banner-cta-button"
            onClick={() => navigate(currentBanner.link)}
          >
            {currentBanner.buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BannerSlider