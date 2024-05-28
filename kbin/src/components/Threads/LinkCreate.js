import React, { useState, useEffect } from 'react';
import { createThread, getMagazines } from '../../services/api';

const LinkCreate = () => {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [magazines, setMagazines] = useState([]);
    const [selectedMagazine, setSelectedMagazine] = useState('');

    useEffect(() => {
        const fetchMagazines = async () => {
            try {
                const data = await getMagazines();
                setMagazines(data);
            } catch (error) {
                console.error('Error fetching magazines:', error);
            }
        };

        fetchMagazines();
    }, []); // Empty dependency array ensures this runs once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        const linkData = { url, title, body, magazine: selectedMagazine };
        try {
            const newLink = await createThread(linkData);
            console.log('Link created successfully:', newLink);
            // Optionally reset the form
            setUrl('');
            setTitle('');
            setBody('');
            setSelectedMagazine('');
            // Redirect to the links list page and force a full page reload
            window.location.href = '/threads';
        } catch (error) {
            console.error('Error creating link:', error);
        }
    };

    return (
        <div id="middle" className="page-entry-create page-entry-create-link">
            <div className="kbin-container">
                <main id="main" className="view-compact">
                    <div id="content" className="section">
                        <div className="container">
                            <form onSubmit={handleSubmit} className="entry-create">
                                <div>
                                    <label htmlFor="entry_link_url" className="required">URL</label>
                                    <input
                                        type="url"
                                        id="entry_link_url"
                                        name="url"
                                        required
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        style={{ display: 'block', padding: '1rem .5rem', width: '100%' }}
                                    />
                                </div>

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
                                                    Add New Link
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

export default LinkCreate;    