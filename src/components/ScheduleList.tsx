import { FC } from 'react';

const schedules = [
  { name: 'Deep Work', time: '09:00–12:00' },
  { name: 'Out of Hours', time: '18:00–08:00' },
];

const ScheduleList: FC = () => (
  <section className="mb-6">
    <h2 className="text-xl font-bold mb-2">Scheduling Rules</h2>
    <ul className="space-y-2">
      {schedules.map((rule, idx) => (
        <li key={idx} className="bg-zinc-800 rounded p-4 flex justify-between items-center">
          <span>{rule.name}</span>
          <span className="text-zinc-400">{rule.time}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default ScheduleList;
