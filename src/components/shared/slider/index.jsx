import React from 'react'
import Slider from 'react-slick';

const CustomSlider = ({children}) => {
  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <div
        className={className}
        onClick={onClick}
      >
        <img src="/assets/img/right-arrow-slider.png" alt="" />
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
      <div
        className={className}
        onClick={onClick}
      >
        <img src="/assets/img/left-arrow-slider.png" alt="" />
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };
  return (
    <Slider {...settings}>
      {children}
    </Slider>
  )
}

export default CustomSlider
