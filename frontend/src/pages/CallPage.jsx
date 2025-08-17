import React, { useEffect, useState } from 'react'

import { useParams, useNavigate } from 'react-router';
import useAuthUser from '../hooks/useAuthUser';

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
  name,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const {id:callId} = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser, //only when user is authenticated
  });

  useEffect(()=>{
    const initCall=async ()=>{
      
      if(!tokenData?.token || !authUser || !callId) return;

      try {
        console.log("Initializing Stream Video Call Client")
        const user={
          id:authUser._id,
          name: authUser.fullname,
          image: authUser.profilepic
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        })
        const callInstance = videoClient.call("default",callId);
        await callInstance.join({create:true})
        console.log("Call Joined Successfully")
        setClient(videoClient)
        setCall(callInstance)
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      }
      finally {
        setIsConnecting(false);
      }
    }
    initCall()
  },[tokenData,authUser,callId])

  if(isConnecting) return <PageLoader/>

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage