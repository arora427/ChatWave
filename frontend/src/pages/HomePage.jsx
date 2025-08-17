import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { getoutGoingFriendReqs, getRecommendedUsers, getUserFriends, sendFriendRequest } from '../lib/api.js';
import { Link } from 'react-router'
import { CheckCircleIcon, MapPinIcon, UserIcon, UserPlusIcon } from 'lucide-react';
import FriendCard from '../components/FriendCard.jsx';
import NoFriendsFound from '../components/NoFriendsFound.jsx';

function HomePage() {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends
  });
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers
  });
  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getoutGoingFriendReqs
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] })
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);



  return (
    <div className="p-4 sm:p-6 lg:p-8 ">
      <div className="container mx-auto space-y-10  ">

        {/* Top section with title and button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className='text-xl sm:text-2xl font-bold tracking-tight'>Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm flex items-center">
            <UserIcon className='w-5 h-5 mr-2' />
            Friend Requests
          </Link>
        </div>

        {/* Friends List */}
        {loadingFriends ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg' />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* Recommended Users */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Start the Conversation.</h2>
                <p className="opacity-70 text-xl mt-1">
                  Your next great chat is just a wave away
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center p-12">
              <span className='loading loading-spinner loading-lg' />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className='font-semibold text-lg mb-2'>No Recommended Users</h3>
              <p className="text-base-content opacity-70 text-lg">
                Check Back Later For new Friends
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div key={user._id}>
                    <div className="card bg-base-200 hover:shadow-lg transition-all duration-300">
                      <div className="card-body p-5 space-y-4">

                        {/* Profile Section */}
                        <div className="flex items-center gap-3">
                          <img src={user.profilepic} alt={user.fullname} className="w-12 h-12 rounded-full object-cover" />
                          <div>

                            <h3 className='font-semibold text-lg'>{user.fullname}</h3>
                            {user.location && (
                              <div className="flex items-center text-xs opacity-70 mt-1">
                                <MapPinIcon className='w-4 h-4 mr-1' />
                                {user.location ?? "Location not available"}
                              </div>

                            )}
                          </div>
                        </div>

                        {/* Bio */}
                        {user.bio && <p className='text-sm opacity-70'>{user.bio}</p>}

                        {/* Action Button */}
                        <button
                          className={`btn w-full mt-2 flex items-center ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`}
                          onClick={() => sendRequestMutation(user._id)}
                          disabled={hasRequestBeenSent || isPending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className="w-5 h-5 mr-2" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="w-5 h-5 mr-2" />
                              Send Friend Request
                            </>
                          )}
                        </button>

                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default HomePage
