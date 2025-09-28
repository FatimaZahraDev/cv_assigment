import React from 'react'
import { Button } from 'antd'

const IconButton = ({icon ,iconPosition ,title ,className, onClick}) => {
  return (
    <Button type="primary" icon={icon} iconPosition={iconPosition} onClick={onClick} className={className} >
        {title}
    </Button>
  )
}

export default IconButton