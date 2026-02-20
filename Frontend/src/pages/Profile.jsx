import { useParams } from "react-router-dom";
import Card from "../components/ui/Card";

export default function Profile() {
  const { username } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-6 pt-8 space-y-6">
      <Card>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center text-xl">
            {username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{username}</h2>
            <p className="text-gray-400">Frontend Developer</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
