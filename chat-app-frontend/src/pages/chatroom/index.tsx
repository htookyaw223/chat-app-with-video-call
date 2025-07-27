import { Avatar, Badge, Layout, List, Typography } from "antd";
import { useGetFriendsQuery, useGetUserProfileQuery } from "../../reduxtoolkit/userApi";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate, useOutlet, useParams } from "react-router-dom";

const { Sider, Content } = Layout;
const { Title } = Typography;
interface DataType {
  name: string;
  image: string;
  status: string;
  id: string;
}

export const ChatRoomPage = () => {
  const { data: user } = useGetUserProfileQuery("", { refetchOnMountOrArgChange: true });
  const { data: friends } = useGetFriendsQuery(
    user?.userId || "",
    { refetchOnMountOrArgChange: true, skip: !user?.userId });
  const outlet = useOutlet();
  const navigate = useNavigate();
  const userId = useParams().id;
  return (
    <Layout>
      <Sider width={240} theme="light">
        <div style={{ height: 80, display: "flex", alignItems: "center", padding: "0 16px" }}>
          <Title level={4} style={{ margin: 0 }}>Chats</Title>
        </div>

        <div
          id="scrollableDiv"
          style={{
            overflowY: "auto",
            height: "calc(100vh - 80px)", // fill remaining space
            borderTop: "1px solid rgba(140, 140, 140, 0.35)",
          }}
        >
          <List
            dataSource={friends}
            itemLayout="horizontal"
            renderItem={(user: { name: string, isOnline: boolean, userId: string }) => (
              <List.Item
                style={{ padding: "10px 16px", backgroundColor: user?.userId === userId ? "#f0f8ff" : "#fff" }}
                onClick={() => { navigate(`/messages/${user?.userId}`) }}
              >
                <List.Item.Meta
                  avatar={
                    <Badge
                      dot
                      status={user?.isOnline ? "success" : "default"}
                      offset={[-2, 2]}
                    >
                      <Avatar icon={<UserOutlined />} />
                    </Badge>
                  }
                  title={user?.name}
                  description={user.isOnline ? "Online" : "Offline"}
                />
              </List.Item>
            )}
          />
        </div>
      </Sider>

      <Content>
        {outlet}
      </Content>
    </Layout>
  );
};
