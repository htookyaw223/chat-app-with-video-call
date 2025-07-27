import { Layout } from "antd";
import { useEffect } from "react";
import { useNavigate, useOutlet } from "react-router-dom";
import SiderMenu from "../components/SiderMenu";
const { Content } = Layout;

const PageLayout = () => {
  const outlet = useOutlet();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <Layout style={{ ...layoutStyle }}>
      <SiderMenu />
      <Layout>
        <Content>{outlet}</Content>
      </Layout>
    </Layout>
  );
};
const layoutStyle = {
  overflow: "hidden",
  width: "100%",
  height: "100vh",
};
export default PageLayout;
