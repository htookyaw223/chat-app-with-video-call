import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import {
  Layout,
  Input,
  Button,
  List,
  Typography,
  Space,
  Flex,
  Modal,
} from "antd";
import {
  PhoneOutlined,
  SendOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import { useSocket } from "../../../hook/useSocket";
import { useGetUserProfileQuery } from "../../../reduxtoolkit/userApi";
import { useParams } from "react-router-dom";
import useWebRTC from "../hook/useWebRTC";
import { useSocketListener } from "../hook/useSocketListener";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

// Define the structure of a message
interface Message {
  user: string;
  text: string;
  timestamp: string;
  isSentByCurrentUser: boolean;
  friendId: string;
}

const ChatBoxContainer: React.FC = () => {
  const { data: currentUserData } = useGetUserProfileQuery("", { refetchOnMountOrArgChange: true });
  const userFriendId = useParams().id ?? ""; // Get userId from URL params or use a default
  const socketRef = useSocket();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const {
    localStream,
    remoteStream,
    startCall,
    receivingCall,
    answerCall,
    endCall
  } = useWebRTC(socketRef, userFriendId);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  useEffect(() => {
    if (open) {
      if (localStream && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      if (remoteStream && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    }
  }, [localStream, remoteStream, open]);

  const { messages, setMessages } = useSocketListener(socketRef);
  const [messageInput, setMessageInput] = useState<string>("");
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  // Reference to the message container for auto-scrolling
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Function to scroll to the bottom whenever messages change
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // Scroll to bottom when a new message is added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to send a message
  const sendMessage = (): void => {
    if (!socketRef.current) return;
    if (messageInput.trim()) {
      socketRef.current.emit('sendMessage', { userId: currentUserData?.userId, to: userFriendId, message: messageInput });
      const newMessage: Message = {
        user: "You", // Static user for now, can be dynamic in the future
        text: messageInput,
        timestamp: new Date().toLocaleTimeString(),
        isSentByCurrentUser: true,
        friendId: userFriendId,
      };
      setIsCurrentUser(!isCurrentUser);
      setMessages([...messages, newMessage]);
      setMessageInput(""); // Clear input after sending
    }
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setMessageInput(e.target.value);
  };

  // Handle "Enter" key press
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>

      <Header
        style={{
          backgroundColor: "#c84137",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Flex vertical>
          <Text style={{ color: "#fff", fontSize: "20px" }}>Yamin NgweSin</Text>
          <Text type="warning" strong>
            Online
          </Text>
        </Flex>
        <Space size={30}>
          <PhoneOutlined title="Voice Call" style={{ fontSize: 20 }} />
          <VideoCameraAddOutlined onClick={() => {
            startCall();
            setOpen(true)
          }} title="Video Call" style={{ fontSize: 20 }} />
        </Space>
      </Header>
      <Content
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >
          {/* This empty div will act as a reference point to auto-scroll */}
          <div ref={messageEndRef} />
          <List
            dataSource={messages.filter((message) => message.friendId === userFriendId)}
            renderItem={(message: Message) => (
              <List.Item
                style={{
                  textAlign: message.isSentByCurrentUser ? "right" : "left",
                }}
              >
                <List.Item.Meta
                  title={
                    <Text
                      style={{
                        paddingLeft: 5,
                        paddingRight: 5,
                        display: "inline-block",
                        background: "#f7cdc2",
                        borderRadius: 15,
                      }}
                    >
                      {message.text}
                    </Text>
                  }
                  description={
                    <Text style={{ fontSize: 10 }}>{message.timestamp}</Text>
                  }
                />
              </List.Item>
            )}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Input.TextArea
            rows={2}
            value={messageInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            style={{ flex: 1 }}
          />
          <Button type="primary" icon={<SendOutlined />} onClick={sendMessage}>
            Send
          </Button>
        </div>
      </Content>
      
        <Modal
          title="Title"
          open={receivingCall}
          closable={false}
          onOk={() => {
            answerCall();
            setOpen(true);
            console.log("Answering call", localVideoRef, remoteVideoRef);
          }
          }
          okText="Answer Call"
          cancelText="Decline Call"
        >
          <p>Someone is calling you</p>
        </Modal>
        <Modal
          open={open}
          closable={false}
          style={{ width: '100%', }}
          width={'100%'}
          onOk={() => {
            endCall();
            setOpen(false);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = null;
            }
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = null;
            }
          }}
          okText="End Call"
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          <Flex justify="space-between" align="center" style={{ width: '100%' }}>
            <video ref={localVideoRef} autoPlay muted={false} />
            <video ref={remoteVideoRef} autoPlay muted={false} />
          </Flex>
        </Modal>
      <Footer style={{ textAlign: "center" }}>
        Titalk ©2024 Created by Htoo Kyaw
      </Footer>
    </Layout>
  );
};

export default ChatBoxContainer;
