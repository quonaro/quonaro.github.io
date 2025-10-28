import { Mail, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

const ContactSection = () => {
  const { t } = useTranslation();
  
  return (
    <section id="contact" className="py-20 bg-gradient-surface">
      <div className="container max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="bg-surface/80 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-subtle">
          {/* Contact options */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('contact.email')}</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {t('contact.emailDescription')}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open('mailto:quonaro@mail.ru', '_blank')}
                    className="gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    {t('contact.sendEmail')}
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('contact.telegram')}</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {t('contact.telegramDescription')}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open('https://t.me/quonaro', '_blank')}
                    className="gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t('contact.messageTelegram')}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="p-6 bg-gradient-primary/10 rounded-xl border border-primary/20">
                <h3 className="font-semibold mb-3 text-primary">{t('contact.freelance')}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {t('contact.services', { returnObjects: true }).map((service: string, index: number) => (
                    <li key={index}>• {service}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Location & availability */}
          <div className="border-t border-subtle pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{t('contact.location')}</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <span className="inline-block w-2 h-2 bg-terminal rounded-full mr-2"></span>
                {t('contact.availability')}
              </div>
            </div>
          </div>

          {/* Terminal-style footer */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-background/50 backdrop-blur-sm border border-subtle rounded-lg p-4 font-mono text-sm text-muted-foreground">
              <span className="text-terminal">{t('contact.terminal')}</span>
              <br />
              <span className="text-foreground">{t('contact.terminalMessage')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;