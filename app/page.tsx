"use client";
import { useEffect, useState } from 'react';

// Define types for MongoDB and GitHub projects
interface MongoProject {
  _id: string;
  name: string;
  description: string;
  url: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count?: number; // Optional for popular repos
}

export default function Home() {
  const [mongoProjects, setMongoProjects] = useState<MongoProject[]>([]);
  const [githubRepos, setGitHubRepos] = useState<GitHubRepo[]>([]);
  const [popularRepos, setPopularRepos] = useState<GitHubRepo[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(''); // Language filter state

  const [newProject, setNewProject] = useState({ name: '', description: '', url: '' }); // New project state

  // Fetch MongoDB projects
  useEffect(() => {
    const fetchMongoProjects = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/projects/mongodb');
        const data: MongoProject[] = await res.json();
        setMongoProjects(data);
      } catch (error) {
        console.error('Failed to fetch MongoDB projects', error);
      }
    };

    // Fetch repositories from GitHub username
    const fetchGitHubRepos = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/projects/github');
        const data: GitHubRepo[] = await res.json();
        setGitHubRepos(data);
      } catch (error) {
        console.error('Failed to fetch GitHub repositories', error);
      }
    };

    fetchMongoProjects();
    fetchGitHubRepos();
  }, []);

  // Fetch popular GitHub repositories with optional language filter
  useEffect(() => {
    const fetchPopularRepos = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/projects/github/popular${selectedLanguage ? `?language=${selectedLanguage}` : ''}`
        );
        const data: GitHubRepo[] = await res.json();
        setPopularRepos(data);
      } catch (error) {
        console.error('Failed to fetch popular GitHub repositories', error);
      }
    };

    fetchPopularRepos();
  }, [selectedLanguage]);

  // Handle new project form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (res.ok) {
        const createdProject = await res.json();
        setMongoProjects([...mongoProjects, createdProject]); // Add the new project to the list
        setNewProject({ name: '', description: '', url: '' }); // Clear form
      }
    } catch (error) {
      console.error('Failed to create new project', error);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-6">Welcome to Open Source MarketPlace!</h1>

      {/* Form to create a new MongoDB project */}
      <h2 className="text-2xl font-bold mt-8">Create a New Project</h2>
      <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Project Name:</label>
          <input
            type="text"
            id="name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Project Description:</label>
          <input
            type="text"
            id="description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium">Project URL:</label>
          <input
            type="url"
            id="url"
            value={newProject.url}
            onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Project</button>
      </form>

      {/* Section for MongoDB Projects */}
      <h2 className="text-2xl font-bold mt-8">Open Source Market!</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {mongoProjects.length > 0 ? (
          mongoProjects.map((project) => (
            <div key={project._id} className="border rounded-lg p-4 shadow-md">
              <h3 className="text-xl font-bold">{project.name}</h3>
              <p className="text-gray-600">{project.description}</p>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 block"
              >
                View Project
              </a>
            </div>
          ))
        ) : (
          <p>No MongoDB projects available.</p>
        )}
      </div>

      {/* Section for GitHub Repositories */}
      <h2 className="text-2xl font-bold mt-8">My Github Repositories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {githubRepos.length > 0 ? (
          githubRepos.map((repo) => (
            <div key={repo.id} className="border rounded-lg p-4 shadow-md">
              <h3 className="text-xl font-bold">{repo.name}</h3>
              <p className="text-gray-600">{repo.description}</p>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 block"
              >
                View Repository
              </a>
            </div>
          ))
        ) : (
          <p>No GitHub repositories available.</p>
        )}
      </div>

      {/* Language Filter for Popular Repositories */}
      <div className="mt-8">
        <label htmlFor="language" className="block text-sm font-medium">Filter Popular Repos by Language: </label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">All Languages</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="ruby">Ruby</option>
          <option value="go">Go</option>
          <option value="typescript">TypeScript</option>
        </select>
      </div>

      {/* Section for Popular GitHub Repositories */}
      <h2 className="text-2xl font-bold mt-8">Popular Open Source Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {popularRepos.length > 0 ? (
          popularRepos.map((repo) => (
            <div key={repo.id} className="border rounded-lg p-4 shadow-md">
              <h3 className="text-xl font-bold">{repo.name}</h3>
              <p className="text-gray-600">{repo.description}</p>
              <p className="text-gray-500">⭐ {repo.stargazers_count} stars</p>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 block"
              >
                View Repository
              </a>
            </div>
          ))
        ) : (
          <p>No popular GitHub repositories available.</p>
        )}
      </div>
    </div>
  );
}
