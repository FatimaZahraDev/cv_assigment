import React from 'react'
import { useNavigate,  } from 'react-router-dom';

const BackButton = ({title="Back"}) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(-1)} className='d-flex align-items-center cursor-pointer'>
      <div><img src="/assets/img/back-arrow.png" /></div>
      <div><h2 className='font-18 ms-2 mt-1 color-dark-blue'>{title}</h2></div>
    </div>
  )
}

export default BackButton
