import styles from './CancellationPolicy.module.css';
import { withPageShell } from '@shared/ui/PageShell/PageShell';

const CancellationPolicy: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Widerrufsbelehrung</h1>

      <h2>Widerrufsrecht</h2>
      <p>
        Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
        diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage
        ab dem Tag des Vertragsabschlusses.
      </p>
      <p>
        Um Ihr Widerrufsrecht auszuüben, müssen uns (Immo-Tonn, Inhaber Andreas
        Tonn, Sessendrupweg 54, 48161 Münster, Email:
        <a href="mailto:tonn_andreas@web.de"> tonn_andreas@web.de</a>) mittels
        einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief
        oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen,
        informieren. Sie können dafür das beigefügte Muster-Widerrufsformular
        verwenden, das jedoch nicht vorgeschrieben ist.
      </p>
      <p>
        Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung
        über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist
        absenden.
      </p>

      <h2>Folgen des Widerrufs</h2>
      <p>
        Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die
        wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit
        Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine
        andere Art der Lieferung als die von uns angebotene, günstigste
        Standardlieferung gewählt haben), unverzüglich und spätestens binnen
        vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über
        Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
      </p>
      <p>
        Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei
        der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen
        wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen
        wegen dieser Rückzahlung Entgelte berechnet.
      </p>
      <p>
        Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist
        beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der
        dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des
        Widerrufsrechts hinsichtlich dieses Vertrages unterrichten, bereits
        erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag
        vorgesehenen Dienstleistungen entspricht.
      </p>

      <h2>Muster-Widerrufsformular</h2>
      <p>
        (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses
        Formular aus und senden Sie es zurück.)
      </p>
      <p>
        An Immo-Tonn, Inhaber Andreas Tonn, Sessendrupweg 54, 48161 Münster
        <br />
        Email: <a href="mailto:tonn_andreas@web.de">tonn_andreas@web.de</a>
        <br />
        Telefon: <a href="tel:025162560763">0251-62560763</a>
      </p>
      <p>
        Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen
        Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der
        folgenden Dienstleistung (*)
      </p>
      <p>
        Bestellt am (*)/erhalten am (*)
        <br />
        Name des/der Verbraucher(s)
        <br />
        Anschrift des/der Verbraucher(s)
        <br />
        Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)
        <br />
        Datum
      </p>
      <p>(*) Unzutreffendes streichen.</p>

      <h2>Hinweis zum vorzeitigen Erlöschen des Widerrufsrechts</h2>
      <p>
        Ihr Widerrufsrecht erlischt bei einem Vertrag zur Erbringung von
        Dienstleistungen vorzeitig, wenn wir die Dienstleistung vollständig
        erbracht haben und mit der Ausführung der Dienstleistung erst begonnen
        haben, nachdem Sie dazu Ihre ausdrückliche Zustimmung gegeben haben und
        gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Sie Ihr
        Widerrufsrecht bei vollständiger Vertragserfüllung durch uns verlieren.
      </p>
    </div>
  );
};

export default withPageShell(CancellationPolicy);
