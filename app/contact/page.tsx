import ContactForm from '@/components/ContactForm';
import AnimatedSection from '@/components/AnimatedSection';
import { Mail, MapPin, Phone } from 'lucide-react';

export const metadata = {
  title: 'Contact | Ariel Pinero',
  description: 'Get in touch to discuss your next design project.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Let's Work Together
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Have a project in mind? I'd love to hear about it. Fill out the form below or reach out directly.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12">
          <AnimatedSection delay={0.2}>
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Contact Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-muted text-accent">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Email</h3>
                      <a 
                        href="mailto:hello@arielpinero.com" 
                        className="text-foreground/70 hover:text-accent transition-colors"
                      >
                        hello@arielpinero.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-muted text-accent">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Phone</h3>
                      <a 
                        href="tel:+1234567890" 
                        className="text-foreground/70 hover:text-accent transition-colors"
                      >
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-muted text-accent">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Location</h3>
                      <p className="text-foreground/70">
                        New York, NY
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border">
                <h3 className="font-medium text-foreground mb-4">
                  What to Expect
                </h3>
                <ul className="space-y-2 text-foreground/70">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Response within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Free initial consultation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Custom project proposal</span>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="bg-muted p-8 rounded-2xl">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Send a Message
              </h2>
              <ContactForm />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
