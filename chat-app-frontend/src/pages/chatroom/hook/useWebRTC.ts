import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }, // STUN server to find public IP
    {
      urls: "turn:numb.viagenie.ca", // Optional: TURN server for NAT traversal
      credential: "muazkh",
      username: "webrtc@live.com",
    },
  ],
};

export default function useWebRTC(socketRef: MutableRefObject<Socket | null>, userFriendId: string) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!socketRef.current) return;
    peerConnection.current = new RTCPeerConnection(configuration);

    // Listen for ICE candidates from the peer
    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        if (socketRef.current) {
          socketRef.current.emit("signal", {
            type: "icecandidate",
            to: userFriendId,
            candidate: event.candidate,
          });
        }
      }
    };

    // Listen for remote streams
    peerConnection.current.ontrack = event => {
      setRemoteStream(event.streams[0]); // Attach remote stream to UI
    };

    // Listen for incoming signaling messages
    socketRef.current.on("signal", (data: any) => {
      handleSignalingData(data);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("signal");
      }
      peerConnection.current?.close();
    };
  }, []);

  const endCall = () => {
    // Stop all local media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);
  }

  // Create an offer to initiate the connection
  const createOffer = () => {
    console.log("Creating offer...");
    peerConnection.current
      ?.createOffer()
      .then(offer => peerConnection.current?.setLocalDescription(offer))
      .then(() => {
    console.log("Creating offer...1");
        if (socketRef.current) {
    console.log("Creating offer...2");
          socketRef.current.emit("signal", {
            to: userFriendId,
            type: "offer",
            offer: peerConnection.current?.localDescription,
          });
        }
      })
      .catch(err => console.error("Error creating an offer:", err));
  };

  // Handle received signaling data (offer, answer, ICE candidates)
  const handleSignalingData = (data: any) => {
    console.log("Received signaling data:", data);
    switch (data.type) {
      case "offer":
        handleReceiveOffer(data.offer);
        break;
      case "answer":
        handleReceiveAnswer(data.answer);
        break;
      case "icecandidate":
        handleNewICECandidate(data.candidate);
        break;
      default:
        break;
    }
  };

  // Handle received offer
  const handleReceiveOffer = (offer: RTCSessionDescriptionInit) => {
    setReceivingCall(true);
    peerConnection.current
      ?.setRemoteDescription(new RTCSessionDescription(offer))
      .catch(err => console.error("Error handling offer:", err));
  };

  // Handle received answer
  const handleReceiveAnswer = (answer: RTCSessionDescriptionInit) => {
    peerConnection.current
      ?.setRemoteDescription(new RTCSessionDescription(answer))
      .then(() => peerConnection.current?.createAnswer())
      .then(answer => peerConnection.current?.setLocalDescription(answer))
      .catch(err => console.error("Error handling answer:", err));
  };

  // Handle ICE candidates
  const handleNewICECandidate = (candidate: RTCIceCandidateInit) => {
    const iceCandidate = new RTCIceCandidate(candidate);
    peerConnection.current
      ?.addIceCandidate(iceCandidate)
      .catch(err => console.error("Error adding ICE candidate:", err));
  };

  //call
  const startCall = () => {
    // Get local media stream only when starting call
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        stream.getTracks().forEach(track => {
          console.log("Adding connection", track);
          peerConnection.current?.addTrack(track, stream); // Add tracks to peer connection
        });
        createOffer();
      })
      .catch(error => console.error("Error accessing media devices.", error));
  };

  const answerCall = () => {
    // Get local media stream only when answering call
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        stream.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, stream); // Add tracks to peer connection
        });
        return peerConnection.current?.createAnswer();
      })
      .then(answer => peerConnection.current?.setLocalDescription(answer))
      .then(() => {
        if (socketRef.current) {
          console.log("Answering call with answer:", peerConnection.current?.localDescription);
          socketRef.current.emit("signal", {
            type: "answer",
            to: userFriendId,
            answer: peerConnection.current?.localDescription,
          });
        }
      })
      .catch(err => console.error("Error creating an answer:", err));
    setReceivingCall(false);
  };

  return {
    localStream,
    remoteStream,
    createOffer,
    startCall,
    receivingCall,
    answerCall,
    endCall
  };
}
