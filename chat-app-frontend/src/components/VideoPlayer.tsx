import { useEffect, useRef, useState } from "react";
import useWebRTC from "../hook/useWebRTC";
import { Modal } from "antd";

function VideoPlayer() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const {
    localStream,
    remoteStream,
    createOffer,
    startCall,
    receivingCall,
    answerCall,
  } = useWebRTC();

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);
  
  useEffect(() => {
    console.log("receiving call", receivingCall);
    setOpen(receivingCall);
  }, [receivingCall]);

  return (
    <div>
      <button onClick={startCall}>start call</button>
      <div>me</div>
      <video ref={localVideoRef} autoPlay muted />
      <div>remote</div>
      <video ref={remoteVideoRef} autoPlay />
      <Modal
        title="Title"
        open={open}
        closable={false}
        onOk={answerCall}
        // confirmLoading={confirmLoading}
        // onCancel={handleCancel}
      >
        <p>Someone is calling you</p>
      </Modal>
    </div>
  );
}

export default VideoPlayer;
