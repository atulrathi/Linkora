import Card from "../components/ui/Card";

export default function Messages() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-8">
      <Card className="h-[70vh] flex items-center justify-center">
        <p className="text-gray-400">
          Select a conversation to start messaging
        </p>
      </Card>
    </div>
  );
}
