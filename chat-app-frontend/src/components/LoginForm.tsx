import { Button, Flex, Input, Space } from "antd";
import React, { useState } from "react";

function LoginForm({ setName }) {
  const [userName, setUserName] = useState("");
  const handleFormChange = e => {
    setUserName(e.target.value);
  };

  return (
    <Flex align="center" justify="center">
      <Input
        style={{ width: 100, height: 20, marginRight: 5 }}
        onChange={handleFormChange}
      />
      <Space>
        <Button
          onClick={() => userName !== "" && setName(userName)}
          type="primary"
          style={{ height: 20, fontSize: 15 }}
        >
          Enter
        </Button>
      </Space>
    </Flex>
  );
}

export default LoginForm;
