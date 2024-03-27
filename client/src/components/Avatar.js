import React from 'react';
import Spinner from './Spinner';

const Avatar = ({ user, isLoading }) => {
    return (
        <>
            {!isLoading ? (
                <div className="avatar online placeholder cursor-pointer">
                    <div
                        className="bg-neutral text-neutral-content rounded-full w-8 hover:bg-secondary"
                        title={user?.userName} // Display full name on hover
                    >
                        {/* <span className="text-xs">{user.userName?.slice(0, 1).toUpperCase()}</span> */}
                        <img src={user?.imgURL} alt='avatar' />
                    </div>
                </div>
            ) : (
                <Spinner />
            )}
        </>
    );
};

export default Avatar;
