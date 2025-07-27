
import { App as AntdApp, ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Provider } from "react-redux";
import { store } from "./state";

function App() {
  return (
    <AntdApp>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#c84137",
            borderRadius: 2,
          },
          components: {},
        }}
      >
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </ConfigProvider>
    </AntdApp>
  );
}

export default App;
