'use client';

import { useState } from 'react';
import { projects, categories, ProjectCategory } from '@/lib/data';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

export default function PortfolioGrid() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.value
                ? 'bg-accent text-background shadow-md'
                : 'bg-muted text-foreground/70 hover:text-foreground hover:bg-muted/80'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onClick={() => setSelectedProject(project.id)}
          />
        ))}
      </div>

      {/* Project Modal */}
      {selectedProjectData && (
        <ProjectModal
          project={selectedProjectData}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
