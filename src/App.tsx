import ListGroup from "./components/ListGroup";
import Header from "./components/Header";
import Prompt from "./components/Prompt";
import Dropdown from "./components/Dropdown";
import FileUpload from "./components/importFile";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div>
      <Header />
      <Prompt />
      <FileUpload />
      <div className="container mt-5">
        <Dropdown />
      </div>
    </div>
  );
}

export default App;
