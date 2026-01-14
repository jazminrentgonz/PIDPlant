import Toolbar from '../components/Toolbar';
import Dashboard from '../components/Dashboard';

export default function Home() {
  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <Toolbar />
      <Dashboard />
    </div>
  );
}
