import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest } from "../lib/api";

const NotificationCard = ({ request }) => {
  const queryClient = useQueryClient();

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  return (
    <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar w-14 h-14 rounded-full bg-base-300">
              <img src={request.sender.profilepic} alt={request.sender.fullname} />
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-1">{request.sender.fullname}</h3>
                <p className="font-medium text-sm">{request.sender.bio}</p>
            </div>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => acceptRequestMutation(request._id)}
            disabled={isPending}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;