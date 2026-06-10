import "./App.css";
import Header from "./Header";
import Home from "./Home";
import Destination from "./Destination";
import Ai_Travel from "./Ai_Travel";

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
        <Ai_Travel />
      </section>
    </div>
  );
}

export default App;