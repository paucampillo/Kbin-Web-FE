import React, { useState, useEffect } from 'react';
import { getThread, updateThreadLink, getMagazines } from '../../services/api';
import { useParams } from 'react-router-dom';

const ThreadLinkEdit = () => {
    const { thread_id } = useParams();  // Obtiene el thread_id de los parámetros de la URL
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [magazines, setMagazines] = useState([]);
    const [selectedMagazine, setSelectedMagazine] = useState('');
    const [isLink, setIsLink] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getThread(thread_id, false);
                setUrl(data.url || '');
                setTitle(data.title);
                setBody(data.body);
                setSelectedMagazine(data.magazine.id);
                setIsLink(!!data.url);
            } catch (error) {
                console.error('Error fetching thread or link:', error);
            }
        };

        const fetchMagazines = async () => {
            try {
                const data = await getMagazines();
                setMagazines(data);
            } catch (error) {
                console.error('Error fetching magazines:', error);
            }
        };

        fetchData();
        fetchMagazines();
    }, [thread_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const threadLinkData = { url, title, body, magazine: selectedMagazine };
        try {
            const updatedThreadOrLink = await updateThreadLink(thread_id, threadLinkData);
            console.log('Thread/Link updated successfully:', updatedThreadOrLink);
            // Redirect to the threads/links list page and force a full page reload
            window.location.href = '/threads';
        } catch (error) {
            console.error('Error updating thread or link:', error);
        }
    };

    return (
        <div id="middle" className={`page-entry-create ${isLink ? 'page-entry-edit-link' : 'page-entry-edit-thread'}`}>
            <div className="kbin-container">
                <main id="main" className="view-compact">
                    <div id="content" className="section">
                        <div className="container">
                            <form onSubmit={handleSubmit} className="entry-edit">
                                {isLink && (
                                    <div>
                                        <label htmlFor="entry_link_url" className="required">URL</label>
                                        <input
                                            type="url"
                                            id="entry_link_url"
                                            name="url"
                                            value={url}
                                            disabled
                                            style={{ display: 'block', padding: '1rem .5rem', width: '100%' }}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="entry_link_title" className="required">Title</label>
                                    <textarea
                                        id="entry_link_title"
                                        name="title"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        style={{ overflow: 'hidden', height: '70px' }}
                                    />
                                </div>

                                <div>
                                    <textarea
                                        id="entry_link_body"
                                        name="body"
                                        placeholder="Body"
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        style={{ overflow: 'hidden', height: '70px' }}
                                    />
                                </div>

                                <div>
                                    <select
                                        id="entry_article_magazine_autocomplete"
                                        name="magazine"
                                        required
                                        value={selectedMagazine}
                                        onChange={(e) => setSelectedMagazine(e.target.value)}
                                        disabled
                                    >
                                        <option value="" disabled>Select a magazine:</option>
                                        {magazines.map((magazine) => (
                                            <option key={magazine.id} value={magazine.id}>
                                                {magazine.name}
                                            </option>
                                        ))}
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

export default ThreadLinkEdit;
