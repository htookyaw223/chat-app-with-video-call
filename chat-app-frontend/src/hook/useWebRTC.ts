import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://192.168.1.5:3001", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJuYW1lIjoiaHRvb2t5YXciLCJ1c2VySWQiOiI2NzFmNGU1MDc1MDI4OTdjZDk0N2Q5N2UifSwiaWF0IjoxNzMwMTIyMDg0LCJleHAiOjE3MzAxMjU2ODR9.an_gTwP9-IXn798hvQbAXzx8kVj3mBtE6YAh7GDOxxM",
  },
}); // Your signaling server

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

export default function useWebRTC() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    
    peerConnection.current = new RTCPeerConnection(configuration);
    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        // setLocalStream(stream);
        stream.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, stream); // Add tracks to peer connection
        });
      })
      .catch(error => console.error("Error accessing media devices.", error));

    // Listen for ICE candidates from the peer
    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        socket.emit("signal", {
          type: "icecandidate",
          candidate: event.candidate,
        });
      }
    };

    // Listen for remote streams
    peerConnection.current.ontrack = event => {
      setRemoteStream(event.streams[0]); // Attach remote stream to UI
    };

    // Listen for incoming signaling messages
    socket.on("signal", data => {
      handleSignalingData(data);
    });

    // Cleanup on unmount
    return () => {
      socket.off("signal");
      peerConnection.current?.close();
    };
  }, []);

  // Create an offer to initiate the connection
  const createOffer = () => {
    peerConnection.current
      ?.createOffer()
      .then(offer => peerConnection.current?.setLocalDescription(offer))
      .then(() => {
        socket.emit("signal", {
          type: "offer",
          offer: peerConnection.current?.localDescription,
        });
      })
      .catch(err => console.error("Error creating an offer:", err));
  };

  // Handle received signaling data (offer, answer, ICE candidates)
  const handleSignalingData = (data: any) => {
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

    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        stream.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, stream); // Add tracks to peer connection
        });
      })
      .catch(error => console.error("Error accessing media devices.", error));
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
    createOffer();
    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        stream.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, stream); // Add tracks to peer connection
        });
      })
      .catch(error => console.error("Error accessing media devices.", error));
  };
  const answerCall = () => {
    peerConnection.current
      ?.createAnswer()
      .then(answer => peerConnection.current?.setLocalDescription(answer))
      .then(() => {
        socket.emit("signal", {
          type: "answer",
          answer: peerConnection.current?.localDescription,
        });
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
  };
}
