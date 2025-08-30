import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useAuthUser from '../hooks/useAuthUser.js';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api.js';
import { toast } from 'react-hot-toast';

import {
  Channel,
  ChannelHeader,
  Chat, // 👈 1. IMPORT THE CHAT PROVIDER
  MessageInput,
  MessageList,
  Thread,
  Window,
  
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import { EmojiPicker } from 'stream-chat-react/emojis';
import ChatLoader from '../components/ChatLoader.jsx';
import CallButton from '../components/CallButton.jsx';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser, //only when user is authenticated
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        
      const options = { disableOffline: true };
      
      // 2. PASS THE OPTIONS TO THE CLIENT INSTANCE
      const client = StreamChat.getInstance(STREAM_API_KEY, options);
        

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullname,
            image: authUser.profilepic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join('-');

        const currChannel = client.channel('messaging', channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error('Error initializing chat:', error);
        toast.error('Could not connect, please try again later.',{
      style: {
        fontSize: '1rem',
        minWidth: 'auto',
        borderRadius: '8px',
        maxWidth: '250px',
      }});
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () =>{
      if(channel){
        const callUrl = `${window.location.origin}/call/${channel.id}`
         channel.sendMessage({
        text:`I have statred the video call ${callUrl}`
      })
      }

     
      toast.success("Video Call Started",{
      style: {
        fontSize: '1rem',
        minWidth: 'auto',
        borderRadius: '8px',
        maxWidth: '250px',
      }})
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className='h-[93vh]'>
      {/* 👇 2. WRAP YOUR COMPONENTS IN THE CHAT PROVIDER */}
      <Chat client={chatClient}>
        <Channel channel={channel} EmojiPicker={EmojiPicker}>
          <div className='w-full relative'>
            <CallButton handleVideoCall={handleVideoCall}  />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput grow />
            </Window>
          </div>
          <Thread/>
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;