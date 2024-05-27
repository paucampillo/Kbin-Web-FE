import React, { useState } from 'react';
//import { useHistory } from 'react-router-dom';
import { createMagazine } from '../../services/api'; // Ajusta la ruta según tu estructura de proyecto
import Cookies from 'js-cookie';

const MagazineForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        description: '',
        rules: ''
    });
    const [error, setError] = useState(null);
    //const [success, setSuccess] = useState(false);
    //const history = useHistory(); // Hook de React Router

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const csrfToken = Cookies.get('csrftoken');
        try {
            await createMagazine(formData, csrfToken);
            //setSuccess(true);
            setError(null);
            setFormData({
                name: '',
                title: '',
                description: '',
                rules: ''
            });
            window.location.href = '/threads'
            //history.push('/threads'); // Redirige a la lista de magazines después de crear uno nuevo
        } catch (error) {
            setError('Failed to create magazine');
            //setSuccess(false);
        }
    };

    return (
        <div id="middle" className="page-entry-create page-entry-create-link">
            <div className="kbin-container">
                <main id="main" className="">
                    <div id="content" className="section">
                        <div className="container">
                            <form name="magazine" onSubmit={handleSubmit}>
                                {error && <div className="error">{error}</div>}
                                <FormInput
                                    id="magazine_name"
                                    name="name"
                                    label="Name"
                                    type="text"
                                    placeholder="/m/"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    maxLength="25"
                                />
                                <FormInput
                                    id="magazine_title"
                                    name="title"
                                    label="Title"
                                    type="text"
                                    placeholder="Title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    maxLength="50"
                                    style={{ overflow: 'hidden', height: '51px' }}
                                />
                                <FormTextArea
                                    id="magazine_description"
                                    name="description"
                                    label="Description"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    maxLength="10000"
                                    style={{ overflow: 'hidden', height: '70px' }}
                                />
                                <FormTextArea
                                    id="magazine_rules"
                                    name="rules"
                                    label="Rules"
                                    placeholder="Rules"
                                    value={formData.rules}
                                    onChange={handleChange}
                                    maxLength="10000"
                                    style={{ overflow: 'hidden', height: '70px' }}
                                />
                                <div className="row actions">
                                    <div className="float-end">
                                        <button type="submit" id="magazine_submit" className="btn btn__primary">
                                            Create New Magazine
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const FormInput = ({ id, name, label, type, placeholder, value, onChange, required, maxLength, style }) => (
    <div>
        <label htmlFor={id} className="required">{label}</label>
        <input
            type={type}
            id={id}
            name={name}
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            style={style}
        />
    </div>
);

const FormTextArea = ({ id, name, label, placeholder, value, onChange, maxLength, style }) => (
    <div>
        <label htmlFor={id}>{label}</label>
        <textarea
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            style={style}
        />
    </div>
);

export default MagazineForm;
