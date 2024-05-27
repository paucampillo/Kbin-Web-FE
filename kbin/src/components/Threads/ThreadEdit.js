import React, { useState, useEffect } from 'react';
import { getThread, updateThread } from '../../services/api';
import { useHistory, useParams } from 'react-router-dom';

const ThreadEdit = () => {
    const { thread_id } = useParams();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const history = useHistory();

    useEffect(() => {
        const fetchThread = async () => {
            try {
                const data = await getThread(thread_id);
                setTitle(data.title);
                setBody(data.body);
            } catch (error) {
                console.error('Error fetching thread:', error);
            }
        };

        fetchThread();
    }, [thread_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const threadData = { title, body, magazine };
        try {
            const updatedThread = await updateThread(thread_id, threadData);
            console.log('Thread updated successfully:', updatedThread);
            // Redirect to the threads list page
            history.push('/threads');
        } catch (error) {
            console.error('Error updating thread:', error);
        }
    };

    return (
        <div id="middle" className="page-entry-create page-entry-edit-link">
            <div className="kbin-container">
                <main id="main" className="view-compact">
                    <div id="content" className="section">
                        <div className="container">
                            <form onSubmit={handleSubmit} className="entry-edit">
                                <div>
                                    <label htmlFor="entry_thread_title" className="required">
                                        Title
                                    </label>
                                    <textarea
                                        id="entry_thread_title"
                                        name="title"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        style={{ overflow: 'hidden', height: '70px' }}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="entry_thread_body">
                                        Body
                                    </label>
                                    <textarea
                                        id="entry_thread_body"
                                        name="body"
                                        placeholder="Body"
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        style={{ overflow: 'hidden', height: '70px' }}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="entry_article_magazine_autocomplete">
                                        Magazine
                                    </label>
                                    <select
                                        id="entry_article_magazine_autocomplete"
                                        name="magazine"
                                        required
                                        value={magazine}
                                        onChange={(e) => setMagazine(e.target.value)}
                                        disabled
                                    >
                                        <option value="" disabled>Select a magazine:</option>
                                        {/* Assuming magazine data is an object with id and name */}
                                        <option value={magazine.id}>
                                            {magazine.name}
                                        </option>
                                    </select>
                                </div>

                                <div className="row actions">
                                    <ul>
                                        <li>
                                            <div>
                                                <button type="submit" className="btn btn__primary">
                                                    Edit
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ThreadEdit;
