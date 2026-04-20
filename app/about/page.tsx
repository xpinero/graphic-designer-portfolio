import AnimatedSection from '@/components/AnimatedSection';
import { Award, Briefcase, Heart, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'About | Ariel Pinero',
  description: 'Learn more about Ariel Pinero, a creative graphics designer with a passion for visual storytelling.',
};

const skills = [
  'Brand Identity Design',
  'Logo Design',
  'Web Design',
  'UI/UX Design',
  'Print Design',
  'Illustration',
  'Typography',
  'Color Theory',
  'Adobe Creative Suite',
  'Figma',
];

const services = [
  {
    icon: Sparkles,
    title: 'Brand Identity',
    description: 'Complete brand identity systems including logo design, color palettes, typography, and brand guidelines.',
  },
  {
    icon: Briefcase,
    title: 'Web Design',
    description: 'Modern, responsive website designs that combine aesthetics with functionality and user experience.',
  },
  {
    icon: Award,
    title: 'Print Design',
    description: 'High-quality print materials including brochures, business cards, packaging, and editorial layouts.',
  },
  {
    icon: Heart,
    title: 'Custom Illustration',
    description: 'Original illustrations tailored to your brand, from digital art to hand-drawn designs.',
  },
];

const experience = [
  {
    year: '2022 - Present',
    title: 'Senior Graphics Designer',
    company: 'Creative Studio',
    description: 'Leading design projects for major brands and startups.',
  },
  {
    year: '2019 - 2022',
    title: 'Graphics Designer',
    company: 'Design Agency',
    description: 'Worked on diverse projects including branding, web design, and print.',
  },
  {
    year: '2017 - 2019',
    title: 'Junior Designer',
    company: 'Marketing Firm',
    description: 'Developed design skills across multiple mediums and industries.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About Me
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            A passionate designer dedicated to creating meaningful visual experiences
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-foreground">
                Hello, I'm Ariel
              </h2>
              <div className="space-y-4 text-foreground/70 leading-relaxed">
                <p>
                  I'm a graphics designer with over 7 years of experience in creating visual identities 
                  that tell compelling stories. My approach combines strategic thinking with creative 
                  execution to deliver designs that not only look beautiful but also achieve business goals.
                </p>
                <p>
                  I believe that great design is about more than aesthetics—it's about solving problems, 
                  communicating ideas, and creating emotional connections. Every project is an opportunity 
                  to craft something unique and meaningful.
                </p>
                <p>
                  When I'm not designing, you can find me exploring art galleries, sketching in coffee shops, 
                  or staying up to date with the latest design trends and technologies.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="bg-muted p-8 rounded-2xl">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-background text-foreground/80 rounded-full text-sm font-medium border border-border"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.2} className="mb-20">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">
            Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="p-6 bg-muted rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-accent" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">
            Experience
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="relative pl-8 pb-8 border-l-2 border-border last:pb-0"
              >
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-accent border-4 border-background"></div>
                <div className="text-sm text-accent font-medium mb-2">
                  {exp.year}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {exp.title}
                </h3>
                <div className="text-foreground/60 mb-2">{exp.company}</div>
                <p className="text-foreground/70">{exp.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
