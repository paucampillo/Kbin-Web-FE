import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updateComment, getComments } from '../../services/api';

const CommentEdit = () => {
    const { comment_id } = useParams();
    const [body, setBody] = useState('');

    useEffect(() => {
        const fetchComment = async () => {
            try {
                // Lógica para obtener los datos del comentario según comment_id
                // Ejemplo:
                // const commentData = await getCommentData(comment_id);
                // setBody(commentData.body);
                const commentData = await getComments(comment_id);
                setBody(commentData.body);

            } catch (error) {
                console.error('Error fetching comment data:', error);
            }
        };

        fetchComment();
    }, [comment_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const commentData = { body };

        try {
            // Lógica para enviar los datos del comentario actualizado al servidor
            // Ejemplo:
            // const updatedComment = await updateComment(comment_id, commentData);
            // console.log('Comment updated successfully:', updatedComment);
            const updatedComment = await updateComment(comment_id, commentData);
            console.log('Comment updated successfully:', updatedComment);

        } catch (error) {
            console.error('Error updating comment:', error);
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
                                            id="body"
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
                                                        id="entry_link_submit"
                                                        name="entry_link[submit]"
                                                        className="btn btn__primary"
                                                    >
                                                        Edit comment
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
