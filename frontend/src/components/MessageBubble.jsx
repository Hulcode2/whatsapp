import { Bubble, BubbleContent } from "../components/ui/bubble";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

import useAuthStore from "../context/AuthStore";
import { colors } from "../utils/constants";

const MessageBubble = ({ message }) => {
  const userInfo = useAuthStore((state) => state.userInfo);

  const isMe = message.sender?._id === userInfo?._id;

  const sender = message.sender;

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Bubble align={isMe ? "end" : "start"} className="flex flex-row gap-2">
      {!isMe && (
        <Avatar className="h-10 w-10">
          <AvatarImage src={sender?.image} />

          <AvatarFallback
            className={`${colors[sender?.color ?? 0]} text-white`}
          >
            {sender?.email?.[0]?.toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
      )}

      <BubbleContent className={isMe ? "!bg-violet-700" : "!bg-[#0d0e1a]"}>
        {message.messageType === "text" ? (
          <p>{message.content}</p>
        ) : message.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
          <img
            src={message.fileUrl}
            alt="Uploaded"
            className="rounded-lg max-w-xs"
          />
        ) : (
          <a
            href={message.fileUrl}
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            Open file
          </a>
        )}
        <p
          className={`mt-1 text-[10px] opacity-60 ${
            isMe ? "text-right" : "text-left"
          }`}
        >
          {time}
        </p>
      </BubbleContent>
    </Bubble>
  );
};

export default MessageBubble;
