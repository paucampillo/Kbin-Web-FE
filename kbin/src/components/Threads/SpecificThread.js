import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Thread from './Thread';
import { getThread } from '../../services/api';

// Stub de momento
const user = {
    id: 1,
    username: 'example_user',
    isAuthenticated: true,
};

const SpecificThread = () => {
    const { thread_id } = useParams(); // Obtiene el thread_id de los parámetros de la URL
    const [thread, setThread] = useState(null);
    const [error, setError] = useState(null);

    const fetchThread = useCallback(async () => {
        setError(null);
        try {
            const data = await getThread(thread_id, user.isAuthenticated);
            const threadWithTime = {
                ...data,
                time_since_creation: timeElapsed(data.created_at),
                time_since_update: timeElapsed(data.updated_at),
                is_edited: isEdited(data.created_at, data.updated_at),
            };
            setThread(threadWithTime);
        } catch (error) {
            setError('Failed to fetch thread');
        }
    }, [thread_id]);

    useEffect(() => {
        fetchThread();
    }, [fetchThread]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!thread) {
        return <div>Loading...</div>;
    }

    return (
        <div className="theme--dark">
            <main id="main" className="view-compact">
                <div id="content">
                    <Thread thread={thread} user={user} reloadThreads={fetchThread} showBody={true} />
                </div>
            </main>
        </div>
    );
};

const timeElapsed = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const timeDiff = Math.abs(now - createdDate);

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
};

const isEdited = (createdAt, updatedAt) => {
    return new Date(createdAt).getTime() !== new Date(updatedAt).getTime();
};

export default SpecificThread;
