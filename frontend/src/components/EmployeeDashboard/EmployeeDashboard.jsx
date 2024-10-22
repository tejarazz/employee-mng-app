import Header from "../others/Header";
import TaskList from "../others/TaskList";
import TaskNumbers from "../others/TaskNumbers";

const EmployeeDashboard = () => {
  return (
    <div className="lg:p-5 p-2 h-screen">
      <Header />
      <TaskNumbers />
      <TaskList />
    </div>
  );
};

export default EmployeeDashboard;
