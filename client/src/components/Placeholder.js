import React from 'react';

const Placeholder = ({ length }) => {
    return (
        <div className="avatar placeholder">
            <div className="w-8 bg-neutral text-sm font-semibold text-secondary">
                <span>+{length}</span>
            </div>
        </div>
    );
};

export default Placeholder;