import './App.css';
import { LogList } from './components/LogList';
import { mockLogs } from './data/mockLogs';

function App() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1>OIT x USJR Research Log</h1>
      <LogList logs = {mockLogs} />
    </div>
  );
}

export default App;
