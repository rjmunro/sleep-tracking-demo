import React from "react";
import { useQuery } from "@tanstack/react-query";

// Define the User type based on the API response structure
interface User {
  id: number;
  name: string;
  dailyEntriesCount: number;
}

// Define the props for the UsersTable component
interface UsersTableProps {
  selectedUserId: number | null;
  setSelectedUserId: (userId: number) => void;
}

// Function to fetch users from the API
const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const UsersTableComponent: React.FC<UsersTableProps> = ({
  selectedUserId,
  setSelectedUserId,
}) => {
  // Use react-query's useQuery hook to fetch data
  const { data, error, isLoading } = useQuery<User[], Error>(
    ["users"],
    fetchUsers
  );

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-4">
        Error: {error.message}
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Counter
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((user) => (
            <tr
              key={user.id}
              className={`cursor-pointer ${
                selectedUserId === user.id ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedUserId(user.id)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.dailyEntriesCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTableComponent;
