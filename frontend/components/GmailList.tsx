import { Mail } from "lucide-react";

interface GmailListProps {
  gmails: string[];
}

export default function GmailList({ gmails }: GmailListProps) {
  return (
    <ul className="flex flex-col gap-4 w-fit">
      {gmails.map((gmail, index) => (
        <li
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 flex items-center space-x-3">
            <Mail className="h-6 w-6 text-blue-500" />
            <span className="text-sm font-medium text-gray-900">{gmail}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
