import { Edit2, Plus, PowerCircle } from "lucide-react";
import Logo from "../components/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import SearchPopup from "../components/SearchPopup";
import CreateChannel from "../components/CreateChannel";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthStore from "../context/AuthStore";
import { colors } from "../utils/constants";
import useChatStore from "../context/ChatStore";
import { disconnectSocket } from "../utils/socket";
const Sidebar = ({ show, onIn }) => {
  const [openSearch, setOpenSearch] = useState(false);
  const [openChannel, setOpenChannel] = useState(false);
  const channels = useChatStore((state) => state.channels);
  const dmContacts = useChatStore((state) => state.dmContacts);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const userInfo = useAuthStore((state) => state.userInfo);
  const clearChatStore = useChatStore((state) => state.clearChatStore);
  const navigate = useNavigate();

  return (
    <div
      className={`h-screen w-full ${show ? "flex " : "hidden"} md:!flex md:w-84 bg-[#1e1f29] text-white border-r border-zinc-800 flex-col`}
    >
      <Logo />
      <SearchPopup
        onIn={onIn}
        open={openSearch}
        onOpenChange={() => setOpenSearch(false)}
      />
      <CreateChannel
        open={openChannel}
        onOpenChange={() => setOpenChannel(false)}
      />

      <div className="flex-1  overflow-auto no-scrollbar ">
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-xs text-zinc-500 tracking-wider">
            DIRECT MESSAGES
          </p>

          <Plus
            size={18}
            onClick={() => setOpenSearch(true)}
            className="cursor-pointer hover:text-violet-400"
          />
        </div>
        {dmContacts?.map((dm) => {
          return (
            <div
              className="flex items-center gap-3 my-1.5 mx-4 cursor-pointer"
              key={dm._id}
              onClick={() => {
                setSelectedChat("contact", dm);
                onIn();
              }}
            >
              <Avatar>
                <AvatarImage src={dm.image} />
                <AvatarFallback
                  className={colors[dm?.color ?? 0] + " text-white"}
                >
                  {" "}
                  {dm.email ? dm.email[0].toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>

              <div>
                <h5 dm="font-medium">{dm?.firstName + " " + dm?.lastName}</h5>
                <p className="text-xs text-zinc-400">{dm?.email}</p>
              </div>
            </div>
          );
        })}
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-xs text-zinc-500 tracking-wider">CHANNELS</p>

          <Plus
            onClick={() => setOpenChannel(true)}
            size={18}
            className="cursor-pointer hover:text-violet-400"
          />
        </div>
        {channels?.map((channel) => {
          return (
            <div
              className="flex items-center gap-3 my-1.5 mx-4 cursor-pointer"
              key={channel._id}
              onClick={() => {
                setSelectedChat("channel", channel);
                onIn();
              }}
            >
              <Avatar>
                <AvatarFallback
                  className={colors[userInfo?.color ?? 0] + " text-white"}
                >
                  {channel.name ? channel.name[0].toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>

              <div>
                <h5 className="font-medium">{channel.name}</h5>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-zinc-800 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={userInfo.image} />
            <AvatarFallback
              className={colors[userInfo?.color ?? 0] + " text-white"}
            >
              {" "}
              {userInfo.email ? userInfo.email[0].toUpperCase() : "?"}
            </AvatarFallback>
          </Avatar>

          <div>
            <h5 className="font-medium">
              {userInfo?.firstName + " " + userInfo?.lastName || "jown"}
            </h5>
            <p className="text-xs text-zinc-400">
              {userInfo?.email || "jown@gmail.com"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Edit2
            onClick={() => {
              navigate("/profile");
            }}
            size={18}
            className="cursor-pointer text-zinc-400 hover:text-white transition"
          />

          <PowerCircle
            size={18}
            className="cursor-pointer text-red-400 hover:text-red-500 transition"
            onClick={() => {
              localStorage.clear("jwt");

              clearChatStore();
              disconnectSocket();
              navigate("/auth");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
