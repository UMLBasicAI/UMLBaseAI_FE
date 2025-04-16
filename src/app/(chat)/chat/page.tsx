'use client'
import { Mic, SendHorizontal, Plus, Globe, Lightbulb, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function UMLChatEntry() {
    const router = useRouter();
  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-white text-gray-800">
      <h1 className="text-4xl font-bold mb-8">What can I help with?</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-100 border border-gray-300 rounded-2xl shadow-md px-6 py-4 flex items-center gap-4 w-full max-w-3xl"
      >
        <Plus className="text-gray-800 cursor-pointer" />

        <input
          type="text"
          placeholder="Ask anything"
          className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
        />

        <button onClick={() => router.push('/chat/b69ef5cb-b1b2-4394-81d7-6b4e337b6137')} className="p-2 rounded-full hover:bg-gray-200 transition">
          <SendHorizontal className="text-gray-800" />
        </button>
      </motion.div>
    </div>
  );
}
