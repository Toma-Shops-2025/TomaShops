import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageCircle } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { format, isToday, isYesterday } from 'date-fns';
import { toast } from '@/components/ui/sonner';

type ConversationRow = {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  updated_at: string;
  product: { id: string; title: string; thumbnailUrl: string | null } | null;
  buyer: { id: string; full_name: string | null; avatar_url: string | null } | null;
  seller: { id: string; full_name: string | null; avatar_url: string | null } | null;
};

type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
};

const formatTime = (ts: string) => {
  const d = new Date(ts);
  if (isToday(d)) return format(d, 'p');
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d');
};

const Messages = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Conversation list
  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id, buyer_id, seller_id, product_id, updated_at,
          product:products!conversations_product_id_fkey(id, title, thumbnailUrl),
          buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
          seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as ConversationRow[];
    },
    enabled: !!user,
  });

  const active = conversations.find((c) => c.id === conversationId) || null;

  // Messages for active conversation
  const { data: messages = [] } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []) as MessageRow[];
    },
    enabled: !!conversationId,
  });

  // Realtime subscription for active conversation
  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
          queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient, user?.id]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const otherParty = (c: ConversationRow) => {
    if (!user) return c.seller;
    return c.buyer_id === user.id ? c.seller : c.buyer;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || !user) return;
    setSending(true);
    const content = newMessage.trim();
    setNewMessage('');
    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    });
    if (error) {
      toast.error('Failed to send message');
      setNewMessage(content);
    } else {
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations', user.id] });
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-4"><BackButton /></div>
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation list */}
          <div className="lg:col-span-1 border rounded-lg bg-card overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  No conversations yet. Message a seller from a product page to get started.
                </div>
              ) : (
                conversations.map((c) => {
                  const other = otherParty(c);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => navigate(`/messages/${c.id}`)}
                      className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
                        c.id === conversationId ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
                          {other?.avatar_url ? (
                            <img src={other.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-semibold">
                              {(other?.full_name || '?').charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-semibold truncate">{other?.full_name || 'User'}</h3>
                            <span className="text-xs text-muted-foreground">{formatTime(c.updated_at)}</span>
                          </div>
                          {c.product && (
                            <div className="mt-1 bg-muted text-primary rounded px-2 py-0.5 text-xs inline-block truncate max-w-full">
                              Re: {c.product.title}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Conversation pane */}
          <div className="lg:col-span-2 border rounded-lg bg-card overflow-hidden flex flex-col">
            {active ? (
              <>
                <div className="p-4 border-b flex justify-between items-center gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                      {otherParty(active)?.avatar_url ? (
                        <img
                          src={otherParty(active)!.avatar_url!}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-semibold">
                          {(otherParty(active)?.full_name || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">
                        {otherParty(active)?.full_name || 'User'}
                      </h3>
                      {active.product && (
                        <Link
                          to={`/product/${active.product.id}`}
                          className="text-xs text-muted-foreground hover:text-primary truncate block"
                        >
                          Re: {active.product.title}
                        </Link>
                      )}
                    </div>
                  </div>
                  {active.product && (
                    <Link to={`/product/${active.product.id}`}>
                      <Button variant="outline" size="sm">View item</Button>
                    </Link>
                  )}
                </div>

                <div ref={scrollRef} className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[450px]">
                  {messages.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-8">
                      No messages yet. Say hello!
                    </div>
                  ) : (
                    messages.map((m) => {
                      const mine = m.sender_id === user?.id;
                      return (
                        <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              mine ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}
                          >
                            <div className="whitespace-pre-wrap break-words">{m.content}</div>
                            <div className="text-xs mt-1 opacity-70 text-right">
                              {new Date(m.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                      disabled={sending}
                    />
                    <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
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
                  {conversations.length === 0
                    ? 'Start a conversation from any product page.'
                    : 'Select a conversation from the list to start chatting.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Messages;
