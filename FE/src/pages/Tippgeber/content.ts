// Тексты страницы Tippgeber-Programm. Оригинал — немецкий (этот файл, юридический текст
// программы); переводы — content.en.ts и content.ru.ts (при расхождениях действует немецкая версия).

export const EMAIL = 'tonn_andreas@web.de';
export const PHONE_DISPLAY = '0251 625 60 763';
export const PHONE_HREF = 'tel:+4925162560763';
// мобильный номер (как в подвале сайта) — для кнопки «Anrufen» в hero и нижнего блока
export const MOBILE_DISPLAY = '0174 345 44 19';
export const MOBILE_HREF = 'tel:+491743454419';
const MAIL_BODY = [
  'Ihre Daten (Name, Telefon, E-Mail):',
  'Eigentümer (Name, Telefon oder E-Mail):',
  'Ort und Art der Immobilie:',
  'Gewünschter Kontaktweg des Eigentümers:',
  'Einwilligung des Eigentümers zur Datenweitergabe und Kontaktaufnahme (wann und wie erteilt):',
].join('\r\n');
export const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(
  'Empfehlung Tippgeber-Programm',
)}&body=${encodeURIComponent(MAIL_BODY)}`;

export const hero = {
  eyebrow: 'Tippgeber-Programm · Münster & Umgebung',
  line1: 'Ihr Tipp.',
  line2: 'Bis zu 4.000 €.',
  intro:
    'Kennen Sie jemanden, der ein Haus, eine Wohnung oder ein Grundstück in Münster und Umgebung verkaufen möchte? Stellen Sie den Kontakt zu IMMO TONN her. Führt Ihre Empfehlung zu einem erfolgreichen Verkauf über uns, bedanken wir uns mit einer Vergütung.',
  facts: [
    '1 % des beurkundeten Kaufpreises',
    'regulär 1.000–4.000 €',
    'ab 100.000 € Kaufpreis',
  ],
  note: 'Auszahlung nach erfolgreichem Verkauf und Eingang unserer Maklerprovision. Bei gekürzter Provision kann die Vergütung geringer ausfallen.',
  ctaMail: 'Empfehlung per E-Mail senden',
  ctaCall: 'Anrufen',
  conditionsLink: 'Teilnahmebedingungen ansehen',
};

export const steps = {
  title: 'So funktioniert Ihre Empfehlung',
  items: [
    {
      title: 'Eigentümer ansprechen',
      text: 'Sprechen Sie mit dem Eigentümer über IMMO TONN. Klären Sie vorab, ob er mit der Weitergabe seiner Kontaktdaten und einer Kontaktaufnahme durch uns einverstanden ist.',
    },
    {
      title: 'Kontakt herstellen',
      text: 'Senden Sie uns Ihre Empfehlung per E-Mail oder melden Sie sich telefonisch. Wir bestätigen den Eingang in Textform und prüfen, ob die Empfehlung die Teilnahmebedingungen erfüllt.',
    },
    {
      title: 'Wir begleiten den Verkauf',
      text: 'Entscheidet sich der Eigentümer für eine Zusammenarbeit mit uns, übernehmen wir Bewertung, Vermarktung und die Begleitung des Verkaufs.',
    },
    {
      title: 'Vergütung erhalten',
      text: 'Nach dem notariell beurkundeten Verkauf und dem Eingang unserer Maklerprovision zahlen wir Ihre Vergütung innerhalb von 14 Tagen aus.',
    },
  ],
};

export const benefits = {
  title: 'Was Ihr Bekannter davon hat',
  items: [
    'Kostenlose, unverbindliche Wertermittlung seiner Immobilie',
    'Persönliche Betreuung durch Andreas Tonn, Maklererfahrung seit 1985',
    'Eine Maklerprovision fällt nur bei erfolgreichem Verkauf an',
  ],
};

export const reward = {
  title: 'So berechnet sich Ihre Vergütung',
  big: '1 %',
  bigLabel: 'des beurkundeten Kaufpreises',
  range: '1.000–4.000 €',
  rangeLabel: 'reguläre Vergütung, ab 100.000 € Kaufpreis',
  intro:
    'Für eine erfolgreiche Empfehlung erhalten Sie regulär 1 % des beurkundeten Kaufpreises, mindestens 1.000 € und höchstens 4.000 €. Das Programm gilt für Immobilien mit einem beurkundeten Kaufpreis ab 100.000 €. Bei gekürzter Maklerprovision reduziert sich die Vergütung anteilig.',
  examplesTitle: 'Beispiele bei vollständigem Eingang der vereinbarten Maklerprovision',
  examples: [
    { price: '100.000 €', reward: '1.000 €' },
    { price: '250.000 €', reward: '2.500 €' },
    { price: '400.000 €', reward: '4.000 €' },
  ],
  priceLabel: 'Kaufpreis',
  rewardLabel: 'Vergütung',
  cap: 'Bei höheren Kaufpreisen bleibt die reguläre Vergütung auf 4.000 € begrenzt.',
  reduced:
    'Wird unsere vereinbarte Maklerprovision gekürzt oder nur teilweise gezahlt, reduziert sich die Vergütung entsprechend. Dabei kann sie auch unter 1.000 € liegen. Die Einzelheiten finden Sie in den Teilnahmebedingungen.',
};

export const submit = {
  title: 'Empfehlung übermitteln',
  intro: 'Schreiben Sie uns an {email} oder rufen Sie uns unter {phone} an.',
  listTitle: 'Bitte teilen Sie uns Folgendes mit:',
  list: [
    'Ihren Namen und Ihre Kontaktdaten',
    'Ort und Art der Immobilie, möglichst mit Adresse',
    'Name und Kontaktdaten des Eigentümers, sofern dessen Einwilligung vorliegt',
    'auf welchem Weg der Eigentümer eine Kontaktaufnahme wünscht',
    'wann und wie der Eigentümer der Datenweitergabe und Kontaktaufnahme zugestimmt hat',
  ],
  consent:
    'Am einfachsten bestätigt der Eigentümer seinen Kontaktwunsch selbst per E-Mail an uns und nennt dabei Ihren Namen. Melden Sie Ihre Empfehlung bitte vorher bei uns an.',
  privacyTitle: 'Datenschutzhinweise',
  privacy:
    'Übermitteln Sie personenbezogene Daten des Eigentümers nur mit dessen vorheriger Einwilligung. Vor einer Kontaktaufnahme benötigen wir einen nachvollziehbaren Nachweis des Kontaktwunsches und des gewünschten Kontaktwegs. Über die Datenverarbeitung informieren wir den Eigentümer bei der ersten Kontaktaufnahme.',
  privacyLink: 'Zur Datenschutzerklärung',
};

export const faq = {
  title: 'Häufige Fragen',
  items: [
    {
      q: 'Muss mein Bekannter verkaufen?',
      a: 'Nein. Ihre Empfehlung ist unverbindlich. Ob und wann der Eigentümer verkauft, entscheidet er allein.',
    },
    {
      q: 'Was kostet mich die Teilnahme?',
      a: 'Nichts. Die Teilnahme am Programm ist für Sie kostenlos.',
    },
    {
      q: 'Gilt das Programm auch für Vermietungen?',
      a: 'Nein. Das Programm gilt nur für den Verkauf von Immobilien.',
    },
    {
      q: 'Was passiert, wenn der Eigentümer uns schon kennt?',
      a: 'Dann kann die Empfehlung nicht berücksichtigt werden. Maßgeblich ist, dass uns die Verkaufsabsicht zum Zeitpunkt Ihrer Empfehlung noch nicht bekannt war.',
    },
  ],
};

export const conditions = {
  title: 'Teilnahmebedingungen',
  provider:
    'Anbieter des Programms: Immo-Tonn, Inhaber Andreas Tonn, Sessendrupweg 54, 48161 Münster.',
  imprintLink: 'Impressum',
  sections: [
    {
      title: 'Voraussetzungen für die Vergütung',
      paragraphs: [
        'Ein Anspruch auf Vergütung besteht, wenn eine nach diesen Bedingungen berücksichtigungsfähige Empfehlung vorliegt, der Eigentümer IMMO TONN mit dem Verkauf der empfohlenen Immobilie beauftragt, der Verkauf aufgrund dieses Auftrags notariell beurkundet wird und unsere Maklerprovision eingegangen ist.',
        'Die Empfehlung muss für das Zustandekommen des Maklerauftrags ursächlich gewesen sein. Kommt der Verkauf nicht zustande oder entsteht kein Provisionsanspruch, wird keine Vergütung gezahlt.',
      ],
    },
    {
      title: 'Welche Empfehlungen berücksichtigt werden',
      paragraphs: [
        'Die konkrete Verkaufsabsicht für die empfohlene Immobilie darf uns zum Zeitpunkt der Empfehlung noch nicht bekannt sein. Es darf bereits kein entsprechender Verkaufsauftrag bei uns bestehen.',
        'Ihre Empfehlung muss uns per E-Mail oder telefonisch erreichen, bevor der Eigentümer selbst wegen dieses Verkaufs Kontakt mit uns aufnimmt. Wir bestätigen den Eingang Ihrer Empfehlung per E-Mail. Die Eingangsbestätigung dokumentiert den Eingang. Ein Vergütungsanspruch entsteht erst, wenn sämtliche Voraussetzungen erfüllt sind.',
      ],
    },
    {
      title: 'Mehrere Empfehlungen derselben Immobilie',
      paragraphs: [
        'Gehen mehrere Empfehlungen für dieselbe Immobilie ein, berücksichtigen wir die zuerst vollständig eingegangene, berücksichtigungsfähige Empfehlung. Pro verkauftem Objekt wird die Vergütung einmal gezahlt.',
      ],
    },
    {
      title: 'Berechnung der Vergütung',
      paragraphs: [
        'Wird die mit uns vereinbarte Maklerprovision gekürzt oder nur teilweise gezahlt, wird die reguläre Vergütung im gleichen Verhältnis reduziert. Gehen beispielsweise 50 % der vereinbarten Maklerprovision ein, werden 50 % der regulären Tippgebervergütung ausgezahlt. Die Auszahlung kann dadurch unter 1.000 € liegen.',
        'Bei nachträglichem Eingang weiterer Provisionszahlungen erfolgt eine entsprechende Nachzahlung bis zur Höhe der regulären Vergütung.',
      ],
    },
    {
      title: 'Umfang Ihrer Tätigkeit',
      paragraphs: [
        'Ihre Tätigkeit beschränkt sich auf die Herstellung des Kontakts zwischen dem Eigentümer und IMMO TONN. Sie übernehmen keine Vermittlung, führen keine Besichtigungen oder Verhandlungen durch und geben keine Zusagen oder Erklärungen im Namen von IMMO TONN ab.',
      ],
    },
    {
      title: 'Auszahlung und steuerliche Behandlung',
      paragraphs: [
        'Die Auszahlung erfolgt innerhalb von 14 Tagen nach Eingang unserer Maklerprovision, sofern uns die für die Auszahlung erforderlichen Angaben und gegebenenfalls erforderlichen Abrechnungsunterlagen vorliegen.',
        'Die Vergütung kann steuerpflichtig sein. Die steuerliche Einordnung klären Sie bitte mit Ihrer Steuerberatung. Gewerbliche Tippgeber stellen uns eine ordnungsgemäße Rechnung.',
      ],
    },
    {
      title: 'Teilnahmeberechtigung',
      paragraphs: [
        'Ausgeschlossen sind Mitarbeiter von IMMO TONN, die Eigentümer der empfohlenen Immobilie selbst sowie Personen, deren berufliche oder gesetzliche Pflichten der Annahme einer solchen Vergütung entgegenstehen. Dies gilt insbesondere für Notare im Zusammenhang mit ihrer Amtstätigkeit.',
      ],
    },
    {
      title: 'Datenschutz und Einwilligung',
      paragraphs: [
        'Personenbezogene Daten eines Eigentümers dürfen nur mit dessen vorheriger, nachvollziehbar dokumentierter Einwilligung an IMMO TONN übermittelt werden. Die Einwilligung muss die Kontaktaufnahme über den angegebenen Kontaktweg umfassen und kann für die Zukunft widerrufen werden.',
      ],
    },
    {
      title: 'Laufzeit des Programms',
      paragraphs: [
        'Die Teilnahme ist freiwillig. IMMO TONN kann das Programm für zukünftige Empfehlungen ändern oder beenden. Für bereits eingereichte Empfehlungen gelten die zum Zeitpunkt ihres Eingangs veröffentlichten Bedingungen.',
      ],
    },
  ],
};

export const finalBlock = {
  title: 'Sie kennen jemanden mit Verkaufsplänen?',
  text: 'Stellen Sie den Kontakt zu IMMO TONN her.',
};

export type PageContent = {
  hero: typeof hero;
  steps: typeof steps;
  benefits: typeof benefits;
  reward: typeof reward;
  submit: typeof submit;
  faq: typeof faq;
  conditions: typeof conditions;
  finalBlock: typeof finalBlock;
  /** Строка о приоритете немецкой версии (только в переводах) */
  discrepancy?: string;
};

export const contentDe: PageContent = {
  hero,
  steps,
  benefits,
  reward,
  submit,
  faq,
  conditions,
  finalBlock,
};
