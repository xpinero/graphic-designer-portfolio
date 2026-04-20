'use client';

import Image from 'next/image';
import { Project } from '@/lib/data';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="group cursor-pointer relative overflow-hidden rounded-lg bg-muted aspect-[4/3]"
    >
      <div className="relative w-full h-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
            <div className="text-xs uppercase tracking-wider text-accent-light mb-2">
              {project.category.replace('-', ' ')}
            </div>
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-sm text-background/80 line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
