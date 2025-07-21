import { useEffect, useState, useRef } from 'react';
import { X, Send, Paperclip, MessageSquare } from 'lucide-react';
import { ChatMessage } from '@/types/chat';

// Props yang diterima komponen ini dari Dashboard.tsx
interface ChatPopupProps {
  show: boolean;
  onClose: () => void;
  initialMessages: ChatMessage[];
  ticketData: any | null;
  ticketImagePreview: string | null;
  userName: string;
}

export default function ChatPopup({ 
  show, 
  onClose, 
  initialMessages,
  ticketData,
  ticketImagePreview,
  userName 
}: ChatPopupProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Inisialisasi atau update pesan ketika props berubah
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);

      // Jika pesan awal adalah dari tiket, simulasikan balasan admin
      if (ticketData) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now(),
              text: `Halo ${userName}, saya Admin dari tim support. Kami sedang memeriksa laporan Anda.`,
              sender: 'support',
              timestamp: new Date()
            }
          ]);
        }, 2000);
      }
    }
  }, [initialMessages, ticketData, userName]);
  
  // Efek untuk scroll otomatis ke pesan terbaru
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };
  
  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: ChatMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulasikan balasan admin
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: 'Terima kasih atas informasinya. Kami sedang memprosesnya.',
          sender: 'support',
          timestamp: new Date()
        }
      ]);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md h-[80vh] bg-white rounded-xl shadow-xl z-50 flex flex-col border border-gray-200">
        <div className="bg-blue-500 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center">
                <div className="bg-blue-300 rounded-full p-1 mr-3">
                        <MessageSquare size={18} />
                </div>
            <div>
                    <h3 className="text-lg font-bold">Customer Service</h3>
                    <p className="text-xs opacity-80">Online • Menunggu respon</p>
            </div>
            </div>
             <button
                onClick={onClose} // Gunakan prop onClose
                className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-blue-600"
              >
                <X size={20} />
              </button>
        </div>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
           {messages.map((message) => (
             <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl p-4 ${ message.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white border border-gray-200 rounded-bl-none' }`}>
                  {/* Tampilkan Ringkasan Tiket jika tipenya sesuai */}
                  {message.type === 'ticket-summary' && ticketData ? (
                    <div className="space-y-2">
                      <div className="font-bold">Ringkasan Laporan</div>
                      <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1 text-sm">
                        <div className="font-medium">Nama:</div>       <div>{userName}</div>
                        <div className="font-medium">Email:</div>      <div>{ticketData.email || '-'}</div>
                        <div className="font-medium">PIC:</div>        <div>{ticketData.penanggungJawab || '-'}</div>
                        <div className="font-medium">Telepon:</div>    <div>{ticketData.nomorTelpon || '-'}</div>
                      </div>
                      <div className="mt-2">
                        <div className="font-medium">Deskripsi:</div>
                        <div>{ticketData.deskripsi || '-'}</div>
                      </div>
                      {ticketImagePreview && (
                        <div className="mt-3">
                          <div className="font-medium">Screenshot:</div>
                          <img src={ticketImagePreview} alt="Screenshot" className="max-w-xs mt-2 rounded-md border" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="whitespace-pre-line">{message.text}</div>
                  )}
                   <div className={`text-xs mt-2 ${ message.sender === 'user' ? 'text-blue-100' : 'text-gray-500' }`}>
                        {formatTime(message.timestamp)}
                    </div>
                </div>
             </div>
           ))}
        </div>

        <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Paperclip size={20} />
                </button>
            <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan..."
                className="flex-1 border border-gray-300 rounded-lg p-3 max-h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={1}
            />
            <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className={`ml-2 p-3 rounded-full ${
                newMessage.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400'
            }`}
            >
                <Send size={20} />
            </button>
        </div>
    </div>
  </div>
  );
}