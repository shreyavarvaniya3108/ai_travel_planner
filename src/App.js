import "./App.css";
import Header from "./Header";
import Home from "./Home";
import Destination from "./Destination";
import AiTravel from "./AiTravel";

function App() {
  return (
    <div>
      <Header />

      <section id="home">
        <Home />
      </section>

      <section id="destination">
        <Destination />
      </section>

      <section id="travel">
        <AiTravel />
      </section>
    </div>
  );
}

export default App;