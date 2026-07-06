import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { Input } from "./ui/input";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/paths";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useState, useEffect } from "react";
import { colors } from "../utils/constants";
import useChatStore from "../context/ChatStore";
const SearchPopup = ({ open, onOpenChange, onIn }) => {
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const getUserDm = useChatStore((state) => state.getUserDm);
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function getDm(searchTerm) {
      try {
        if (searchTerm === "") return;
        const { data } = await axiosInstance.post(API_PATHS.CONTACTS.SEARCH, {
          searchTerm,
        });
        getUserDm();
        setContacts(data.contacts);
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong";
        console.log(errorMessage);
      }
    }
    getDm(searchTerm);
  }, [searchTerm]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#181920] border-none text-white max-w-md">
        <DialogTitle className="text-center">
          Select a contact from Syncronusly
        </DialogTitle>

        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Contacts"
          className="mt-6 bg-[#2c2e3b] border-none"
        />

        <div className="mt-4 space-y-2 max-h-72 overflow-y-auto">
          {contacts.map((dm, index) => {
            return (
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  setSelectedChat("contact", dm);
                  onOpenChange();
                  onIn();
                }}
                key={index}
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
                  <h5 className="font-medium">
                    {dm?.firstName + " " + dm?.lastName}
                  </h5>
                  <p className="text-xs text-zinc-400">{dm?.email}</p>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchPopup;
