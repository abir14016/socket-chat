import React, { useState } from 'react';
import Avatar from './Avatar';

const Placeholder = ({ length, users }) => {
    const [showAllUsers, setShowAllUsers] = useState(false);
    const displayAll = () => {
        setShowAllUsers(true);
    }
    return (
        <>
            {
                !showAllUsers ? (
                    <div onClick={displayAll} className="avatar placeholder cursor-pointer">
                        <div className="w-8 bg-neutral text-sm font-semibold text-secondary">
                            <span>+{length}</span>
                        </div>
                    </div>
                ) : <>
                    {
                        users.slice(3).map((user) => <Avatar
                            key={user.userId}
                            user={user}
                        >
                        </Avatar>)
                    }
                </>
            }
        </>
    );
};

export default Placeholder;