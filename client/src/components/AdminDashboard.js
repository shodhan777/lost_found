import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const usersRes = await API.get('/admin/users');
            setUsers(usersRes.data);

            const lostRes = await API.get('/admin/lost-items');
            setLostItems(lostRes.data);

            const foundRes = await API.get('/admin/found-items');
            setFoundItems(foundRes.data);
        } catch (err) {
            console.error("Error fetching admin data", err);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await API.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.error("Error deleting user", err);
        }
    };

    const deleteItem = async (type, id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await API.delete(`/admin/items/${type}/${id}`);
            if (type === 'lost') {
                setLostItems(lostItems.filter(i => i.id !== id));
            } else {
                setFoundItems(foundItems.filter(i => i.id !== id));
            }
        } catch (err) {
            console.error("Error deleting item", err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </header>

            <div className="admin-tabs">
                <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</button>
                <button className={activeTab === 'lost' ? 'active' : ''} onClick={() => setActiveTab('lost')}>Lost Items</button>
                <button className={activeTab === 'found' ? 'active' : ''} onClick={() => setActiveTab('found')}>Found Items</button>
            </div>

            <div className="admin-content">
                {activeTab === 'users' && (
                    <div className="table-container">
                        <h3>Registered Users</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button className="delete-btn" onClick={() => deleteUser(user.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'lost' && (
                    <div className="table-container">
                        <h3>Reported Lost Items</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lostItems.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.title}</td>
                                        <td>{item.description}</td>
                                        <td>{item.status}</td>
                                        <td>
                                            <button className="delete-btn" onClick={() => deleteItem('lost', item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'found' && (
                    <div className="table-container">
                        <h3>Reported Found Items</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {foundItems.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.title}</td>
                                        <td>{item.description}</td>
                                        <td>{item.status}</td>
                                        <td>
                                            <button className="delete-btn" onClick={() => deleteItem('found', item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
