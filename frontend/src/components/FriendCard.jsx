import React from 'react';
// Correct import for modern React Router (v6+)
import { Link } from 'react-router';

function FriendCard({ friend }) {
  return (
    <div className='card bg-base-200 hover:shadow-md transition-shadow'>
      <div className="card-body p-4">
        {/* User Info Section */}
        <div className="flex items-center gap-4 mb-4">
          
          {/* 1. Avatar Div (self-contained) */}
          <div className="avatar">
            <div className="w-14 rounded-full">
              <img src={friend.profilepic} alt={friend.fullname} />
            </div>
          </div>

          {/* 2. Text Div (for name and bio) */}
          <div className="flex-1 min-w-0">
            <h3 className='font-semibold truncate text-lg'>{friend.fullname}</h3>
            {friend.bio && (
              <p className='text-sm opacity-70 truncate mt-1'>{friend.bio}</p>
            )}
          </div>

        </div>

        {/* Action Button */}
        <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
          Message
        </Link>
      </div>
    </div>
  );
}

export default FriendCard;