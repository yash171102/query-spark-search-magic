
import React from 'react';
import { User as UserIcon, Star } from 'lucide-react';
import { User } from '../types/search';

interface UserProfileProps {
  user: User | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <UserIcon className="h-5 w-5" />
        <span className="text-sm">Guest User</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">
          {user.firstName} {user.lastName}
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          {user.isReturning && (
            <>
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span>Returning Customer</span>
            </>
          )}
        </div>
      </div>
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-sm font-medium text-blue-600">
          {user.firstName[0]}{user.lastName[0]}
        </span>
      </div>
    </div>
  );
};

export default UserProfile;
