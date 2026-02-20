import { Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import Card from "./ui/Card";

export default function PostCard() {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            AR
          </div>
          <div>
            <p className="font-semibold">Alex Ray</p>
            <p className="text-xs text-gray-400">2h ago</p>
          </div>
        </div>

        <p className="text-gray-200">
          Just shipped a new feature 🚀 What do you think?
        </p>

        <div className="flex gap-6 text-gray-400 text-sm">
          <div className="flex items-center gap-2 hover:text-red-400 cursor-pointer transition">
            <Heart size={18} />
            24
          </div>
          <div className="flex items-center gap-2 hover:text-purple-400 cursor-pointer transition">
            <MessageCircle size={18} />6
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
