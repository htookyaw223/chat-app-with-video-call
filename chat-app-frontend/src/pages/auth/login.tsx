import { Flex, Form, Input, Button, Card, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../reduxtoolkit/authApi";
import { User } from "../../types/user";
import { useEffect } from "react";
// import { io, Socket } from "socket.io-client";
const { Title, Text } = Typography;
const styles = {
  body: { paddingtop: 10 },
};

// const socket: Socket = io("http://192.168.1.5:4000", { autoConnect: false }); // Your signaling server

const LoginPage = ({}) => {
  const [login, { isLoading, error, isSuccess, data }] = useLoginMutation();
  const navigate = useNavigate();

  const onFinish = (values: User) => {
    login(values);
  };
  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem("token", data.access_token);
      navigate("/messages");
    }
  }, [isSuccess]);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ height: "100vh" }}>
      <Flex justify="center" align="center" style={{ height: "100%" }} vertical>
        <Card
          // bordered
          style={{
            maxWidth: 500,
            minWidth: 330,
            boxShadow: "0 10px 10px -5px #f7cdc2",
          }}
          {...styles.body}
        >
          <Flex
            justify="center"
            align="center"
            style={{ height: "100%" }}
            vertical
          >
            <Title color="primary" level={3}>
              Login
            </Title>
            <Form
              name="basic"
              style={{
                maxWidth: 600,
                minWidth: 250,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 0,
                  span: 24,
                }}
              >
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                  // loading={result.isLoading}
                >
                  Click to Login
                </Button>
              </Form.Item>
            </Form>
            <Text>
              Don't have an account? <Link to="/signup">Click here</Link>{" "}
            </Text>
            <Link to="/forget-password">Forget password?</Link>
          </Flex>
        </Card>
      </Flex>
    </div>
  );
};

export default LoginPage;
