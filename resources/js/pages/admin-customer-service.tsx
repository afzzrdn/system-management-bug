import { useEffect, useState, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Send, MessageSquare } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { ChatMessage } from '@/types/chat';

export default function AdminCustomerService() {
    const { auth } = usePage().props as any;
    const [clients, setClients] = useState<{id:number; name:string}[]>([]);
    const [selectedClient, setSelectedClient] = useState<number|null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const fetchClients = async () => {
        const res = await fetch('/admin/customer-service/clients');
        const data = await res.json();
        setClients(data);
    };

    const fetchMessages = async (clientId:number) => {
        const res = await fetch(`/admin/customer-service/messages/${clientId}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        const data = await res.json();
        if (!Array.isArray(data)) {
            setMessages([]);
            return;
        }
        const parsed = data.map((msg: any) => ({
            ...msg,
            sender: msg.sender_id === auth.user.id ? 'support' : 'user',
            timestamp: new Date(msg.created_at),
            text: msg.message
        }));
        setMessages(parsed);
    };

    useEffect(() => { fetchClients(); }, []);

    useEffect(() => {
        if (selectedClient) {
            fetchMessages(selectedClient);
            const interval = setInterval(() => fetchMessages(selectedClient), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedClient]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedClient) return;
        const res = await fetch(`/admin/customer-service/messages/${selectedClient}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ message: newMessage }),
        });
        if (res.ok) {
            setNewMessage('');
            fetchMessages(selectedClient);
        }
    };

    const formatTime = (date: string | Date) => {
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <AppLayout>
            <Head title="Admin Customer Service" />
            <div className="flex h-[calc(100vh-120px)]">
                {/* Sidebar: Client List */}
                <div className="w-1/3 border-r border-gray-300">
                    <h2 className="p-4 text-xl font-bold">Clients</h2>
                    <div>
                        {clients.map(client => (
                            <div key={client.id}
                                onClick={() => setSelectedClient(client.id)}
                                className={`p-4 cursor-pointer ${selectedClient === client.id ? 'bg-blue-100' : ''}`}>
                                {client.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat */}
                <div className="w-2/3 flex flex-col">
                    {selectedClient ? (
                        <>
                            <div className="p-4 border-b flex items-center">
                                <MessageSquare className="mr-2 text-blue-500" />
                                <h3 className="font-bold">Chat with {clients.find(c=>c.id===selectedClient)?.name}</h3>
                            </div>
                            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.map((message) => (
                                    <div key={message.id} className={`flex ${message.sender === 'support' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] rounded-xl p-3 px-4 ${message.sender === 'support' ? 'bg-green-500 text-white rounded-br-none' : 'bg-white border-r border-gray-400 shadow-sm rounded-bl-none'}`}>
                                            <div className="whitespace-pre-line">{message.text}</div>
                                            <div className={`text-xs mt-2 ${message.sender === 'support' ? 'text-green-100' : 'text-gray-500'}`}>{formatTime(message.timestamp)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t">
                                <div className="flex items-center">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Ketik balasan..."
                                        className="flex-1 border border-gray-400 rounded-lg p-3 mx-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button onClick={sendMessage} className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center flex-1 text-gray-500">Pilih client untuk mulai chat</div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
