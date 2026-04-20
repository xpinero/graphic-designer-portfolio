export type ProjectCategory = 'branding' | 'web-design' | 'print' | 'illustration';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  image: string;
  description: string;
  year: number;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Modern Brand Identity',
    category: 'branding',
    image: '/projects/project-1.svg',
    description: 'Complete brand identity design for a tech startup, including logo, color palette, and brand guidelines.',
    year: 2024,
  },
  {
    id: '2',
    title: 'E-commerce Website Design',
    category: 'web-design',
    image: '/projects/project-2.svg',
    description: 'Clean and modern e-commerce website design with focus on user experience and conversion.',
    year: 2024,
  },
  {
    id: '3',
    title: 'Magazine Layout',
    category: 'print',
    image: '/projects/project-3.svg',
    description: 'Editorial design for a lifestyle magazine featuring elegant typography and layout.',
    year: 2023,
  },
  {
    id: '4',
    title: 'Custom Illustrations',
    category: 'illustration',
    image: '/projects/project-4.svg',
    description: 'Series of custom illustrations for a children\'s book project.',
    year: 2024,
  },
  {
    id: '5',
    title: 'Restaurant Branding',
    category: 'branding',
    image: '/projects/project-5.svg',
    description: 'Full branding package for a fine dining restaurant including menu design and signage.',
    year: 2023,
  },
  {
    id: '6',
    title: 'Portfolio Website',
    category: 'web-design',
    image: '/projects/project-6.svg',
    description: 'Minimalist portfolio website for a photographer with focus on showcasing work.',
    year: 2024,
  },
  {
    id: '7',
    title: 'Product Packaging',
    category: 'print',
    image: '/projects/project-7.svg',
    description: 'Eco-friendly packaging design for an organic skincare brand.',
    year: 2023,
  },
  {
    id: '8',
    title: 'Character Design',
    category: 'illustration',
    image: '/projects/project-8.svg',
    description: 'Character design and development for an animated series.',
    year: 2024,
  },
  {
    id: '9',
    title: 'Corporate Identity',
    category: 'branding',
    image: '/projects/project-9.svg',
    description: 'Professional corporate identity system for a consulting firm.',
    year: 2023,
  },
];

export const categories: { value: ProjectCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Projects' },
  { value: 'branding', label: 'Branding' },
  { value: 'web-design', label: 'Web Design' },
  { value: 'print', label: 'Print' },
  { value: 'illustration', label: 'Illustration' },
];
