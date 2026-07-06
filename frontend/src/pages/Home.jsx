import Sidebar from "../layout/Sidebar";
import Welcome from "../components/Welcome";
import Chat from "../components/Chat";
import { useState } from "react";
const Home = () => {
  const [inChat, setInChat] = useState(false);

  return (
    <div className="flex items-center  min-h-screen  bg-[#1e1f29]">
      <Sidebar show={!inChat} onIn={() => setInChat(true)} />

      <div className="flex-1">
        {inChat ? <Chat onOut={() => setInChat(false)} /> : <Welcome />}
      </div>
    </div>
  );
};

export default Home;
