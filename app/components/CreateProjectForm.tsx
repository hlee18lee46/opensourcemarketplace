"use client";
import { useState } from 'react';

const CreateProjectForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [level, setLevel] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const project = { name, description, url, level, tags: tags.split(',') };

    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (res.ok) {
        alert('Project created successfully!');
      } else {
        alert('Failed to create project');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Project Name" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project Description" required></textarea>
      <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Project URL" required />
      <input type="text" value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Project Level" required />
      <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma-separated)" required />
      <button type="submit">Create Project</button>
    </form>
  );
};

export default CreateProjectForm;
