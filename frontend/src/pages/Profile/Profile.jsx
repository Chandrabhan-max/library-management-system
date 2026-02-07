import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/auth/profile").then((res) => {
      console.log("PROFILE DATA:", res.data);
      setProfile(res.data);
    });
  }, []);

  if (!profile) {
    return <p style={{ padding: 40 }}>Loading profile...</p>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
    </div>
  );
}
