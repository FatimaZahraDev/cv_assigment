import React from 'react'

const UserAvatar = ({avatar ,name ,time}) => {
  return (
     <div className="d-flex align-items-center">
          <img
            src={avatar}
            alt="avatar"
            className="rounded-circle"
            width={40}
            height={40}
          />
          <div className="ms-2">
            <h6 className="mb-0">{name}</h6>
            <small className="text-muted">{time}</small>
          </div>
        </div>
  )
}

export default UserAvatar
