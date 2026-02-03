import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Search } from "lucide-react";
import { dummyChats } from '../assets/assets';
import {format, isToday, isYesterday, parseISO} from 'date-fns'
import { useDispatch } from 'react-redux'
import { setChat } from '../app/features/chatSlice';

const Messages = () => {
  const dispatch = useDispatch();
  const user = { id: "user_1" };

  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const formatTime = (dateString) =>{
    if(!dateString) return ;
    const date = parseISO(dateString)
    if(isToday(date)){
      return 'Today '+ format(date, "HH:mm");
    }
    if(isYesterday(date)){
      return 'Yesterday '+ format(date, "HH:mm");
    }
    return format(date, "MMM dd")
  }

  const filterChats = useMemo(()=>{
    const query = searchQuery.toLowerCase();
    return chats.filter((chat)=> {
      const chatUser = chat.chatUserId === user?.id ? chat?. ownerUser : 
      chat?.chatUser;

      return chat.listing?.title?.toLowerCase().includes(query) || chatUser?.name?.toLowerCase().includes(query);
    })
  },[chats, searchQuery])

  const handleOpenChat = (chat)=>{
    dispatch(setChat({listing: chat.listing, chatId: chat.id}))

  }
  const fetchUserChats = async () => {
    setChats(dummyChats);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserChats();

    const interval = setInterval(() => {
      fetchUserChats();
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
          <p className="text-gray-600">Chat with buyers and sellers</p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-indigo-500"
          />
        </div>

        {/* Chat List */}
        <div className="mt-8">
          {loading ? (
            <p className="text-center text-gray-500 py-20">
              Loading chats...
            </p>
          ) : filterChats.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-16 text-center">
              <div className="flex justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                {searchQuery ? "No conversations found" : "No messages yet"}
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "Try a different search term"
                  : 'Start a conversation by viewing a listing and clicking "Chat with seller"'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
              {filterChats.map((chat) => {
                const chatUser =
                  chat.chatUserId === user?.id
                    ? chat.ownerUser
                    : chat.chatUser;

                return (
                  <button onClick={()=>{handleOpenChat(chat)}}
                    key={chat.id}
                    className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="w-12 h-12 rounded-lg object-cover"
                          src={chatUser?.image}
                          alt={chatUser?.name}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {chat.listing?.title}
                          </h3>
                          <span className="text-xs text-gray-500 ml-2">
                            {formatTime(chat.updatedAt)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 truncate mb-1">
                          {chatUser?.name}
                        </p>

                        <p
                          className={`text-sm truncate ${
                            !chat.isLastMessageRead &&
                            chat.lastMessageSenderId !== user?.id
                              ? "text-indigo-600 font-medium"
                              : "text-gray-500"
                          }`}
                        >
                          {chat.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
