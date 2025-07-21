import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Bug, FolderKanban, MessageSquare } from 'lucide-react';
import { ReactNode, useState } from 'react';
import BugReportModal from './components/BugReportModal';
import ChatPopup from './components/CustomerChat';
import { ChatMessage } from '@/types/chat';

interface DashboardProps {
  auth: { user: any };
  stats: {
    bugReported: number;
    bugFixed: number;
    activeProjects: number;
  };
  recentBugs: Array<{
    id: number;
    title: string;
    project: string;
    status: 'open' | 'in_progress' | 'resolved';
  }>;
  devLogs: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
  }>;
  clientReviews: Array<{
    id: number;
    rating: number;
    comment: string;
    clientName: string;
  }>;
  serviceProgress: Array<{
    id: number;
    title: string;
    progress: number;
    status: string;
    assignee: string;
  }>;
}

type StatCardProps = {
  icon: ReactNode;
  title: string;
  value: string | number;
  iconBgColor: string;
  href: string;
  loading?: boolean;
};

const StatCard = ({ icon, title, value, iconBgColor, href, loading }: StatCardProps) => (
  <Link href={href} className="group bg-white p-6 rounded-xl flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 border border-gray-100">
    <div className='flex justify-between'>
      <div className={`p-3 rounded-full ${iconBgColor} text-white w-12 h-12 flex items-center justify-center mb-5`}>{icon}</div>
      <ArrowUpRight size={24} className="text-gray-400 group-hover:text-gray-800 transition-colors mt-1" /></div>
      <div><p className="text-base font-medium text-gray-500 mb-1">{title}</p>{loading ? (<div className="animate-pulse h-8 w-3/4 bg-gray-200 rounded"></div>) : (
        <p className="text-3xl font-bold text-gray-800">{value}</p>)}</div></Link>);

