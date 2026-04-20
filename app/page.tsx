import PortfolioGrid from '@/components/PortfolioGrid';
import AnimatedSection from '@/components/AnimatedSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Creative Design Portfolio
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
              Transforming ideas into visual experiences through thoughtful design and creative excellence.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <PortfolioGrid />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
