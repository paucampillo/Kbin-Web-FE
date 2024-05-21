import React, { useState } from 'react';
import { createMagazine } from '../../services/api';

const MagazineForm = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newMagazine = { name, title };
    await createMagazine(newMagazine);
    setName('');
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Name"
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Title"
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default MagazineForm;
