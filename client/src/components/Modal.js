import React from 'react';

const Modal = ({ users, room }) => {
    return (
        <dialog id="all_Users_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost text-red-700 font-bold absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Room: <span className='text-secondary'>{room}</span></h3>
                <div className='max-h-48 overflow-y-auto'>
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>Sl NO.</th>
                                <th>Name</th>
                                <th>ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((user, index) => (
                                    <tr>
                                        <th>{index + 1}</th>
                                        <td>{user.userName}</td>
                                        <td>{user.userId}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <h4 className='font-semibold text-right'>Tolal users: <span className='text-secondary'>{users.length}</span></h4>
            </div>
        </dialog>
    );
};

export default Modal;