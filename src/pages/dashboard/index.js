import Header from "../../components/header";
import Layout from "../../layout";

const Dashboard = () => {
  return <Layout Header={(setVisible,visible)=><Header title="Dashboard" setVisible={setVisible} visible={visible} />}>Dashboard</Layout>;
};

export default Dashboard;
