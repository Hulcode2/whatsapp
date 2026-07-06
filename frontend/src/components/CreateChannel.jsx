import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/paths";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useChatStore from "../context/ChatStore";
const CreateChannel = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const getUserChannels = useChatStore((state) => state.getUserChannels);
  useEffect(() => {
    if (!searchTerm.trim()) {
      setContacts([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await axiosInstance.post(API_PATHS.CONTACTS.SEARCH, {
          searchTerm,
        });

        setContacts(data.contacts);
      } catch (err) {
        console.log(err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);
  async function handleCreateChannel() {
    if (!channelName.trim()) {
      return toast("Channel name is required");
    }

    if (selectedMembers.length === 0) {
      return toast("Select at least one member");
    }

    try {
      const { data } = await axiosInstance.post(API_PATHS.CHANNEL.CREATE, {
        name: channelName,
        members: selectedMembers.map((m) => m._id),
      });

      await getUserChannels();
      setChannelName("");
      setSelectedMembers([]);
      setSearchTerm("");
      setContacts([]);
      onOpenChange(false);
    } catch (error) {
      console.log(error);
    }
  }
  function handleSelectMember(contact) {
    if (selectedMembers.some((m) => m._id === contact._id)) return;

    setSelectedMembers((prev) => [...prev, contact]);

    setSearchTerm("");
    setContacts([]);
  }
  function removeMember(id) {
    setSelectedMembers((prev) => prev.filter((member) => member._id !== id));
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#181920] border-none text-white max-w-md">
        <DialogTitle>Create a new Channel</DialogTitle>

        <Input
          placeholder="Channel Name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          className="bg-[#2c2e3b] border-none"
        />

        <div className="border rounded-md p-3 mt-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedMembers.map((dm, index) => {
              return (
                <div key={dm._id} className="flex items-center gap-1">
                  <Badge key={index} className="bg-violet-600 cursor-pointer ">
                    <p> {dm.firstName + " " + dm.lastName} </p>
                  </Badge>
                  <X
                    size={19}
                    onClick={() => {
                      removeMember(dm._id);
                    }}
                    className=" cursor-pointer z-40 hover:text-red-500"
                  />
                </div>
              );
            })}
          </div>

          <Input
            placeholder="Search Contacts"
            className="border-none shadow-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <div className="mt-3 space-y-2">
              {contacts
                .filter(
                  (contact) =>
                    !selectedMembers.some((m) => m._id === contact._id),
                )
                .map((contact) => (
                  <div
                    key={contact._id}
                    onClick={() => handleSelectMember(contact)}
                    className="cursor-pointer rounded-md p-2 hover:bg-zinc-700"
                  >
                    {contact.firstName} {contact.lastName}
                  </div>
                ))}
            </div>
          )}
        </div>
        <Button
          onClick={handleCreateChannel}
          className="bg-violet-700 hover:bg-violet-800"
        >
          Create Channel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannel;
