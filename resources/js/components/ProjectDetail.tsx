import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

type ProjectDetailModalProps = {
    project: {
        id: number;
        name: string;
        description: string | null;
        client?: { id: number; name: string };
    };
    onClose: () => void;
};

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
    return (
        <Transition appear show={!!project} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="min-w-[80vw] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-sm text-gray-900"
                                >
                                    Project / 
                                    <span className='text-blue-700'> Project Detail</span> 
                                </Dialog.Title>
                                <div className="mt-4 space-y-3 flex gap-5">
                                    <div className='bg-gray-700 rounded-full w-[90px] h-[90px]'></div>
                                    <div className=''>
                                        <p className='font-semibold text-xl'>{project.name}</p>
                                        <p className='text-sm text-gray-500'>{project.client?.name || 'N/A'}</p>
                                        
                                        <p className='bg-green-500 mt-3 rounded-xl max-w-[80px] text-center text-xs text-white py-1'>Diproses</p>
                                    </div>
                                </div>
                                
                                <div className='flex gap-3'>
                                    <div className='border border-gray-300 rounded-xl p-3 w-[50vw]'>
                                        <h2 className='font-semibold'>General Information</h2>
                                    </div>
                                    <div className='w-full space-y-3'>
                                        <div className='border border-gray-300 rounded-xl p-3'>
                                            <h2 className='font-semibold'>Deskripsi</h2>
                                            <p className='pt-5 text-xs'>{project.description || '-'}</p>
                                        </div>
                                        <div className='border border-gray-300 rounded-xl p-3 min-h-[50vh]'>
                                            <h2 className='font-semibold '>Aktifitas</h2>
                                            <div className='pt-5 flex space-x-5 items-center relative'>
                                                <div className='text-xs space-y-1'>
                                                    <p>21-7-2025</p>
                                                    <p className='border w-[60px] text-center rounded-xl py-1 border-gray-300'>v1.0.0</p>
                                                </div>
                                                <div className='w-[0.5px] absolute left-[90px] h-full bg-gray-300'></div>
                                                <div>
                                                    <div className='flex'>
                                                        <div className='w-3 h-3 bg-black rounded-full z-20'></div>
                                                        <div>
                                                            <h2 className='text-sm ml-5 font-bold leading-0 mt-1'>Perbaikan Bug</h2>
                                                            <div className='bg-gray-700 ml-5 mt-5 rounded-2xl w-[200px] h-[100px]'></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded "
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ProjectDetailModal;
