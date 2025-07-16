import {
  LayoutDashboard,
  Server,
  Database,
  Cog,
  HardDrive,
  BarChart3,
  LogOut,
  Shapes,
} from "lucide-react";

export function NSidebar() {
  return (
    <aside className="flex flex-col items-center bg-white w-17 p-4 border-r">
      <div className="p-2 mb-8 rounded-lg bg-blue-500 text-white">
        <Shapes size={28} />
      </div>
      <nav className="flex flex-col gap-8">
        <a href="#" className="p-2 rounded-lg bg-blue-100 text-blue-600">
          <LayoutDashboard size={18} />
        </a>
        <a href="#" className="p-2 text-gray-400 hover:text-blue-600">
          <Server size={18} />
        </a>
        <a href="#" className="p-2 text-gray-400 hover:text-blue-600">
          <Database size={18} />
        </a>
        <a href="#" className="p-2 text-gray-400 hover:text-blue-600">
          <BarChart3 size={18} />
        </a>
        <a href="#" className="p-2 text-gray-400 hover:text-blue-600">
          <HardDrive size={18} />
        </a>
      </nav>
      <div className="mt-auto flex flex-col gap-8">
        <a href="#" className="p-2 text-gray-400 hover:text-blue-600">
          <Cog size={18} />
        </a>
        <a href="#" className="p-2 text-gray-400 hover:text-blue-600">
          <LogOut size={18} />
        </a>
      </div>
    </aside>
  );
}
