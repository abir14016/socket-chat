import React from 'react';

const AvatarGroup = ({ user }) => {
    return (
        <div className="avatar online placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-8">
                <span className="text-xs">{user.userName?.slice(0, 1).toUpperCase()}</span>
            </div>
        </div>
    );
};

export default AvatarGroup;