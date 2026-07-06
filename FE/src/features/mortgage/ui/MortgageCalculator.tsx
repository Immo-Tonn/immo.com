import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CountUp from 'react-countup';
import jsPDF from 'jspdf';
import styles from './MortgageCalculator.module.css';
import QuestionIcon from '@shared/assets/morgage-calculator/question.svg';
import MarkerIcon from '@shared/assets/morgage-calculator/marker.svg';
import Input from '@shared/ui/Input/Input';
import Button from '@shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';

const formatGermanCurrency = (num: number) => {
  return num
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Преобразует строку "375.000,00" в число 375000.00
const parseGermanCurrency = (str: string): number => {
  if (!str) return 0;
  const normalized = str.replace(/\./g, '').replace(',', '.');
  const result = parseFloat(normalized);
  return isNaN(result) ? 0 : result;
};

type Mode = 'calculateYears' | 'calculateRepayment';
type InfoKey = 'tax' | 'notary' | 'broker';

const MortgageCalculator = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [price, setPrice] = useState('');
  //const [showError, setShowError] = useState(false);
  const [equity, setEquity] = useState('');
  const [loanAmount, setLoanAmount] = useState<number | null>(null);
  const [tax, setTax] = useState('6,5');
  const [notary, setNotary] = useState('1,5');
  const [broker, setBroker] = useState('0,0357');
  const [repayment, setRepayment] = useState('2,0');
  const [interest, setInterest] = useState('3,5');
  const [years, setYears] = useState('30');
  const [monthly, setMonthly] = useState<number | null>(null);
  const [modalContent, setModalContent] = useState<InfoKey | null>(null);
  const [mode, setMode] = useState<Mode>('calculateYears');
  const [customTax, setCustomTax] = useState('');
  const [customNotary, setCustomNotary] = useState('');
  const [customBroker, setCustomBroker] = useState('');
  const [validationError, setValidationError] = useState('');
  const [dynamicRepaymentOptions, setDynamicRepaymentOptions] = useState<
    string[]
  >([]);
  const [dynamicLaufzeitOptions, setDynamicLaufzeitOptions] = useState<
    string[]
  >([]);
  const [equityTooHighError, setEquityTooHighError] = useState(false);
  const [equityDecimalError, setEquityDecimalError] = useState(false);
  const [interestDecimalError, setInterestDecimalError] = useState(false);
  const [interestRangeError, setInterestRangeError] = useState(false);
const [priceTooLowError, setPriceTooLowError] = useState(false);
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Разрешаем только цифры при вводе
    const digits = e.target.value.replace(/[^\d]/g, '');
    
    // Ограничиваем длину
    if (digits.length <= 11) {
      setPrice(digits);
        // Проверка: Immobilienpreis должен быть > Eigenkapital
    const priceNum = parseFloat(digits);
    const equityNum = parseFloat(equity.replace(',', '.')) || 0;

    if (priceNum > 0 && equityNum > 0 && priceNum <= equityNum) {
      setPriceTooLowError(true);
    } else {
      setPriceTooLowError(false);
    }
    }
  };

  const handlePriceBlur = () => {
    // Форматируем только при потере фокуса
    if (price && price !== '') {
      const numericValue = parseInt(price, 10);
      if (!isNaN(numericValue)) {
        setPrice(formatGermanCurrency(numericValue));
      }
    }
  };

  const handlePriceFocus = () => {
    // При получении фокуса преобразуем отформатированное число обратно в цифры
    if (price) {
      // Если строка содержит форматирование (точки и запятую), парсим её
      if (price.includes('.') || price.includes(',')) {
        const numericValue = parseGermanCurrency(price);
        setPrice(numericValue.toString());
      }
      // Если уже содержит только цифры, оставляем как есть
    }
  };

  const isValidPercent = (val: string) => /^([0-9]|10)([.,]\d{1,2})?$/.test(val);

  const customTaxError =
    tax === 'custom' && customTax !== '' && !isValidPercent(customTax);
  const customNotaryError =
    notary === 'custom' && customNotary !== '' && !isValidPercent(customNotary);
  const customBrokerError =
    broker === 'custom' && customBroker !== '' && !isValidPercent(customBroker);

  const parseValue = (val: string, fallback: string) =>
    parseFloat((val === 'custom' ? fallback : val).replace(',', '.')) || 0;

  const parsedPrice = parseGermanCurrency(price);
  const parsedEquity = parseGermanCurrency(equity);
  const parsedInterest = parseFloat(interest) || 0;
  const parsedRepayment = parseFloat(repayment) || 0;
  const parsedYears = parseInt(years) || 0;

  const parsedTax = parseValue(tax, customTax);
  const parsedNotary = parseValue(notary, customNotary);
  const parsedBroker = parseValue(broker, customBroker);

  const notaryCost = (parsedPrice * parsedNotary) / 100;
  const brokerCost = (parsedPrice * parsedBroker) / 100;
  const taxCost = (parsedPrice * parsedTax) / 100;

  const totalAdditionalCosts = notaryCost + brokerCost + taxCost;
  const totalCost = parsedPrice + totalAdditionalCosts;
  const darlehen = totalCost - parsedEquity;

  const fixedRepaymentOptions = Array.from({ length: 91 }, (_, i) =>
    (1.0 + i * 0.1).toFixed(1).replace('.', ','),
  );
  const fixedLaufzeitOptions = Array.from({ length: 40 }, (_, i) =>
    (i + 1).toString(),
  );

  const repaymentOptions = Array.from(
    new Set([...fixedRepaymentOptions, ...dynamicRepaymentOptions]),
  ).sort((a, b) => parseFloat(a) - parseFloat(b));
  const laufzeitOptions = Array.from(
    new Set([...fixedLaufzeitOptions, ...dynamicLaufzeitOptions]),
  ).sort((a, b) => parseInt(a) - parseInt(b));

  const formatCurrencyDE = (num: number | null) => {
    if (num === null || num === undefined || isNaN(num)) return '';
    return num.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleEquityChange = (val: string) => {
    // Разрешаем только цифры при вводе
    const digits = val.replace(/[^\d]/g, '');
    
    // Ограничиваем длину (можно установить разумный лимит)
    if (digits.length <= 11) {
      setEquity(digits);
    }
  };

  const handleEquityBlur = () => {
    // Форматируем только при потере фокуса
    if (equity && equity !== '') {
      const numericValue = parseInt(equity, 10);
      if (!isNaN(numericValue)) {
        const formattedValue = formatGermanCurrency(numericValue);
        setEquity(formattedValue);
        
        // Проверяем на превышение общей стоимости
        if (numericValue >= totalCost) {
          setEquityTooHighError(true);
        } else {
          setEquityTooHighError(false);
        }
      }
    }
    setEquityDecimalError(false);
  };

  const handleEquityFocus = () => {
    // При получении фокуса преобразуем отформатированное число обратно в цифры
    if (equity) {
      // Если строка содержит форматирование (точки и запятую), парсим её
      if (equity.includes('.') || equity.includes(',')) {
        const numericValue = parseGermanCurrency(equity);
        setEquity(numericValue.toString());
      }
      // Если уже содержит только цифры, оставляем как есть
    }
    setEquityTooHighError(false);
    setEquityDecimalError(false);
  };

  const handleInterestChange = (value: string) => {
    // Заменить точки на запятые
    let val = value.replace(/\./g, ',');

    // Удалить все символы кроме цифр и запятой
    val = val.replace(/[^\d,]/g, '');

    const parts = val.split(',');

    // Только одна запятая и одна цифра после неё
    if (parts.length >= 2 && parts[1]) {
      val = parts[0] + ',' + parts[1].slice(0, 1);
    }

    // Проверка: значение ≤ 14
    const numericValue = parseFloat(val.replace(',', '.'));
    if (!isNaN(numericValue) && numericValue > 14) {
      return; // Не обновляем состояние
    }

    setInterest(val); // Пока пользователь вводит — без %
  };

  useEffect(() => {
    if (location.state && location.state.price) {
      const rawPrice =
        typeof location.state.price === 'number'
          ? location.state.price
          : parseGermanCurrency(String(location.state.price));
      setPrice(formatGermanCurrency(rawPrice));
    }
  }, [location.state]);

  useEffect(() => {
    if (!darlehen || parsedInterest === 0) return;
    const r = parsedInterest / 100;
    if (mode === 'calculateYears' && parsedRepayment > 0) {
      const annuitaet = darlehen * (r + parsedRepayment / 100);
      const n =
        Math.log(annuitaet / (annuitaet - darlehen * r)) / Math.log(1 + r);
      if (isFinite(n)) {
        const nRounded = Math.round(n).toString();
        if (!laufzeitOptions.includes(nRounded)) {
          setDynamicLaufzeitOptions(prev => [...prev, nRounded]);
        }
        setYears(nRounded);
      }
    }
    if (mode === 'calculateRepayment' && parsedYears > 0) {
      const n = parsedYears;
      const annuitaet =
        darlehen * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      const zinsenJahr1 = darlehen * r;
      const tilgungJahr1 = annuitaet - zinsenJahr1;
      const tilgungProzent = (tilgungJahr1 / darlehen) * 100;
      const fixed = Number(tilgungProzent.toFixed(2));
      if (isFinite(fixed)) {
        const fixedStr = fixed.toFixed(1);
        if (!repaymentOptions.includes(fixedStr)) {
          setDynamicRepaymentOptions(prev => [...prev, fixedStr]);
        }
        setRepayment(fixedStr);
      }
    }
  }, [repayment, years, interest, totalCost, equity, mode, darlehen, parsedInterest, parsedRepayment, parsedYears, laufzeitOptions, repaymentOptions]);

  useEffect(() => {
    if (!isNaN(darlehen) && darlehen > 0) {
      setLoanAmount(darlehen);
    } else {
      setLoanAmount(null);
    }
  }, [
    price,
    equity,
    tax,
    notary,
    broker,
    customTax,
    customNotary,
    customBroker,
  ]);

  useEffect(() => {
    setMonthly(null);
  }, [
    price,
    equity,
    tax,
    notary,
    broker,
    customTax,
    customNotary,
    customBroker,
    repayment,
    years,
    interest,
  ]);
useEffect(() => {
  const priceStr = price.replace(/\./g, '').replace(',', '.');  // удаляем точку, если была
  const equityStr = equity.replace(/\./g, '').replace(',', '.');
  const priceNum = parseFloat(priceStr) || 0;
  const equityNum = parseFloat(equityStr) || 0;

if (
  price !== '' &&
  equity !== '' &&
  priceNum > 0 &&
  equityNum > 0 &&
  priceNum <= equityNum
) {
  setPriceTooLowError(true);
} else {
  setPriceTooLowError(false);
}

}, [price, equity]);
  const handleCalc = () => {
    setInterestDecimalError(false);
    setInterestRangeError(false);
    setValidationError('');
    setMonthly(null);
    if (equityTooHighError) {
      setValidationError(
        'Eigenkapital darf den Gesamtpreis nicht überschreiten.',
      );
      return;          
    }
if (priceTooLowError) {
  setValidationError('Der Immobilienpreis muss größer als das Eigenkapital sein.');
  return;
}
    if (!equity || equity.trim() === '') {
      setValidationError('Bitte geben Sie Ihr Eigenkapital ein.');
      return;
    }
    if (
      (tax === 'custom' && (!customTax || customTaxError)) ||
      (notary === 'custom' && (!customNotary || customNotaryError)) ||
      (broker === 'custom' && (!customBroker || customBrokerError))
    ) {
      setValidationError(
        'Bitte korrigieren Sie die Eingabefehler in den benutzerdefinierten Feldern.',
      );
      return;
    }
    const validRepayment = parsedRepayment > 0;
    const validYears = parsedYears > 0;
    const validInterest = parsedInterest > 0;
    if (!(validRepayment && validYears && validInterest)) {
      return;
    }
    const r = parsedInterest / 100 / 12;
    const n = parsedYears * 12;
    const monthlyPayment =
      (darlehen * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthly(monthlyPayment);
    setLoanAmount(Number(darlehen.toFixed(2)));
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(32);
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('IMMO  TONN', 22, 36);
    doc.setFontSize(10);
    doc.text('EST. 1985', 22, 41);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(t('mortgageCalculator.pdf.title'), 105, 55, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${t('mortgageCalculator.pdf.createdOn')}: ${new Date().toLocaleDateString('de-DE')}`,
      170,
      60,
      {
        align: 'right',
      },
    );

    const formatCurrency = (value: number | string) =>
      Number(value).toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
      });

    doc.setFontSize(13);
    let y = 70;
    const rowGap = 10;

    doc.text(`${t('mortgageCalculator.pdf.price')}:`, 25, y);
    doc.text(formatCurrency(parseGermanCurrency(price)), 110, y);
    y += rowGap;

    doc.text(`${t('mortgageCalculator.pdf.equity')}:`, 25, y);
  doc.text(formatCurrency(parseGermanCurrency(equity)), 110, y);
    y += rowGap;

    doc.text(`${t('mortgageCalculator.taxLabel')}:`, 25, y);
    doc.text(`${tax === 'custom' ? customTax : tax}%`, 110, y);
    y += rowGap;

    doc.text(`${t('mortgageCalculator.notaryLabel')}:`, 25, y);
    doc.text(`${notary === 'custom' ? customNotary : notary}%`, 110, y);
    y += rowGap;

    doc.text(`${t('mortgageCalculator.pdf.brokerCommission')}:`, 25, y);
    const brokerRaw = broker === 'custom' ? customBroker : broker;
const parsedBroker = parseFloat(brokerRaw.replace(',', '.')); // превращаем строку в число

if (!isNaN(parsedBroker)) {
  const brokerPercent = (parsedBroker * 100).toFixed(2).replace('.', ',');
  doc.text(`${brokerPercent}%`, 110, y);
} else {
  doc.text('–', 110, y); // если ошибка, выводим прочерк
}
    y += rowGap;

    doc.text(`${t('mortgageCalculator.pdf.loanAmount')}:`, 25, y);
    doc.text(formatCurrency(loanAmount ?? 0), 110, y);
    y += rowGap;

    doc.text(`${t('mortgageCalculator.pdf.interestRate')}:`, 25, y);
    doc.text(`${interest}%`, 110, y);
    y += rowGap;

    doc.text(`${t('mortgageCalculator.repaymentLabel')}:`, 25, y);
    doc.text(`${repayment}%`, 110, y);
    y += rowGap;

    doc.text(`${t('mortgageCalculator.pdf.term')}:`, 25, y);
    doc.text(`${years} ${t('mortgageCalculator.pdf.years')}`, 110, y);
    y += rowGap + 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 68, 106);
    doc.text(`${t('mortgageCalculator.monthlyRate')}:`, 25, y);
    doc.text(formatCurrency(monthly ?? 0), 110, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 240, 190, 240);

    let contactY = 250;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(t('mortgageCalculator.pdf.contact'), 105, contactY, { align: 'center' });
    contactY += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('0174 345 44 19', 105, contactY, { align: 'center' });
    contactY += 7;
    doc.text('tonn_andreas@web.de', 105, contactY, { align: 'center' });
    contactY += 7;
    doc.text('Sessendrupweg 54', 105, contactY, { align: 'center' });
    contactY += 6;
    doc.text('48161 Münster', 105, contactY, { align: 'center' });
    contactY += 8;

    doc.setFontSize(10);
    doc.setTextColor(15, 68, 106);
    doc.text('www.immotonn.de', 105, contactY, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    doc.save('Finanzierung.pdf');
  };

  const taxOptions = ['3,5', '5,0', '5,5', '6,0', '6,5'];
  const notaryOptions = Array.from({ length: 11 }, (_, i) =>
    (1.0 + i * 0.1).toFixed(1).replace('.', ','),
  );
  const brokerOptions = Array.from({ length: 7 }, (_, i) =>
    (1.0 + i * 0.5).toFixed(1).replace('.', ','),
  );
// Добавим 3,57, если его ещё нет
if (!brokerOptions.includes('3,57')) {
  brokerOptions.unshift('3,57'); // вставим в начало (по умолчанию)
}
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{t('mortgageCalculator.pageTitle')}</h2>
      <div className={styles.grid}>
        <div className={styles.col}>
          <label htmlFor="price">{t('mortgageCalculator.priceLabel')}</label>
          <div className={styles.inputWithIcon}>
            <input
              id="price"
              name="price"
              value={price}
              onChange={handlePriceChange}
              onBlur={handlePriceBlur}
              onFocus={handlePriceFocus}
            />
            <img src={MarkerIcon} alt="marker" className={styles.markerIcon} />
          </div>
          {priceTooLowError && (
  <p className={styles.error}>
    {t('mortgageCalculator.errorPriceTooLow')}
  </p>
)}
          {renderSelect(
            t,
            t('mortgageCalculator.taxLabel'),
            tax,
            setTax,
            customTax,
            setCustomTax,
            'tax',
            taxOptions,
            undefined,
            customTaxError,
             undefined, // modeToggle
             setModalContent,
          )}
          {renderSelect(
            t,
            t('mortgageCalculator.notaryLabel'),
            notary,
            setNotary,
            customNotary,
            setCustomNotary,
            'notary',
            notaryOptions,
            undefined,
            customNotaryError,
             undefined,
            setModalContent,
          )}
          {renderSelect(
            t,
            t('mortgageCalculator.brokerLabel'),
            broker,
            setBroker,
            customBroker,
            setCustomBroker,
            'broker',
            brokerOptions,
            undefined,
            customBrokerError,
             undefined,
            setModalContent,
          )}
          <p className={styles.sumLine}>
            € {t('mortgageCalculator.totalPrice')}: {formatGermanCurrency(totalCost)}
          </p>
        </div>
        <div className={styles.col}>
          <label htmlFor="equity">{t('mortgageCalculator.equityLabel')}</label>
          <div className={styles.inputWithIcon}>
            <input
              id="equity"
              name="equity"
              value={equity}
              onChange={e => handleEquityChange(e.target.value)}
              onBlur={handleEquityBlur}
              onFocus={handleEquityFocus}
            />
            <img src={MarkerIcon} alt="marker" className={styles.markerIcon} />
          </div>
          {equityTooHighError && (
            <p className={styles.error}>
              {t('mortgageCalculator.errorEquityTooHigh')}
            </p>
          )}
          {equityDecimalError && (
            <p className={styles.error}>
              {t('mortgageCalculator.errorEquityDecimals')}
            </p>
          )}

          <label htmlFor="repayment">{t('mortgageCalculator.repaymentLabel')}</label>
          <select
            id="repayment"
            name="repayment"
            value={repayment}
            onChange={e => {
              setMode('calculateYears');
              setRepayment(e.target.value);
            }}
          >
            {repaymentOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}%
              </option>
            ))}
          </select>
          {/* 222 */}
 <label htmlFor="interest">{t('mortgageCalculator.interestLabel')}</label>
<div className={styles.inputWithIcon}>
  <input
    type="text"
    value={interest}
    onChange={e => handleInterestChange(e.target.value)}
    onBeforeInput={e => {
      if (!e.data) return;

      const input = e.currentTarget;
      const { selectionStart, selectionEnd } = input;

      const inserted = e.data === '.' ? ',' : e.data;

      const proposed =
        selectionStart !== null && selectionEnd !== null
          ? input.value.slice(0, selectionStart) + inserted + input.value.slice(selectionEnd)
          : input.value + inserted;

      const cleaned = proposed.replace('%', '');
      const parts = cleaned.split(',');

      const numericValue = parseFloat(cleaned.replace(',', '.'));

      const tooManyDecimals = parts.length === 2 && parts[1] !== undefined && parts[1].length > 1;
      const tooHighOrLow = !isNaN(numericValue) && (numericValue <= 0 || numericValue > 14);

      setInterestDecimalError(tooManyDecimals);
      setInterestRangeError(tooHighOrLow);

      if (!/^[\d,]*$/.test(inserted)) {
        e.preventDefault();
        return;
      }

      if ((proposed.match(/,/g) || []).length > 1 || tooManyDecimals || tooHighOrLow) {
        e.preventDefault();
        return;
      }
    }}
    inputMode="decimal"
  />
  <img src={MarkerIcon} className={styles.markerIcon} />
</div>

          {interestDecimalError && (
            <p className={styles.error}>
              {t('mortgageCalculator.errorInterestDecimals')}
            </p>
          )}
          {interestRangeError && (
            <p className={styles.error}>
              {t('mortgageCalculator.errorInterestRange')}
            </p>
          )}

          <label htmlFor="years">{t('mortgageCalculator.yearsLabel')}</label>
          <select
            id="years"
            name="years"
            value={years}
            onChange={e => {
              setMode('calculateRepayment');
              setYears(e.target.value);
            }}
          >
            {laufzeitOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.col}>
          <label htmlFor="loanAmount">{t('mortgageCalculator.loanAmountLabel')}</label>
          <input
            id="loanAmount"
            name="loanAmount"
            value={formatCurrencyDE(loanAmount)}
            readOnly
          />
          <div className={styles.rateLabel}>
            {t('mortgageCalculator.monthlyRate')}:{' '}
            {monthly !== null && (
              <span className={styles.monthly}>
                <CountUp
                  end={monthly}
                  decimals={2}
                  prefix="€ "
                  duration={1.5}
                  formattingFn={formatGermanCurrency}
                />
              </span>
            )}
          </div>
          <Button
            initialText={t('mortgageCalculator.calculateButton')}
            clickedText={t('mortgageCalculator.inProgress')}
            onClick={handleCalc}
            className={styles.btn}
          />
          <Button
            onClick={exportPDF}
            className={styles.btn}
            initialText={t('mortgageCalculator.exportPdfButton')}
            clickedText={t('mortgageCalculator.inProgress')}
          />
          {validationError && (
            <p className={styles.error}>
              {t('mortgageCalculator.validationHint')}
            </p>
          )}
        </div>
      </div>
      <p className={styles.hint}>
        <strong>{t('mortgageCalculator.hintTitle')}</strong>
        <br />
        {t('mortgageCalculator.hintBody1')}
        <br />
        {t('mortgageCalculator.hintBody2')} <br />{' '}
        {t('mortgageCalculator.hintBody3')}
        <br />
        {t('mortgageCalculator.hintBody4')}
      </p>
      {/* Модальное окно для иконки QuestionIcon */}
      {modalContent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{t(`mortgageCalculator.info.${modalContent}.title`)}</h3>
            <p>{t(`mortgageCalculator.info.${modalContent}.body`)}</p>
            <button onClick={() => setModalContent(null)}>
              {t('mortgageCalculator.close')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MortgageCalculator;

function renderSelect(
  t: (key: string, opts?: Record<string, unknown>) => string,
  label: string,
  value: string,
  onChange: (value: string) => void,
  customValue: string,
  setCustomValue: (value: string) => void,
  infoKey: InfoKey,
  options: string[],
  modeToggle?: () => void,
  showError?: boolean,
   setShowError?: (show: boolean) => void,
  onInfoClick?: (infoKey: InfoKey) => void,
) {
  const showCustom = value === 'custom';
  return (
    <>
      <label>
        {label}
        <img
          src={QuestionIcon}
          className={styles.icon}
          onClick={() => onInfoClick?.(infoKey)}
          alt={`${label} info`}
        />
      </label>
      <div className={styles.selectWrapper}>
        <select
          value={value}
          onChange={e => {
            const selected = e.target.value;
            if (
              infoKey === 'tax' ||
              infoKey === 'notary' ||
              infoKey === 'broker'
            ) {
              onChange(selected);
            } else {
              modeToggle?.();
              onChange(selected);
            }
          }}
          className={styles.select}
        >
          {options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}%
            </option>
          ))}
          <option value="custom">{t('mortgageCalculator.customValue')}</option>
        </select>

        {showCustom && (
          <div className={styles.inputWithPercent}>
          <Input
  id={`${infoKey}-custom`}
  name={`${infoKey}-custom`}
  value={customValue}
  onChange={e => {
    let val = e.target.value;

    // Заменяем все точки на запятые
    val = val.replace(/\./g, ',');

    // Проверка: максимум 2 цифры перед запятой и максимум 2 после
    const regex = /^\d{0,2}(,\d{0,2})?$/;

    if (regex.test(val)) {
      const number = parseFloat(val.replace(',', '.'));
const parts = val.split(',');
 const hasTooManyDecimals = parts[1] !== undefined && parts[1]?.length > 2;
      // Разрешаем пустую строку
      if (val === '' || (!isNaN(number) && number <= 10)) {
        setCustomValue(val);
         if (typeof setShowError === 'function') {
          const isValid =
            /^([0-9]|10)(,\d{0,2})?$/.test(val) &&
            !isNaN(number) &&
            number <= 10 &&
            !hasTooManyDecimals;

          setShowError(!isValid);
          }
      }
    }
  }}
  onBlur={e => {
    let val = e.target.value.trim();

    // Заменяем все точки на запятые
    val = val.replace(/\./g, ',');

    // Удаляем ведущие нули, кроме "0,"
    if (/^0\d/.test(val)) {
      val = parseFloat(val.replace(',', '.')).toString().replace('.', ',');
    }

    const number = parseFloat(val.replace(',', '.'));
 const parts = val.split(',');
    const hasTooManyDecimals = parts[1] !== undefined && parts[1]?.length > 2;

    // Проверка: 0–10, максимум две цифры после запятой
    const isValid =
      /^([0-9]|10)(,\d{1,2})?$/.test(val) &&
      !isNaN(number) &&
      number <= 10 &&
      !hasTooManyDecimals;
 if (typeof setShowError === 'function') {
      setShowError(!isValid);
    }
    if (isValid) {
      setCustomValue(val);
    }
  }}
  inputMode="decimal"
  label={
    infoKey === 'tax' || infoKey === 'notary' || infoKey === 'broker'
      ? ''
      : `Custom ${label}`
  }
/>

            <span>%</span>
          </div>
        )}
      </div>

      {showCustom && showError && (
  <p className={styles.error}>
    {t('mortgageCalculator.customValueError')}
  </p>
)}
    </>
  );
}