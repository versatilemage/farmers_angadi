// pages/admin/components/UsersTab.tsx

import { useEffect, useState } from 'react';

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/users'); // You may need to add this API
      const data = await res.json();
      setUsers(data.users || []);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  if (loading) return <div className="flex justify-center"><div className="loader"></div></div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="text-left p-4 font-medium">Username</th>
            <th className="text-left p-4 font-medium">Email</th>
            <th className="text-left p-4 font-medium">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="p-4">{user.username}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
