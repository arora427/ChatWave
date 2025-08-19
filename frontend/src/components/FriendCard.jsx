import { MessageCircle, MessageCircleDashed, MessageSquareText, UserRoundX } from 'lucide-react';
import React from 'react';
// Correct import for modern React Router (v6+)
import { Link, useLocation } from 'react-router';
import { removeFriend } from '../lib/api';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';



function FriendCard({ friend }) {
  const queryClient = useQueryClient();
  const { mutate: removeFriendMutation, isPending } = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      // 2. Refresh the friends list automatically on success
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast.success("Friend removed",{
      style: {
        fontSize: '1rem',
        minWidth: 'auto',
        borderRadius: '8px',
        maxWidth: '250px',
      }});
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Could not remove friend",{
      style: {
        fontSize: '1rem',
        minWidth: 'auto',
        borderRadius: '8px',
        maxWidth: '250px',
      }});
    }
  });

  const location = useLocation();
  const currentPath = location.pathname;
  const isFriendPage = location.pathname?.startsWith("/friends")
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
              <p className='text-sm opacity-70 truncate mt-1'>
                <div className="flex items-center text-xs opacity-70 mt-1">
                  <MessageCircleDashed className='size-4 mr-2' />
                  {friend.bio}
                </div>
              </p>

            )}
          </div>

        </div>

        {/* Action Button */}
        <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
          Message
        </Link>
        { isFriendPage && 
        <button
          className='btn btn-error btn-outline flex-1'
          onClick={() => removeFriendMutation(friend._id)}
          disabled={isPending}
        >
          {isPending ? <span className="loading loading-spinner loading-xs" /> : <UserRoundX className='size-4 mr-2' />}
          {isPending ? "" : "Remove"}
        </button>
}
      </div>
    </div>
  );
}

export default FriendCard;