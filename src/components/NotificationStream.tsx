import { FC } from 'react';

const notifications = [
  { app: 'Gmail', time: '10:15', summary: 'New message from Alice' },
  { app: 'WhatsApp', time: '11:02', summary: 'Project group: "Meeting at 2pm"' },
  { app: 'Slack', time: '11:30', summary: 'Reminder: Stand-up in 15 minutes' },
];

const NotificationStream: FC = () => (
  <section>
    <h2 className="text-xl font-bold mb-2">Held Notifications</h2>
    <ul className="space-y-2">
      {notifications.map((n, idx) => (
        <li key={idx} className="bg-zinc-800 rounded p-4 flex flex-col">
          <span className="font-semibold">{n.app}</span>
          <span className="text-zinc-400 text-xs">{n.time}</span>
          <span className="mt-1">{n.summary}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default NotificationStream;
