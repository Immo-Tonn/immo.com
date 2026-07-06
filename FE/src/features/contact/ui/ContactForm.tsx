import { useForm } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import Input from '@shared/ui/Input/Input';
import { ContactData, sendContactForm } from '../model/model';
import { useEffect, useRef, useState } from 'react';
import styles from './ContactForm.module.css';
import { useNavigate } from 'react-router-dom';
import Button from '@shared/ui/Button/Button';
import { fadeInOnScroll } from '@shared/anim/animations';
import { useTranslation } from 'react-i18next';

const ContactForm = () => {
  const { t, i18n } = useTranslation();
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach((ref, i) => {
      if (ref)
        fadeInOnScroll(
          { current: ref },
          i % 2 === 0 ? { x: -100 } : { x: -100 },
        );
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactData>();

  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: ContactData) => {
    if (!captchaToken) {
      setCaptchaError(t('contactForm.captchaRequired'));
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await sendContactForm({
        name: `${data.name} ${data.surname}`.trim(),
        email: data.email,
        phone: data.phone,
        message: data.message,
        recaptchaToken: captchaToken,
      });

      reset();
      setCaptchaToken(null);
      navigate('/kontakt/danke');
    } catch (err: any) {
      console.error('Fehler beim Absenden:', err);
      setSubmitError(err.message || t('contactForm.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={styles.formWrapper}
      ref={el => {
        refs.current[1] = el;
      }}
    >
      <div className={styles.container}>
        <h2 className={styles.heading}>{t('contactForm.heading')}</h2>

        <div className={styles.layout}>
          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <Input
                  placeholder={t('contactForm.firstNamePlaceholder')}
                  autoComplete="given-name"
                  {...register('name', {
                    required: t('contactForm.firstNameRequired'),
                  })}
                />
                {errors.name && (
                  <span className={styles.error}>{errors.name.message}</span>
                )}
              </div>
              <div className={styles.inputGroup}>
                <Input
                  placeholder={t('contactForm.lastNamePlaceholder')}
                  autoComplete="family-name"
                  {...register('surname', {
                    required: t('contactForm.lastNameRequired'),
                  })}
                />
                {errors.surname && (
                  <span className={styles.error}>
                    {errors.surname.message}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <Input
                placeholder={t('contactForm.emailPlaceholder')}
                autoComplete="email"
                {...register('email', {
                  required: t('contactForm.emailRequired'),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t('contactForm.emailInvalid'),
                  },
                })}
              />
              {errors.email && (
                <span className={styles.error}>{errors.email.message}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <Input
                placeholder={t('contactForm.phonePlaceholder')}
                autoComplete="tel"
                {...register('phone', {
                  required: t('contactForm.phoneRequired'),
                  pattern: {
                    value: /^[0-9+]{10,15}$/,
                    message: t('contactForm.phoneInvalid'),
                  },
                })}
              />
              {errors.phone && (
                <span className={styles.error}>{errors.phone.message}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <Input
                isTextarea
                placeholder={t('contactForm.messagePlaceholder')}
                {...register('message', {
                  required: t('contactForm.messageRequired'),
                  minLength: {
                    value: 5,
                    message: t('contactForm.messageTooShort'),
                  },
                })}
              />
              {errors.message?.message && (
                <span className={styles.error}>{errors.message.message}</span>
              )}
            </div>

            <div className={styles.checkboxContainer}>
              <Input
                id="consent"
                type="checkbox"
                {...register('consent', {
                  required: t('contactForm.consentRequired'),
                })}
              />
              <label htmlFor="consent">{t('contactForm.consentLabel')}</label>
            </div>
            {errors.consent && (
              <span className={styles.error}>{errors.consent.message}</span>
            )}

            <div className={styles.captchaContainer}>
              {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
                <ReCAPTCHA
                  hl={i18n.language?.split('-')[0] ?? 'de'}
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  size="normal"
                  onChange={token => {
                    setCaptchaToken(token);
                    setCaptchaError(null);
                  }}
                  onExpired={() => {
                    setCaptchaToken(null);
                    setCaptchaError(t('contactForm.captchaExpired'));
                  }}
                />
              ) : (
                <p className={styles.error}>
                  {t('contactForm.captchaNotConfigured')}
                </p>
              )}
              {captchaError && <p className={styles.error}>{captchaError}</p>}
            </div>
            {submitError && <p className={styles.error}>{submitError}</p>}

            <Button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
              initialText={t('contactForm.submitButton')}
              clickedText={t('contactForm.submitting')}
            />
          </form>

          <div className={styles.divider} />

          <div className={styles.sideInfo}>
            <h3 className={styles.sideHeading}>{t('contactForm.sideHeading')}</h3>
            <div className={styles.contactBlock}>
              <strong>Immo Tonn</strong>
              <span>Sessendrupweg 54</span>
              <span>48161 Münster</span>
              <span>
                E-Mail:{' '}
                <a href="mailto:tonn_andreas@web.de">tonn_andreas@web.de</a>
              </span>
              <span>
                {t('contactForm.phoneLabel')}:{' '}
                <a href="tel:+491743454419">+49 174 345 44 19</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