export default function Dashboard({auth,stats,recentBugs = [],devLogs = [],clientReviews = [],serviceProgress = []}: DashboardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [initialChatMessages, setInitialChatMessages] = useState<ChatMessage[]>([]);
  const [ticketData, setTicketData] = useState<any>(null);
  const [ticketImagePreview, setTicketImagePreview] = useState<string | null>(null);
  const handleTicketSubmit = (data: any, imagePreviewUrl: string | null) => {setTicketData(data);setTicketImagePreview(imagePreviewUrl);
    const newInitialMessages: ChatMessage[] = [{
        id: Date.now(),
        sender: 'user',
        timestamp: new Date(),
        type: 'ticket-summary',
        text: 'Ringkasan Laporan Anda.'},{
        id: Date.now() + 1,
        text: 'Terima kasih telah melaporkan masalah. Tim support kami akan segera menghubungi Anda.',
        sender: 'support',
        timestamp: new Date()}];
    setInitialChatMessages(newInitialMessages);
    setShowModal(false);
    setShowChat(true);};

  const openEmptyChat = () => {
    setTicketData(null);
    setTicketImagePreview(null);
    setInitialChatMessages([{
        id: Date.now(),
        text: 'Halo! Ada yang bisa kami bantu hari ini?',
        sender: 'support',
        timestamp: new Date()}]);setShowChat(true);};
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return { bg: 'bg-red-100', text: 'text-red-700' };
      case 'in_progress': return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
      case 'resolved': return { bg: 'bg-green-100', text: 'text-green-700' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700' };}};
  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return status;}};
  return (
    <AppLayout>
      <Head><title>Client Dashboard</title></Head>
      <div className="p-5 md:p-7"><header className="flex flex-wrap justify-between items-center mb-10 gap-6">
          <div><h2 className="text-2xl font-semibold text-gray-700">Client Dashboard</h2><p className="text-gray-500 mt-1">Welcome back, {auth.user.name}!</p></div></header>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center bg-white py-4 pl-6 pr-4 gap-5 rounded-2xl border border-gray-100 shadow-sm"><p className="text-gray-700 font-medium">Start Report</p>
            <button onClick={() => setShowModal(true)}className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow text-base transition-colors flex items-center">
              <span className="mr-2 ml-2 my-2">▶</span> Create Ticket</button></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <StatCard title="Bug Reported" value={stats?.bugReported || 0} icon={<Bug size={22} />} iconBgColor="bg-red-500" href="#" loading={!stats}/>
          <StatCard title="Bug Fixed" value={stats?.bugFixed || 0} icon={<Bug size={22} />} iconBgColor="bg-green-500" href="#" loading={!stats}/>
          <StatCard title="Active Projects" value={stats?.activeProjects || 0} icon={<FolderKanban size={22} />} iconBgColor="bg-blue-500" href="#" loading={!stats}/></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-xl font-bold text-gray-800">Recent Bug Reports</h4>
              <Link href="#" className="text-blue-500 text-sm font-medium hover:underline">View All</Link></div>
            {recentBugs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FolderKanban className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium">No bug reports</h3>
                <p className="mt-1 text-sm">No bugs have been reported yet</p></div>) : (
              <ul className="space-y-4">
                {recentBugs.map((bug) => {
                  const statusColor = getStatusColor(bug.status);
                  return (<li key={bug.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div>
                        <span className="text-gray-700 font-medium block">{bug.title}</span>
                        <span className="text-gray-500 text-sm">Project: {bug.project}</span></div>
                      <span className={`px-3 py-1 ${statusColor.bg} ${statusColor.text} rounded-full text-sm font-medium`}>{getStatusText(bug.status)}</span></li>);})}</ul>)}</div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h4 className="text-xl font-bold text-gray-800 mb-5">Development Log</h4>
            {devLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="mx-auto bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-gray-400">📝</span></div>
                <h3 className="mt-2 text-sm font-medium">No development logs</h3>
                <p className="mt-1 text-sm">Development activities will appear here</p></div>) : (<ul className="space-y-4">{devLogs.map((log) => (<li key={log.id} className="flex items-start">
                    <div className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3 mt-1">
                      <span className="block w-5 h-5 text-center">{log.icon}</span></div>
                    <div><p className="text-gray-700 font-medium">{log.title}</p>
                      <p className="text-gray-500 text-sm">{log.description}</p></div></li>))}</ul>)}</div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h4 className="text-xl font-bold text-gray-800 mb-5">Client Reviews</h4>
            {clientReviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="mx-auto bg-yellow-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-yellow-400 text-xl">★</span></div>
                <h3 className="mt-2 text-sm font-medium">No reviews yet</h3>
                <p className="mt-1 text-sm">Client reviews will appear here</p></div>) : (
              <div className="space-y-5">
                {clientReviews.map((review) => (
                  <div key={review.id} className="bg-blue-50 p-5 rounded-lg">
                    <div className="flex text-yellow-400 text-xl mb-2">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                    <p className="text-gray-700 italic">"{review.comment}"</p>
                    <p className="text-gray-500 mt-2 font-medium">- {review.clientName}</p></div>))}</div>)}</div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h4 className="text-xl font-bold text-gray-800 mb-5">Service Progress</h4>
            {serviceProgress.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="mx-auto bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-gray-400">📊</span></div>
                <h3 className="mt-2 text-sm font-medium">No active services</h3>
                <p className="mt-1 text-sm">Service progress will appear here</p></div>) : (
              <ul className="space-y-6">
                {serviceProgress.map((service) => {
                  const progressColor = service.progress === 100? 'bg-green-500': service.progress > 50? 'bg-blue-500': 'bg-yellow-500';
                  const statusColor = service.progress === 100? 'text-green-500': service.progress > 50? 'text-blue-500': 'text-yellow-500';
                  return (<li key={service.id}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-700">{service.title}</span>
                        <span className="font-medium">{service.progress}%</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full ${progressColor}`}
                          style={{ width: `${service.progress}%` }}></div></div>
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-gray-500">Assigned to: {service.assignee}</span>
                        <span className={`text-sm font-medium ${statusColor}`}>
                          {service.status}</span></div></li>);})}</ul>)}</div></div></div>
      <BugReportModal show={showModal} onClose={() => setShowModal(false)} onSubmit={handleTicketSubmit} auth={auth}/>
      <ChatPopup show={showChat} onClose={() => setShowChat(false)} initialMessages={initialChatMessages} ticketData={ticketData} ticketImagePreview={ticketImagePreview} userName={auth.user.name}/>
      {!showChat && (<button onClick={openEmptyChat}
          className="fixed bottom-6 right-6 z-40 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110"
          title="Live Chat">
          <MessageSquare size={24} />
        </button>)}
    </AppLayout>);}