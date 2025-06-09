import Navbar from "../components/Navbar";
import Book from "../components/Book";
import Plank from "../components/Plank";
import Robot from "../components/Robot";
import { SharedS3UrlProvider } from "../contexts/s3urlContext";

function Home() {
  return (
    <>
      <Navbar />
      <SharedS3UrlProvider>
        <Book />
        <Plank />
        <Robot />
      </SharedS3UrlProvider>
    </>
  );
}

export default Home;
