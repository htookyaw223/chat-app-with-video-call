import { createBrowserRouter } from "react-router-dom";
import PageLayout from "../pages";
import { ChatRoomPage } from "../pages/chatroom";
import LoginPage from "../pages/auth/login";
import ChatBoxContainer from "../pages/chatroom/components/ChatBox";
import { FriendListPage } from "../pages/friends";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <PageLayout />,
    errorElement: <div>error page</div>,
    children: [
      {
        path: "/",
        element: <ChatRoomPage />,
        children: [
          { path: ":id", element: <ChatBoxContainer /> }, // Dynamic route for chat with specific user  
        ]
      },
      {
        path: "/friends",
        element:<FriendListPage />
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <div>error page</div>,
  },
]);
