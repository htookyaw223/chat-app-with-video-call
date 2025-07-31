import { Layout, Spin, Typography } from "antd";
import { useGetUserProfileQuery } from "../../reduxtoolkit/userApi";
import { FriendsTable } from "./friendTables";

const { Header, Content, Footer } = Layout;

export const FriendListPage = () => {
    const { data: user, isLoading, isFetching } = useGetUserProfileQuery("", { refetchOnMountOrArgChange: true });


    return (
        <Spin spinning={isLoading || isFetching} tip="Loading...">
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
                    <Typography.Text style={{ color: "#fff", fontSize: "20px" }}>Available Users</Typography.Text>
                </Header>
                <Content>
                    <FriendsTable currentUserId={user?.userId} />
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    Titalk ©2024 Created by Htoo Kyaw
                </Footer>
            </Layout>
        </Spin>
    );
}