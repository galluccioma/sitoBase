import Hero from "../components/Sezioni/Hero";
import Contatti from "../components/Sezioni/Contatti";
import BlogPosts from "../components/Sezioni/BlogPosts";
import Popup from "../components/UI/Popup";

export default function Home() {
    return (
        <>
        <Hero/>
        <Popup/>
        <BlogPosts/>
        <Contatti/>
      </>
    );
}