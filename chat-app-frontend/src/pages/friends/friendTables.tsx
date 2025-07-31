import { Table, Button, Tag, Space } from "antd";
import { useGetAvailableFriendsQuery, useSendFriendRequestMutation, useRespondToFriendRequestMutation } from "../../reduxtoolkit/friendRequestApi";

const statusColors = {
  PENDING: "orange",
  ACCEPTED: "green",
  DECLINED: "red",
  NONE: "blue",
};

export const FriendsTable = ({ currentUserId }: { currentUserId: string }) => {
  const { data = [], isLoading, refetch } = useGetAvailableFriendsQuery(currentUserId, { skip: !currentUserId });
  const [sendRequest] = useSendFriendRequestMutation();
  const [respondRequest] = useRespondToFriendRequestMutation();

  const handleSendRequest = async (receiverId: string) => {
    await sendRequest({ senderId: currentUserId, receiverId });
    refetch();
  };

  const handleRespond = async (requestId: string, action: "ACCEPT" | "DECLINE") => {
    await respondRequest({ requestId, action });
    refetch();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: keyof typeof statusColors) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => {
        const { _id, status, requestId } = record;

        if (status === "NONE") {
          return <Button onClick={() => handleSendRequest(_id)}>Send Request</Button>;
        }

        if (status === "PENDING" && record.receiver === currentUserId) {
          // Show Accept/Decline only if current user is the one who received it
          return (
            <Space>
              <Button type="primary" onClick={() => handleRespond(requestId, "ACCEPT")}>Accept</Button>
              <Button danger onClick={() => handleRespond(requestId, "DECLINE")}>Decline</Button>
            </Space>
          );
        }

        return null;
      },
    },
  ];

  return <Table loading={isLoading} columns={columns} dataSource={data} rowKey="_id" />;
};
