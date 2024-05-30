import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { updateComment, updateReply, getComment, getReply } from '../../services/api';

const CommentEdit = () => {
    const { thread_id, comment_id, reply_id } = useParams(); // Añadir reply_id en caso de que se trate de una respuesta
    const history = useHistory(); // Hook para manejar la navegación
    const [body, setBody] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data;
                console.log('comment_id:', comment_id, 'reply_id:', reply_id);
                if (reply_id) {
                    // Si hay reply_id, obtener los datos de la respuesta
                    data = await getReply(reply_id);
                } else {
                    // Si no hay reply_id, obtener los datos del comentario
                    data = await getComment(comment_id);
                }
                setBody(data.body);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [comment_id, reply_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { body };

        try {
            if (reply_id) {
                // Si hay reply_id, actualizar la respuesta
                const updatedReply = await updateReply(reply_id, data);
                console.log('Reply updated successfully:', updatedReply);
            } else {
                // Si no hay reply_id, actualizar el comentario
                const updatedComment = await updateComment(comment_id, data);
                console.log('Comment updated successfully:', updatedComment);
            }
            window.location.href = `/thread/${thread_id}`; // Redirigir a la página del thread
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <div className="theme--dark">
            <div id="middle" className="page-entry-create page-entry-edit-comment">
                <div className="kbin-container">
                    <main id="main" className="view-compact">
                        <div id="content" className="section">
                            <div className="container">
                                <form onSubmit={handleSubmit} className="entry-edit" encType="multipart/form-data">
                                    <div>
                                        <label htmlFor="body">Body</label>
                                        <textarea
                                            id="entry_link_body"
                                            name="body"
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            required
                                            style={{ overflow: 'hidden', height: '70px' }}
                                        />
                                    </div>
                                    <div></div>
                                    <div className="row actions">
                                        <ul>
                                            <li>
                                                <div>
                                                    <button
                                                        type="submit"
                                                        className="btn btn__primary"
                                                    >
                                                        {reply_id ? 'Edit reply' : 'Edit comment'}
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
        </div>
    );
};

export default CommentEdit;
