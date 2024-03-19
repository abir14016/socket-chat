import React from 'react';
import Spinner from './Spinner';



const Avatar = ({ user, isLoading }) => {
    return (
        <div>
            {
                !isLoading ? (<div className="avatar online placeholder cursor-pointer">
                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                        <span className="text-xs">{user.userName?.slice(0, 1).toUpperCase()}</span>
                    </div>
                </div>) : <Spinner />
            }
        </div>
    );
};

export default Avatar;




