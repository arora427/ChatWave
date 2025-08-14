import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
import { UserCheckIcon, BellIcon, ClockIcon, MessageSquareIcon } from "lucide-react";
import NotificationCard from "../components/NotificationCard";

const NotificationsPage = () => {
	const { data: friendRequests, isLoading } = useQuery({
		queryKey: ["friendRequests"],
		queryFn: getFriendRequests,
	});

	if (isLoading) {
		return (
			<div className='flex justify-center py-12'>
				<span className='loading loading-spinner loading-lg'></span>
			</div>
		);
	}

	// Define both variables from the API response
	const incomingRequests = friendRequests?.incommingReqs || [];
	const acceptedRequests = friendRequests?.acceptedReqs || [];

	return (
		<div className='p-4 sm:p-6 lg:p-8'>
			<div className='container mx-auto max-w-4xl space-y-8'>
				<h1 className='text-2xl sm:text-3xl font-bold tracking-tight mb-6'>Notifications</h1>

				{/* Section 1: Incoming Friend Requests */}
				{incomingRequests.length > 0 && (
					<section className='space-y-4'>
						<h2 className='text-xl font-semibold flex items-center gap-2'>
							<UserCheckIcon className='h-5 w-5 text-primary' />
							Friend Requests
							<span className='badge badge-primary ml-2'>{incomingRequests.length}</span>
						</h2>
						<div className='space-y-3'>
							{incomingRequests.map((request) => (
								<NotificationCard key={request._id} request={request} />
							))}
						</div>
					</section>
				)}

				{/* Section 2: Notifications for Your Accepted Requests */}
				{acceptedRequests.length > 0 && (
					<section className='space-y-4'>
						<h2 className='text-xl font-semibold flex items-center gap-2'>
							<BellIcon className='h-5 w-5 text-success' />
							New Connections
						</h2>
						<div className='space-y-3'>
							{acceptedRequests.map((notification) => (
								<div key={notification._id} className='card bg-base-200 shadow-sm'>
									<div className='card-body p-4'>
										<div className='flex items-start gap-3'>
											<div className='avatar mt-1 size-10 rounded-full'>
												<img
													// Corrected property name: profilepic
													src={notification.recipient.profilepic}
													// Corrected property name: fullname
													alt={notification.recipient.fullname}
												/>
											</div>
											<div className='flex-1'>
												{/* Corrected property name: fullname */}
												<h3 className='font-semibold text-xl'>{notification.recipient.fullname}</h3>
												<p className='text-sm my-1'>
													You are now friends with {notification.recipient.fullname}.
												</p>
												<p className='text-xs flex items-center opacity-70'>
													<ClockIcon className='h-3 w-3 mr-1' />
													Recently
												</p>
											</div>
											<div className='badge badge-success'>
												<MessageSquareIcon className='h-3 w-3 mr-1' />
												New Friend
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</section>
				)}

				{/* Section 3: Message for when there are no notifications at all */}
				{incomingRequests.length === 0 && acceptedRequests.length === 0 && (
					<div className='text-center py-12'>
						<BellIcon className='mx-auto h-12 w-12 text-base-content opacity-30' />
						<h3 className='mt-2 text-lg font-medium'>No notifications yet</h3>
						<p className='mt-1 text-sm text-base-content opacity-60'>
							We'll let you know when something new comes up.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default NotificationsPage;