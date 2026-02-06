import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [emails, setEmails] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/emails")
      .then(res => res.json())
      .then(setEmails);
  }, []);

  if (!session) return <p>Please login</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Dashboard</h2>
      <p>{session.user?.email}</p>

      <button onClick={() => signOut()}>Logout</button>

      <h3>Emails</h3>

      {emails.length === 0 && <p>No emails yet</p>}

      {emails.map(e => (
        <div key={e.id}>
          {e.email} — {e.status}
        </div>
      ))}
    </div>
  );
}
