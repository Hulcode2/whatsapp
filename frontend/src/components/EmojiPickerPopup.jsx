import EmojiPicker from "emoji-picker-react";
import { useRef, useState, useEffect } from "react";
import { X, Smile } from "lucide-react";

const EmojiPickerPopup = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative   " ref={pickerRef}>
      <button onClick={() => setIsOpen((prev) => !prev)}>
        <Smile className="text-zinc-400 mt-2 cursor-pointer" size={20} />
      </button>

      {isOpen && (
        <div className="absolute bottom-10 -right-20 z-50">
          <button className="mb-1 text-2xl" onClick={() => setIsOpen(false)}>
            <X />
          </button>

          <EmojiPicker
            onEmojiClick={(emoji) => {
              onSelect(emoji.emoji);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
