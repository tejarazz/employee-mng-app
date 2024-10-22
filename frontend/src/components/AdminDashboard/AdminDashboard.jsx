import AllTask from "../others/AllTask";
import CreateTask from "../others/CreateTask";
import EmployeeStats from "../others/EmployeeStats";
import Header from "../others/Header";

const AdminDashboard = () => {
  return (
    <div className="lg:p-5 p-2">
      <Header />
      <CreateTask />
      <AllTask />
      <EmployeeStats />
    </div>
  );
};

export default AdminDashboard;
