import React from 'react'
import { Link } from 'react-router'

function FriendCard({friend}) {
  return (
    <div className='card bg-base-200 hover:shadow-md transition-shadow'>
        <div className="card-body p-4">
            {/* user Info */}
            <div className="flex items-center gap-3 mb-3">
                <div className="avatar size-12">
                    <img src={friend.profilepic} alt={friend.fullname} />
                    <div>
                        <h3 className='font-semibold truncate'>{friend.fullname}</h3>
                        
                    </div>
                    <div className="font-mono text-lg">
                        <h3 className='truncate'>{friend.bio}</h3>
                    </div>
                </div>

            </div>

            <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
            Message
            </Link>
        </div>
      
    </div>
  )
}

export default FriendCard
