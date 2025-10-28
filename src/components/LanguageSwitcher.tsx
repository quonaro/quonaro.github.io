import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
    // Перезагружаем страницу после смены языка
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 text-sm"
    >
      <Globe className="w-4 h-4" />
      {i18n.language === 'ru' ? 'EN' : 'RU'}
    </Button>
  );
};

export default LanguageSwitcher;
