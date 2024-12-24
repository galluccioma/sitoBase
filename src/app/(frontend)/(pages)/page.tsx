import Hero from "../components/Sezioni/Hero";
import Contatti from "../components/Sezioni/Contatti";
import Foods from "../components/Sezioni/Food";
import Popup from "../components/UI/Popup";

export default function Home() {
    return (
        <>
        <Hero/>
        <Popup/>
        <Foods/>
        <Contatti/>
      </>
    );
}