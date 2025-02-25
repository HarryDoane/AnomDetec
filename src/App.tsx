import ListGroup from "./components/ListGroup";
import Header from "./components/Header";
import Dropdown from "./components/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import PromptWithFileUpload from "./components/PromptWithFileUpload";

function App() {
  return (
    <div>
      <Header />
      <PromptWithFileUpload />
      <div className="container mt-5"></div>
    </div>
  );
}

export default App;
