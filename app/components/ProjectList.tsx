"use client";
import { useEffect, useState } from 'react';

// Define the structure of a project
interface Project {
  _id: string;
  name: string;
  description: string;
  url: string;
}

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]); // Use Project[] type

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/projects');
        const data = await res.json();
        console.log('Fetched projects:', data); // Log the fetched data to the console
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    };
    fetchProjects();
  }, []);
  

  return (
    <div>
      <h1>Open Source Projects</h1>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              <a href={project.url} target="_blank" rel="noopener noreferrer">View Project</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
};

export default ProjectList;
