import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

export default function Profile() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(null);

  console.log("TOKEN TEST:", token);

  useEffect(() => {
    async function load() {
      if (!token) return;

      const res = await fetch("http://127.0.0.1:5000/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.log("Profile error:", await res.text());
        return;
      }

      const data = await res.json();
      setProfile(data);
    }

    load();
  }, [token]);

  if (!token) return <p>Not logged in.</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile Page</h2>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <img src={profile.avatar_url} width={80} />
    </div>
  );
}
