import { useEffect, useState, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Send, Paperclip, MessageSquare } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { ChatMessage } from '@/types/chat';

export default function CustomerService() {
    const { auth } = usePage().props as any;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isAdminOnline, setIsAdminOnline] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

    useEffect(() => {
        const checkStatus = () => {
            fetch('/api/admin-status')
                .then(res => res.json())
                .then(data => setIsAdminOnline(data.isOnline))
                .catch(() => setIsAdminOnline(false));
        };

        checkStatus();
        const intervalId = setInterval(checkStatus, 60000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        setMessages([
            {
                id: 1,
                text: `Halo ${auth.user.name}, ada yang bisa kami bantu?`,
                sender: 'support',
                timestamp: new Date()
            }
        ]);
    }, [auth.user.name]);

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
        const message: ChatMessage = { id: Date.now(), text: newMessage, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, message]);
        setNewMessage('');

        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now(), text: 'Tunggu sebentar, kami sedang menghubungkan Anda dengan tim support...', sender: 'support', timestamp: new Date() }]);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <AppLayout>
            <Head title="Customer Service" />
            <div className="flex h-[calc(100vh-120px)]">
                <div className="w-1/3 border-r border-gray-300 flex flex-col">
                    <div className="p-8">
                        <h1 className="text-2xl font-semibold text-gray-400 mb-6">Customer Service</h1>

                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 hover:bg-gray-100 cursor-pointer border-l-4 border-blue-500">
                            <div className="font-bold text-lg">Support Team</div>
                            <p className="text-sm text-gray-500 truncate">
                                {lastMessage ? lastMessage.text : 'Mulai percakapan...'}
                            </p>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="w-2/3 flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex items-center">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                                <MessageSquare size={20} />
                            </div>
                            <span className={`absolute bottom-0 right-2 w-2.5 h-2.5 rounded-full border-2 border-white ${isAdminOnline ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Customer Service</h3>
                            <p className="text-xs text-gray-500">{isAdminOnline ? 'Online' : 'Offline'}</p>
                        </div>
                    </div>
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-xl p-3 px-4 ${message.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white border-r border-gray-400 shadow-sm rounded-bl-none'}`}>
                                    <div className="whitespace-pre-line">{message.text}</div>
                                    <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{formatTime(message.timestamp)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center">
                            <button className="p-2 text-gray-500 hover:text-gray-700"><Paperclip size={20} /></button>
                            <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ketik pesan..." className="flex-1 border border-gray-400 rounded-lg p-3 mx-2 max-h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" rows={1} />
                            <button onClick={sendMessage} disabled={!newMessage.trim()} className={`p-3 rounded-full ${newMessage.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400'}`}><Send size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
