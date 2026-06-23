import "./App.css";
import Header from "./Header";
import Home from "./Home";
import Destination from "./Destination";
import TravelPlanner from "./TravelPlanner";

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
        <TravelPlanner />
      </section>
    </div>
  );
}

export default App;