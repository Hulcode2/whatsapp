import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import MessageBubble from "./MessageBubble";
import EmojiPickerPopup from "./EmojiPickerPopup";
import useAuthStore from "../context/AuthStore";
import useChatStore from "../context/ChatStore";
import { Fullscreen, Paperclip, SendHorizontal } from "lucide-react";
import { X } from "lucide-react";
import { colors } from "../utils/constants";
import { useEffect, useState } from "react";
import { getSocket } from "../utils/socket";
import { useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/paths";
const Chat = ({ onOut }) => {
  const [text, setText] = useState("");
  const messages = useChatStore((state) => state.messages);
  const selectedChatData = useChatStore((state) => state.selectedChatData);
  const getMessages = useChatStore((state) => state.getMessages);
  const getChannelMessages = useChatStore((state) => state.getChannelMessages);
  const selectedChatType = useChatStore((state) => state.selectedChatType);
  const userInfo = useAuthStore((state) => state.userInfo);
  const isContact = selectedChatType === "contact";
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const avatarSrc = isContact ? selectedChatData?.image : null;
  const [file, setFile] = useState(null);
  const avatarLetter = isContact
    ? selectedChatData?.email?.[0]?.toUpperCase() || "?"
    : selectedChatData?.name?.[0]?.toUpperCase() || "#";

  const title = isContact
    ? `${selectedChatData?.firstName || ""} ${selectedChatData?.lastName || ""}`.trim()
    : selectedChatData?.name || "";

  const avatarColor = colors[selectedChatData?.color ?? 0];
  useEffect(() => {
    if (!selectedChatData) return;

    if (selectedChatType === "contact") {
      getMessages(selectedChatData._id);
    } else {
      getChannelMessages(selectedChatData._id);
    }
  }, [selectedChatData, selectedChatType]);
  useEffect(() => {
    const socket = getSocket();

    const handleReceiveMessage = (message) => {
      const state = useChatStore.getState();

      if (
        state.selectedChatData?._id === message.sender._id ||
        state.selectedChatData?._id === message.recipient._id
      ) {
        state.addMessage(message);
      }
    };
    const handleReceiveChannelMessage = (message) => {
      const state = useChatStore.getState();

      if (state.selectedChatData?._id === message.channelId) {
        state.addMessage(message);
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("receive-channel-message", handleReceiveChannelMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("receive-channel-message", handleReceiveChannelMessage);
    };
  }, []);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const socket = getSocket();

    if (!socket) return;

    let fileUrl = null;
    let messageType = "text";

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axiosInstance.post(
        API_PATHS.MESSAGES.UPLOAD_FILE,
        formData,
      );

      fileUrl = data.data;
      messageType = "file";
    }

    const payload = {
      sender: userInfo._id,
      content: text,
      messageType,
      fileUrl,
      timestamp: new Date(),
    };

    if (isContact) {
      socket.emit("send-message", {
        ...payload,
        recipient: selectedChatData._id,
      });
    } else {
      socket.emit("send-channel-message", {
        ...payload,
        channelId: selectedChatData._id,
      });
    }

    setText("");
    setFile(null);
    fileInputRef.current.value = "";
  };

  function onSelect(url) {
    setText((prev) => prev + url);
  }
  return (
    <div className="flex flex-col h-screen bg-[#1c1d26] text-white">
      <div className="h-18 border-b border-zinc-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            {isContact && <AvatarImage src={avatarSrc} />}

            <AvatarFallback className={`${avatarColor} text-white`}>
              {avatarLetter}
            </AvatarFallback>
          </Avatar>

          <h2 className="font-semibold text-lg">{title}</h2>
        </div>

        <X className="cursor-pointer hover:text-red-500" onClick={onOut} />
      </div>
      <div className="flex-1 no-scrollbar overflow-y-auto px-5 py-6 space-y-6      flex w-full  flex-col gap-8 ">
        {messages?.map((message) => (
          <MessageBubble key={message._id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-zinc-800 p-5">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-[#2b2d3a] rounded-lg px-4">
            {file && (
              <div className="flex items-center gap-2  bg-zinc-700 rounded-md px-2 py-1 text-sm">
                <span className="truncate max-w-40">{file.name}</span>

                <button
                  onClick={() => {
                    setFile(null);
                    fileInputRef.current.value = "";
                  }}
                  className="text-red-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            )}
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              type="text"
              placeholder="Enter message"
              className="flex-1 bg-transparent outline-none py-4 text-white"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />{" "}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Paperclip
              onClick={() => fileInputRef.current.click()}
              className="text-zinc-400 mr-2 cursor-pointer"
              size={20}
            />
            <EmojiPickerPopup onSelect={onSelect} />
          </div>

          <button
            onClick={handleSend}
            className="bg-violet-600 hover:bg-violet-700 rounded-lg w-14 h-14 flex items-center justify-center transition"
          >
            <SendHorizontal size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
