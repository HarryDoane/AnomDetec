import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import PromptWithFileUpload from "./components/PromptWithFileUpload";
import midpage from "./assets/midpage.png";
import "./App.css";
import TextBox from "./components/TextBox1";
import MidPageTitle from "./components/MidPageTitle";
import TextBox2 from "./components/TextBox2";

function App() {
  return (
    <div>
      <Header />
      <div className="image-container">
        <img src={midpage} alt="Middle Page Photo" className="midpage" />
      </div>
      <TextBox />
      <MidPageTitle />
      <TextBox2 />
      <PromptWithFileUpload />

      <div className="container mt-5"></div>
    </div>
  );
}

export default App;
