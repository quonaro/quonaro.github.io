import { Mail, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

const ContactSection = () => {
  const { t } = useTranslation();
  
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 bg-gradient-surface">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg px-2 sm:px-0">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="bg-surface/80 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-2xl border border-subtle">
          {/* Contact options */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold mb-1">{t('contact.email')}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">
                    {t('contact.emailDescription')}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open('mailto:quonaro@mail.ru', '_blank')}
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">{t('contact.sendEmail')}</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-secondary/10 rounded-lg text-secondary flex-shrink-0">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold mb-1">{t('contact.telegram')}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">
                    {t('contact.telegramDescription')}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open('https://t.me/quonaro', '_blank')}
                    className="gap-2 w-full sm:w-auto"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">{t('contact.messageTelegram')}</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="p-4 sm:p-6 bg-gradient-primary/10 rounded-xl border border-primary/20">
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-primary">{t('contact.freelance')}</h3>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  {t('contact.services', { returnObjects: true }).map((service: string, index: number) => (
                    <li key={index}>• {service}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Location & availability */}
          <div className="border-t border-subtle pt-6 sm:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">{t('contact.location')}</span>
              </div>
              
              <div className="text-xs sm:text-sm text-muted-foreground">
                <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-terminal rounded-full mr-2"></span>
                {t('contact.availability')}
              </div>
            </div>
          </div>

          {/* Terminal-style footer */}
          <div className="mt-6 sm:mt-8 text-center px-2 sm:px-0">
            <div className="inline-block bg-background/50 backdrop-blur-sm border border-subtle rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm text-muted-foreground max-w-full overflow-x-auto">
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