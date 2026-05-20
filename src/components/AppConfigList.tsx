import { FC, useState } from 'react';

const apps = [
  { name: 'WhatsApp', allowed: true },
  { name: 'Gmail', allowed: false },
  { name: 'Slack', allowed: true },
];

const AppConfigList: FC = () => {
  const [appStates, setAppStates] = useState(apps);

  const toggleApp = (idx: number) => {
    setAppStates(prev => prev.map((app, i) => i === idx ? { ...app, allowed: !app.allowed } : app));
  };

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold mb-2">Application Configuration</h2>
      <ul className="space-y-2">
        {appStates.map((app, idx) => (
          <li key={app.name} className="bg-zinc-800 rounded p-4 flex justify-between items-center">
            <span>{app.name}</span>
            <button
              className={`px-3 py-1 rounded text-sm font-medium ${app.allowed ? 'bg-green-700 text-white' : 'bg-zinc-700 text-zinc-300'}`}
              onClick={() => toggleApp(idx)}
              aria-pressed={app.allowed}
            >
              {app.allowed ? 'Allowed' : 'Excluded'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AppConfigList;
