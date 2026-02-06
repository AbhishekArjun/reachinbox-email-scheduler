import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>ReachInbox</h1>
      <button onClick={() => signIn("google")}>
        Login with Google
      </button>
    </div>
  );
}
