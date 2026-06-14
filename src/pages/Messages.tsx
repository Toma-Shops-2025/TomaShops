
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MessagePreview from '@/components/MessagePreview';
import MessagePreview from '@/components/MessagePreview';
import { messages, Message } from '@/data/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send, Image, MessageCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BackButton from '@/components/BackButton';

const Messages = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [activeConversation, setActiveConversation] = useState<Message | null>(
    userId ? messages.find(m => m.senderId === userId || m.receiverId === userId) || null : null
  );
  const [newMessage, setNewMessage] = useState("");
  
  const inboxMessages = messages.filter(m => m.receiverId === 'current-user');
  const sentMessages = messages.filter(m => m.senderId === 'current-user');
  const allMessages = [...inboxMessages, ...sentMessages];
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // In a real app, this would send the message to an API
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-4"><BackButton /></div>
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 border rounded-lg bg-card overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search messages..."
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div>
              <Tabs defaultValue="inbox">
                <TabsList className="w-full">
                  <TabsTrigger value="inbox" className="flex-1">Inbox</TabsTrigger>
                  <TabsTrigger value="sent" className="flex-1">Sent</TabsTrigger>
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                </TabsList>
                
                <TabsContent value="inbox" className="max-h-[500px] overflow-y-auto">
                  {inboxMessages.length > 0 ? (
                    inboxMessages.map(message => (
                      <div
                        key={message.id}
                        className={`cursor-pointer ${activeConversation?.senderId === message.senderId ? 'bg-muted' : ''}`}
                        onClick={() => setActiveConversation(message)}
                      >
                        <MessagePreview message={message} />
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">No messages in your inbox</div>
                  )}
                </TabsContent>
                
                <TabsContent value="sent" className="max-h-[500px] overflow-y-auto">
                  {sentMessages.length > 0 ? (
                    sentMessages.map(message => (
                      <div
                        key={message.id}
                        className={`cursor-pointer ${activeConversation?.receiverId === message.receiverId ? 'bg-muted' : ''}`}
                        onClick={() => setActiveConversation(message)}
                      >
                        <MessagePreview message={message} />
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">No sent messages</div>
                  )}
                </TabsContent>
                
                <TabsContent value="all" className="max-h-[500px] overflow-y-auto">
                  {allMessages.length > 0 ? (
                    allMessages.map(message => (
                      <div
                        key={message.id}
                        className={`cursor-pointer ${
                          (activeConversation?.senderId === message.senderId || 
                           activeConversation?.receiverId === message.receiverId)
                            ? 'bg-muted' 
                            : ''
                        }`}
                        onClick={() => setActiveConversation(message)}
                      >
                        <MessagePreview message={message} />
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">No messages</div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Message Conversation */}
          <div className="lg:col-span-2 border rounded-lg bg-card overflow-hidden flex flex-col">
            {activeConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={
                        activeConversation.senderId === 'current-user'
                          ? '/placeholder.svg' // Receiver's avatar would be here
                          : activeConversation.senderAvatar
                      }
                      alt={
                        activeConversation.senderId === 'current-user'
                          ? activeConversation.receiverId
                          : activeConversation.senderName
                      }
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {activeConversation.senderId === 'current-user'
                          ? activeConversation.receiverId
                          : activeConversation.senderName
                        }
                      </h3>
                      {activeConversation.productTitle && (
                        <div className="text-xs text-muted-foreground">
                          Re: {activeConversation.productTitle}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]">
                  {/* This is where the actual messages would be rendered */}
                  <div className={`flex ${
                    activeConversation.senderId === 'current-user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      activeConversation.senderId === 'current-user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}>
                      {activeConversation.message}
                      <div className="text-xs mt-1 opacity-70 text-right">
                        {new Date(activeConversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Example responses based on the message - in a real app these would be from the API */}
                  {activeConversation.senderId !== 'current-user' && (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-lg p-3 bg-primary text-primary-foreground">
                        Hi there! Yes, I'm interested in discussing the product further. Do you have any specific questions?
                        <div className="text-xs mt-1 opacity-70 text-right">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Button type="button" variant="ghost" size="icon">
                      <Image className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Conversation Selected</h3>
                <p className="text-muted-foreground max-w-md">
                  Select a conversation from the list to start chatting or respond to inquiries about your listed products.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Ad placeholder removed for initial release — AdMob integration coming v1.1 */}
        {/* <div className="mt-6"><AdBanner type="horizontal" /></div> */}
      </main>
      
      <Footer />
    </div>
  );
};

export default Messages;
