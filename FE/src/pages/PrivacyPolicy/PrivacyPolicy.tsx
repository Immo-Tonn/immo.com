import PrivacyPolicyThree from '@widgets/PrivacyPoliceComponents/PrivacyPolicyThree';
import styles from '@shared/styles/PrivacyPolicy.module.css';
import PrivacyPolicyTwo from '@widgets/PrivacyPoliceComponents/PrivacyPolicyTwo';
import { withPageShell } from '@shared/ui/PageShell/PageShell';

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <h1>Datenschutzerklärung</h1>
      <h2>Präambel</h2>
      <p>
        Mit der folgenden Datenschutzerklärung möchten wir Sie darüber
        aufklären, welche Arten Ihrer personenbezogenen Daten (nachfolgend auch
        kurz als "Daten" bezeichnet) wir zu welchen Zwecken und in welchem
        Umfang verarbeiten. Die Datenschutzerklärung gilt für alle von uns
        durchgeführten Verarbeitungen personenbezogener Daten, sowohl im Rahmen
        der Erbringung unserer Leistungen als auch insbesondere auf unseren
        Webseiten, in mobilen Applikationen sowie innerhalb externer
        Onlinepräsenzen, wie z. B. unserer Social-Media-Profile (nachfolgend
        zusammenfassend bezeichnet als "Onlineangebot"). Die verwendeten
        Begriffe sind nicht geschlechtsspezifisch.
      </p>
      <h2>Präambel</h2>
      <p>
        Mit der folgenden Datenschutzerklärung möchten wir Sie darüber
        aufklären, welche Arten Ihrer personenbezogenen Daten (nachfolgend auch
        kurz als "Daten" bezeichnet) wir zu welchen Zwecken und in welchem
        Umfang im Rahmen der Bereitstellung unserer Applikation verarbeiten. Die
        verwendeten Begriffe sind nicht geschlechtsspezifisch. Stand: 3. Juni
        2025 Erstellt mit dem{' '}
        <a
          href="https://datenschutz-generator.de"
          target="_blank"
          rel="noopener noreferrer"
        >
          Datenschutz-Generator.de von Dr. Thomas Schwenke
        </a>
      </p>
      <h2>Inhaltsübersicht</h2>
      <ul>
        <li>Präambel</li>
        <li>Präambel</li>
        <li>Verantwortlicher</li>
        <li>Übersicht der Verarbeitungen</li>
        <li>Maßgebliche Rechtsgrundlagen</li>
        <li>Sicherheitsmaßnahmen</li>
        <li>Internationale Datentransfers</li>
        <li>Allgemeine Informationen zur Datenspeicherung und Löschung</li>
        <li>Rechte der betroffenen Personen</li>
        <li>Geschäftliche Leistungen</li>
        <li>Geschäftsprozesse und -verfahren</li>
        <li>Bereitstellung des Onlineangebots und Webhosting</li>
        <li>Einsatz von Cookies</li>
        <li>Besondere Hinweise zu Applikationen (Apps)</li>
        <li>Kontakt- und Anfrageverwaltung</li>
        <li>Webanalyse, Monitoring und Optimierung</li>
        <li>Onlinemarketing</li>
        <li>Präsenzen in sozialen Netzwerken (Social Media)</li>
        <li>Plug-ins und eingebettete Funktionen sowie Inhalte</li>
        <li>Änderung und Aktualisierung</li>
        <li>Begriffsdefinitionen</li>
      </ul>

      <h2>Verantwortlicher</h2>
      <p>
        Andreas Tonn
        <br />
        Sessendrupweg 54
        <br />
        48161 Münster
        <br />
        E-Mail-Adresse:{' '}
        <a href="mailto:tonn_andreas@web.de">tonn_andreas@web.de</a>
      </p>
      <h2>Übersicht der Verarbeitungen</h2>
      <p>
        Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und
        die Zwecke ihrer Verarbeitung zusammen und verweist auf die betroffenen
        Personen.
      </p>

      <h2> Arten der verarbeiteten Daten</h2>
      <ul>
        <li>Bestandsdaten.</li>
        <li>Zahlungsdaten.</li>
        <li>Standortdaten.</li>
        <li>Kontaktdaten.</li>
        <li>Inhaltsdaten.</li>
        <li>Vertragsdaten.</li>
        <li>Nutzungsdaten.</li>
        <li>Meta-, Kommunikations- und Verfahrensdaten.</li>
        <li>Protokolldaten.</li>
      </ul>

      <h2>Kategorien betroffener Personen </h2>
      <ul>
        <li>Leistungsempfänger und Auftraggeber.</li>
        <li>Beschäftigte.</li>
        <li>Interessenten.</li>
        <li>Kommunikationspartner</li>
        <li>Nutzer.</li>
        <li>Geschäfts- und Vertragspartner.</li>
        <li>Dritte Personen.</li>
      </ul>

      <h2>Zwecke der Verarbeitung </h2>
      <ul>
        <li>
          Erbringung vertraglicher Leistungen und Erfüllung vertraglicher
          Pflichten.
        </li>
        <li>Kommunikation.</li>
        <li>Sicherheitsmaßnahmen.</li>
        <li>Reichweitenmessung.</li>
        <li>Tracking.</li>
        <li>Büro- und Organisationsverfahren.</li>
        <li>Remarketing.</li>
        <li>Konversionsmessung.</li>
        <li>Klickverfolgung.</li>
        <li>Zielgruppenbildung.</li>
        <li>A/B-Tests.</li>
        <li>Organisations- und Verwaltungsverfahren.</li>
        <li>Feedback.</li>
        <li>Heatmaps.</li>
        <li>Marketing</li>
        <li>Profile mit nutzerbezogenen Informationen.</li>
        <li>
          Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.
        </li>
        <li>Informationstechnische Infrastruktur.</li>
        <li>Finanz- und Zahlungsmanagement.</li>
        <li>Öffentlichkeitsarbeit.</li>
        <li>Absatzförderung</li>
        <li>Geschäftsprozesse und betriebswirtschaftliche Verfahren.</li>
      </ul>

      <h2>Maßgebliche Rechtsgrundlagen</h2>
      <h3>Maßgebliche Rechtsgrundlagen nach der DSGVO:</h3>
      <p>
        Im Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der DSGVO,
        auf deren Basis wir personenbezogene Daten verarbeiten. Bitte nehmen Sie
        zur Kenntnis, dass neben den Regelungen der DSGVO nationale
        Datenschutzvorgaben in Ihrem bzw. unserem Wohn- oder Sitzland gelten
        können. Sollten ferner im Einzelfall speziellere Rechtsgrundlagen
        maßgeblich sein, teilen wir Ihnen diese in der Datenschutzerklärung mit.
      </p>
      <ul>
        <li>
          Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO) - Die betroffene
          Person hat ihre Einwilligung in die Verarbeitung der sie betreffenden
          personenbezogenen Daten für einen spezifischen Zweck oder mehrere
          bestimmte Zwecke gegeben.
        </li>
        <li>
          Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1
          lit. b) DSGVO) - Die Verarbeitung ist für die Erfüllung eines
          Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur
          Durchführung vorvertraglicher Maßnahmen erforderlich, die auf Anfrage
          der betroffenen Person erfolgen.
        </li>
        <li>
          Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c) DSGVO) - Die
          Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung
          erforderlich, der der Verantwortliche unterliegt.{' '}
        </li>
        <li>
          Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO) - die
          Verarbeitung ist zur Wahrung der berechtigten Interessen des
          Verantwortlichen oder eines Dritten notwendig, vorausgesetzt, dass die
          Interessen, Grundrechte und Grundfreiheiten der betroffenen Person,
          die den Schutz personenbezogener Daten verlangen, nicht überwiegen.
        </li>
      </ul>

      <h3>Nationale Datenschutzregelungen in Deutschland: </h3>
      <p>
        Zusätzlich zu den Datenschutzregelungen der DSGVO gelten nationale
        Regelungen zum Datenschutz in Deutschland. Hierzu gehört insbesondere
        das Gesetz zum Schutz vor Missbrauch personenbezogener Daten bei der
        Datenverarbeitung (Bundesdatenschutzgesetz – BDSG). Das BDSG enthält
        insbesondere Spezialregelungen zum Recht auf Auskunft, zum Recht auf
        Löschung, zum Widerspruchsrecht, zur Verarbeitung besonderer Kategorien
        personenbezogener Daten, zur Verarbeitung für andere Zwecke und zur
        Übermittlung sowie automatisierten Entscheidungsfindung im Einzelfall
        einschließlich Profiling. Ferner können Landesdatenschutzgesetze der
        einzelnen Bundesländer zur Anwendung gelangen.{' '}
      </p>

      <h2>Sicherheitsmaßnahmen </h2>
      <p>
        Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter
        Berücksichtigung des Stands der Technik, der Implementierungskosten und
        der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung sowie
        der unterschiedlichen Eintrittswahrscheinlichkeiten und des Ausmaßes der
        Bedrohung der Rechte und Freiheiten natürlicher Personen geeignete
        technische und organisatorische Maßnahmen, um ein dem Risiko
        angemessenes Schutzniveau zu gewährleisten.
      </p>
      <p>
        Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit,
        Integrität und Verfügbarkeit von Daten durch Kontrolle des physischen
        und elektronischen Zugangs zu den Daten als auch des sie betreffenden
        Zugriffs, der Eingabe, der Weitergabe, der Sicherung der Verfügbarkeit
        und ihrer Trennung. Des Weiteren haben wir Verfahren eingerichtet, die
        eine Wahrnehmung von Betroffenenrechten, die Löschung von Daten und
        Reaktionen auf die Gefährdung der Daten gewährleisten. Ferner
        berücksichtigen wir den Schutz personenbezogener Daten bereits bei der
        Entwicklung bzw. Auswahl von Hardware, Software sowie Verfahren
        entsprechend dem Prinzip des Datenschutzes, durch Technikgestaltung und
        durch datenschutzfreundliche Voreinstellungen.
      </p>
      <p>
        Sicherung von Online-Verbindungen durch
        TLS-/SSL-Verschlüsselungstechnologie (HTTPS): Um die Daten der Nutzer,
        die über unsere Online-Dienste übertragen werden, vor unerlaubten
        Zugriffen zu schützen, setzen wir auf die
        TLS-/SSLVerschlüsselungstechnologie. Secure Sockets Layer (SSL) und
        Transport Layer Security (TLS) sind die Eckpfeiler der sicheren
        Datenübertragung im Internet. Diese Technologien verschlüsseln die
        Informationen, die zwischen der Website oder App und dem Browser des
        Nutzers (oder zwischen zwei Servern) übertragen werden, wodurch die
        Daten vor unbefugtem Zugriff geschützt sind. TLS, als die
        weiterentwickelte und sicherere Version von SSL, gewährleistet, dass
        alle Datenübertragungen den höchsten Sicherheitsstandards entsprechen.
        Wenn eine Website durch ein SSL-/TLS-Zertifikat gesichert ist, wird dies
        durch die Anzeige von HTTPS in der URL signalisiert. Dies dient als ein
        Indikator für die Nutzer, dass ihre Daten sicher und verschlüsselt
        übertragen werden.
      </p>

      <h2>Internationale Datentransfers </h2>
      <p>
        Datenverarbeitung in Drittländern: Sofern wir Daten in ein Drittland (d.
        h. außerhalb der Europäischen Union (EU) oder des Europäischen
        Wirtschaftsraums (EWR)) übermitteln oder dies im Rahmen der Nutzung von
        Diensten Dritter oder der Offenlegung bzw. Übermittlung von Daten an
        andere Personen, Stellen oder Unternehmen geschieht (was erkennbar wird
        anhand der Postadresse des jeweiligen Anbieters oder wenn in der
        Datenschutzerklärung ausdrücklich auf den Datentransfer in Drittländer
        hingewiesen wird), erfolgt dies stets im Einklang mit den gesetzlichen
        Vorgaben.
      </p>
      <p>
        Für Datenübermittlungen in die USA stützen wir uns vorrangig auf das
        Data Privacy Framework (DPF), welches durch einen
        Angemessenheitsbeschluss der EUKommission vom 10.07.2023 als sicherer
        Rechtsrahmen anerkannt wurde. Zusätzlich haben wir mit den jeweiligen
        Anbietern Standardvertragsklauseln abgeschlossen, die den Vorgaben der
        EU-Kommission entsprechen und vertragliche Verpflichtungen zum Schutz
        Ihrer Daten festlegen.
      </p>
      <p>
        Diese zweifache Absicherung gewährleistet einen umfassenden Schutz Ihrer
        Daten: Das DPF bildet die primäre Schutzebene, während die
        Standardvertragsklauseln als zusätzliche Sicherheit dienen. Sollten sich
        Änderungen im Rahmen des DPF ergeben, greifen die
        Standardvertragsklauseln als zuverlässige Rückfalloption ein. So stellen
        wir sicher, dass Ihre Daten auch bei etwaigen politischen oder
        rechtlichen Veränderungen stets angemessen geschützt bleiben.
      </p>
      <p>
        Bei den einzelnen Diensteanbietern informieren wir Sie darüber, ob sie
        nach dem DPF zertifiziert sind und ob Standardvertragsklauseln
        vorliegen. Weitere Informationen zum DPF und eine Liste der
        zertifizierten Unternehmen finden Sie auf der Website des
        US-Handelsministeriums unter{' '}
        <a
          href="https://www.dataprivacyframework.gov/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.dataprivacyframework.gov/
        </a>{' '}
        (in englischer Sprache).
      </p>
      <p>
        Für Datenübermittlungen in andere Drittländer gelten entsprechende
        Sicherheitsmaßnahmen, insbesondere Standardvertragsklauseln,
        ausdrückliche Einwilligungen oder gesetzlich erforderliche
        Übermittlungen. Informationen zu Drittlandtransfers und geltenden
        Angemessenheitsbeschlüssen können Sie dem Informationsangebot der
        EU-Kommission entnehmen:
        <a
          href="https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection_en?prefLang=de"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection_en?prefLang=de
        </a>
      </p>

      <h2>Allgemeine Informationen zur Datenspeicherung und Löschung </h2>
      <p>
        Wir löschen personenbezogene Daten, die wir verarbeiten, gemäß den
        gesetzlichen Bestimmungen, sobald die zugrundeliegenden Einwilligungen
        widerrufen werden oder keine weiteren rechtlichen Grundlagen für die
        Verarbeitung bestehen. Dies betrifft Fälle, in denen der ursprüngliche
        Verarbeitungszweck entfällt oder die Daten nicht mehr benötigt werden.
        Ausnahmen von dieser Regelung bestehen, wenn gesetzliche Pflichten oder
        besondere Interessen eine längere Aufbewahrung oder Archivierung der
        Daten erfordern. Insbesondere müssen Daten, die aus handels- oder
        steuerrechtlichen Gründen aufbewahrt werden müssen oder deren
        Speicherung notwendig ist zur Rechtsverfolgung oder zum Schutz der
        Rechte anderer natürlicher oder juristischer Personen, entsprechend
        archiviert werden. Unsere Datenschutzhinweise enthalten zusätzliche
        Informationen zur Aufbewahrung und Löschung von Daten, die speziell für
        bestimmte Verarbeitungsprozesse gelten. Bei mehreren Angaben zur
        Aufbewahrungsdauer oder Löschungsfristen eines Datums, ist stets die
        längste Frist maßgeblich. Beginnt eine Frist nicht ausdrücklich zu einem
        bestimmten Datum und beträgt sie mindestens ein Jahr, so startet sie
        automatisch am Ende des Kalenderjahres, in dem das fristauslösende
        Ereignis eingetreten ist. Im Fall laufender Vertragsverhältnisse, in
        deren Rahmen Daten gespeichert werden, ist das fristauslösende Ereignis
        der Zeitpunkt des Wirksamwerdens der Kündigung oder sonstige Beendigung
        des Rechtsverhältnisses. Daten, die nicht mehr für den ursprünglich
        vorgesehenen Zweck, sondern aufgrund gesetzlicher Vorgaben oder anderer
        Gründe aufbewahrt werden, verarbeiten wir ausschließlich zu den Gründen,
        die ihre Aufbewahrung rechtfertigen.
      </p>

      <h3>
        Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:
      </h3>
      <h3>Aufbewahrung und Löschung von Daten:</h3>
      <p>
        Die folgenden allgemeinen Fristen gelten für die Aufbewahrung und
        Archivierung nach deutschem Recht:
      </p>

      <ul>
        <li>
          10 Jahre - Aufbewahrungsfrist für Bücher und Aufzeichnungen,
          Jahresabschlüsse, Inventare, Lageberichte, Eröffnungsbilanz sowie die
          zu ihrem Verständnis erforderlichen Arbeitsanweisungen und sonstigen
          Organisationsunterlagen (§ 147 Abs. 1 Nr. 1 i.V.m. Abs. 3 AO, § 14b
          Abs. 1 UStG, § 257 Abs. 1 Nr. 1 i.V.m. Abs. 4 HGB).
        </li>
        <li>
          8 Jahre - Buchungsbelege, wie z. B. Rechnungen und Kostenbelege (§ 147
          Abs. 1 Nr. 4 und 4a i.V.m. Abs. 3 Satz 1 AO sowie § 257 Abs. 1 Nr. 4
          i.V.m. Abs. 4 HGB).
        </li>
        <li>
          3 Jahre - Daten, die erforderlich sind, um potenzielle
          Gewährleistungsund Schadensersatzansprüche oder ähnliche vertragliche
          Ansprüche und Rechte zu berücksichtigen sowie damit verbundene
          Anfragen zu bearbeiten, basierend auf früheren Geschäftserfahrungen
          und üblichen Branchenpraktiken, werden für die Dauer der regulären
          gesetzlichen Verjährungsfrist von drei Jahren gespeichert (§§ 195, 199
          BGB).
        </li>
      </ul>
      <h2>Rechte der betroffenen Personen </h2>
      <p>
        Rechte der betroffenen Personen aus der DSGVO: Ihnen stehen als
        Betroffene nach der DSGVO verschiedene Rechte zu, die sich insbesondere
        aus Art. 15 bis 21 DSGVO ergeben:{' '}
      </p>
      <ul>
        <li>
          Widerspruchsrecht: Sie haben das Recht, aus Gründen, die sich aus
          Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung
          der Sie betreffenden personenbezogenen Daten, die aufgrund von Art. 6
          Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen; dies gilt
          auch für ein auf diese Bestimmungen gestütztes Profiling. Werden die
          Sie betreffenden personenbezogenen Daten verarbeitet, um Direktwerbung
          zu betreiben, haben Sie das Recht, jederzeit Widerspruch gegen die
          Verarbeitung der Sie betreffenden personenbezogenen Daten zum Zwecke
          derartiger Werbung einzulegen; dies gilt auch für das Profiling,
          soweit es mit solcher Direktwerbung in Verbindung steht.
        </li>
        <li>
          Widerrufsrecht bei Einwilligungen: Sie haben das Recht, erteilte
          Einwilligungen jederzeit zu widerrufen.
        </li>
        <li>
          Auskunftsrecht: Sie haben das Recht, eine Bestätigung darüber zu
          verlangen, ob betreffende Daten verarbeitet werden und auf Auskunft
          über diese Daten sowie auf weitere Informationen und Kopie der Daten
          entsprechend den gesetzlichen Vorgaben.
        </li>
        <li>
          Recht auf Berichtigung: Sie haben entsprechend den gesetzlichen
          Vorgaben das Recht, die Vervollständigung der Sie betreffenden Daten
          oder die Berichtigung der Sie betreffenden unrichtigen Daten zu
          verlangen.
        </li>
        <li>
          Recht auf Löschung und Einschränkung der Verarbeitung: Sie haben nach
          Maßgabe der gesetzlichen Vorgaben das Recht, zu verlangen, dass Sie
          betreffende Daten unverzüglich gelöscht werden, bzw. alternativ nach
          Maßgabe der gesetzlichen Vorgaben eine Einschränkung der Verarbeitung
          der Daten zu verlangen.
        </li>
        <li>
          Recht auf Datenübertragbarkeit: Sie haben das Recht, Sie betreffende
          Daten, die Sie uns bereitgestellt haben, nach Maßgabe der gesetzlichen
          Vorgaben in einem strukturierten, gängigen und maschinenlesbaren
          Format zu erhalten oder deren Übermittlung an einen anderen
          Verantwortlichen zu fordern.
        </li>
        <li>
          Beschwerde bei Aufsichtsbehörde: Entsprechend den gesetzlichen
          Vorgaben und unbeschadet eines anderweitigen verwaltungsrechtlichen
          oder gerichtlichen Rechtsbehelfs, haben Sie ferner das Recht, bei
          einer Datenschutzaufsichtsbehörde, insbesondere einer Aufsichtsbehörde
          im Mitgliedstaat, in dem Sie sich gewöhnlich aufhalten, der
          Aufsichtsbehörde Ihres Arbeitsplatzes oder des Ortes des mutmaßlichen
          Verstoßes, eine Beschwerde einzulegen, wenn Sie der Ansicht sei
          sollten, dass die Verarbeitung der Ihre Person betreffenden
          personenbezogenen Daten gegen die DSGVO verstößt.
        </li>
      </ul>
      <h2>Geschäftliche Leistungen </h2>
      <p>
        Wir verarbeiten Daten unserer Vertrags- und Geschäftspartner, z. B.
        Kunden und Interessenten (zusammenfassend als „Vertragspartner"
        bezeichnet), im Rahmen von vertraglichen und vergleichbaren
        Rechtsverhältnissen sowie damit verbundenen Maßnahmen und im Hinblick
        auf die Kommunikation mit den Vertragspartnern (oder vorvertraglich),
        etwa zur Beantwortung von Anfragen. Wir verwenden diese Daten, um unsere
        vertraglichen Verpflichtungen zu erfüllen. Dazu gehören insbesondere die
        Pflichten zur Erbringung der vereinbarten Leistungen, etwaige
        Aktualisierungspflichten und Abhilfe bei Gewährleistungs- und sonstigen
        Leistungsstörungen. Darüber hinaus verwenden wir die Daten zur Wahrung
        unserer Rechte und zum Zwecke der mit diesen Pflichten verbundenen
        Verwaltungsaufgaben sowie der Unternehmensorganisation. Zudem
        verarbeiten wir die Daten auf Grundlage unserer berechtigten Interessen
        sowohl an einer ordnungsgemäßen und betriebswirtschaftlichen
        Geschäftsführung als auch an Sicherheitsmaßnahmen zum Schutz unserer
        Vertragspartner und unseres Geschäftsbetriebs vor Missbrauch, Gefährdung
        ihrer Daten, Geheimnisse, Informationen und Rechte (z. B. zur
        Beteiligung von Telekommunikations-,Transport- und sonstigen
        Hilfsdiensten sowie Subunternehmern, Banken, Steuerund Rechtsberatern,
        Zahlungsdienstleistern oder Finanzbehörden). Im Rahmen des geltenden
        Rechts geben wir die Daten von Vertragspartnern nur insoweit an Dritte
        weiter, als dies für die vorgenannten Zwecke oder zur Erfüllung
        gesetzlicher Pflichten erforderlich ist. Über weitere Formen der
        Verarbeitung, etwa zu Marketingzwecken, werden die Vertragspartner im
        Rahmen dieser Datenschutzerklärung informiert. Welche Daten für die
        vorgenannten Zwecke erforderlich sind, teilen wir den Vertragspartnern
        vor oder im Rahmen der Datenerhebung, z. B. in Onlineformularen, durch
        besondere Kennzeichnung (z. B. Farben) bzw. Symbole (z. B. Sternchen o.
        Ä.), oder persönlich mit. Wir löschen die Daten nach Ablauf gesetzlicher
        Gewährleistungs- und vergleichbarer Pflichten, d. h. grundsätzlich nach
        vier Jahren, es sei denn, dass die Daten in einem Kundenkonto
        gespeichert werden, z. B., solange sie aus gesetzlichen Gründen der
        Archivierung aufbewahrt werden müssen (etwa für Steuerzwecke im
        Regelfall zehn Jahre). Daten, die uns im Rahmen eines Auftrags durch den
        Vertragspartner offengelegt wurden, löschen wir entsprechend den
        Vorgaben und grundsätzlich nach Ende des Auftrags.{' '}
      </p>
      <ul>
        <li>
          Verarbeitete Datenarten: Bestandsdaten (z. B. der vollständige Name,
          Wohnadresse, Kontaktinformationen, Kundennummer, etc.); Zahlungsdaten
          (z. B. Bankverbindungen, Rechnungen, Zahlungshistorie); Kontaktdaten
          (z. B. Post- und E-Mail-Adressen oder Telefonnummern). Vertragsdaten
          (z. B. Vertragsgegenstand, Laufzeit, Kundenkategorie).
        </li>
        <li>
          Betroffene Personen: Leistungsempfänger und Auftraggeber;
          Interessenten. Geschäfts- und Vertragspartner.
        </li>
        <li>
          Zwecke der Verarbeitung: Erbringung vertraglicher Leistungen und
          Erfüllung vertraglicher Pflichten; Kommunikation; Büro- und
          Organisationsverfahren; Organisations- und Verwaltungsverfahren.
          Geschäftsprozesse und betriebswirtschaftliche Verfahren
        </li>
        <li>
          Aufbewahrung und Löschung: Löschung entsprechend Angaben im Abschnitt
          "Allgemeine Informationen zur Datenspeicherung und Löschung".
        </li>
        <li>
          Rechtsgrundlagen: Vertragserfüllung und vorvertragliche Anfragen (Art.
          6 Abs. 1 S. 1 lit. b) DSGVO); Rechtliche Verpflichtung (Art. 6 Abs. 1
          S. 1 lit. c) DSGVO). Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit.
          f) DSGVO).
        </li>
      </ul>

      <h2>
        Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:{' '}
      </h2>
      <ul>
        <li>
          Makler- und Vermittlungsleistungen: Wir verarbeiten die Daten unserer
          Kunden, Klienten und Interessenten (einheitlich bezeichnet als
          "Kunden") entsprechend dem zugrundeliegenden Auftrag der Kunden. Wir
          können ferner die Angaben zu den Eigenschaften und Umständen von
          Personen oder
        </li>
        <li>
          ihnen gehörenden Sachen verarbeiten, wenn dies zum Gegenstand unseres
          Auftrags gehört. Dies können z. B. Angaben zu persönlichen
          Lebensumständen, mobilen oder immobilen Sachgütern und der
          finanziellen Situation sein. Sofern für die Vertragserfüllung oder
          gesetzlich erforderlich bzw. durch die Kunden bewilligt oder auf
          Grundlage auf unserer berechtigten Interessen basierend, offenbaren
          oder übermitteln wir die Daten der Kunden im Rahmen von
          Deckungsanfragen, Abschlüssen und der Abwicklung von Verträgen an
          Anbieter der vermittelten Leistungen/ Objekte, Versicherer,
          Rückversicherer, Maklerpools, technische Dienstleister, sonstige
          Dienstleister, wie z. B. kooperierende Verbände, sowie
          Finanzdienstleister, Kreditinstitute und Kapitalanlagegesellschaften
          sowie Sozialversicherungsträger, Steuerbehörden, Steuerberater,
          Rechtsberater, Wirtschaftsprüfer, Versicherungs-Ombudsmänner und die
          Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin). Ferner können
          wir, vorbehaltlich anderer Abreden, Unterauftragnehmer beauftragen,
          wie z. B. Untervermittler; Rechtsgrundlagen: Vertragserfüllung und
          vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO).
        </li>
        <li>
          Finanzdienstleistungen: Wir verarbeiten die Daten unserer Kunden, um
          ihnen die Beratung, Vermittlung sowie den Abschluss von
          Finanzgeschäften und damit verbundenen Dienstleistungen zu
          ermöglichen. Die erforderlichen Angaben sind als solche im Rahmen der
          Beratungs-, Vermittlungs- bzw. vergleichbaren Vertragsschlusses
          gekennzeichnet und umfassen die zur Leistungserbringung und Abrechnung
          benötigten Angaben sowie Kontaktinformationen, um etwaige Rücksprachen
          halten zu können. Soweit wir Zugang zu Informationen der Kunden oder
          anderer Personen erhalten, verarbeiten wir diese im Einklang mit den
          gesetzlichen und vertraglichen Vorgaben; Rechtsgrundlagen:
          Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1
          lit. b) DSGVO), Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c)
          DSGVO), Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).
        </li>
        <li>
          Vermietungsleistungen: Wir verarbeiten die Daten unserer Mieter und
          von Mietinteressenten entsprechend dem zugrundeliegenden Mietvertrag.
          Wir können ferner die Angaben zu den Eigenschaften und Umständen von
          Personen oder ihnen gehörenden Sachen verarbeiten, wenn dies im Rahmen
          des Mietverhältnisses erforderlich ist. Dies können z. B. Angaben zu
          persönlichen Lebensumständen, mobilen oder immobilen Sachgütern und
          zur finanziellen Situation sowie der Inanspruchnahme von
          Nebenleistungen (wie der Wasser- oder Energieversorgung) sein.
        </li>
      </ul>

      <p>
        In Rahmen unserer Beauftragung kann es erforderlich sein, dass wir
        besondere Kategorien von Daten im Sinne von Art. 9 Abs. 1 DSGVO,
        insbesondere Angaben zur Gesundheit einer Person, verarbeiten. Die
        Verarbeitung erfolgt, um die gesundheitlichen Interessen der Mieter
        schützen zu können und ansonsten nur mit Einwilligung der Mieter.
      </p>
      <p>
        {' '}
        Sofern für die Vertragserfüllung oder gesetzlich erforderlich bzw. durch
        die Mieter bewilligt oder auf Grundlage auf unserer berechtigten
        Interessen, offenbaren oder übermitteln wir die Daten der Mieter im
        Rahmen von Deckungsanfragen, Abschlüssen und Abwicklungen von Verträgen,
        z. B. an Finanzdienstleister, Kreditinstitute, Versorgern (z. B. Strom)
        oder Behörden
      </p>

      <p>
        Ferner verarbeiten wir Daten der Mieter, falls dies zur Erfüllung von
        gesetzlichen Pflichten erforderlich ist (z. B. bei Informationspflichten
        in Verbindung mit Nebenleistungen sowie den Nebenkosten);
        Rechtsgrundlagen: Vertragserfüllung und vorvertragliche Anfragen (Art. 6
        Abs. 1 S. 1 lit. b) DSGVO).{' '}
      </p>

      <h2>Geschäftsprozesse und -verfahren </h2>
      <p>
        {' '}
        Personenbezogene Daten von Leistungsempfängern und Auftraggebern –
        darunter Kunden, Klienten oder in speziellen Fällen Mandanten, Patienten
        oder Geschäftspartner sowie weitere Dritte – werden im Rahmen
        vertraglicher sowie vergleichbarer Rechtsverhältnisse und
        vorvertraglicher Maßnahmen wie der Anbahnung von Geschäftsbeziehungen
        verarbeitet. Diese Datenverarbeitung unterstützt und erleichtert
        betriebswirtschaftliche Abläufe in Bereichen wie Kundenmanagement,
        Vertrieb, Zahlungsverkehr, Buchhaltung und Projektmanagement. Die
        erfassten Daten dienen dazu, vertragliche Verpflichtungen zu erfüllen
        und betriebliche Prozesse effizient zu gestalten. Hierzu gehört die
        Abwicklung von Geschäftstransaktionen, das Management von
        Kundenbeziehungen, die Optimierung von Vertriebsstrategien sowie die
        Gewährleistung interner Rechnungs- und Finanzprozesse. Zusätzlich
        unterstützen die Daten die Wahrung der Rechte des Verantwortlichen und
        fördern Verwaltungsaufgaben sowie die Organisation des Unternehmens.
        Personenbezogene Daten können an Dritte weitergegeben werden, sofern
        dies zur Erfüllung der genannten Zwecke oder gesetzlicher
        Verpflichtungen notwendig ist. Nach Ablauf gesetzlicher
        Aufbewahrungsfristen oder wenn der Zweck der Verarbeitung entfällt,
        werden die Daten gelöscht. Dies umfasst auch Daten, die aufgrund von
        steuerrechtlichen und gesetzlichen Nachweispflichten länger gespeichert
        werden müssen.
      </p>
      <ul>
        <li>
          Verarbeitete Datenarten: Bestandsdaten (z. B. der vollständige Name,
          Wohnadresse, Kontaktinformationen, Kundennummer, etc.); Zahlungsdaten
          (z. B. Bankverbindungen, Rechnungen, Zahlungshistorie); Kontaktdaten
          (z. B. Post- und E-Mail-Adressen oder Telefonnummern); Inhaltsdaten
          (z. B. textliche oder bildliche Nachrichten und Beiträge sowie die sie
          betreffenden Informationen, wie z. B. Angaben zur Autorenschaft oder
          Zeitpunkt der Erstellung); Vertragsdaten (z. B. Vertragsgegenstand,
          Laufzeit, Kundenkategorie); Protokolldaten (z. B. Logfiles betreffend
          Logins oder den Abruf von Daten oder Zugriffszeiten.); Nutzungsdaten
          (z. B. Seitenaufrufe und Verweildauer, Klickpfade, Nutzungsintensität
          und -frequenz, verwendete Gerätetypen und Betriebssysteme,
          Interaktionen mit Inhalten und Funktionen). Meta-, Kommunikations- und
          Verfahrensdaten (z. B. IPAdressen, Zeitangaben,
          Identifikationsnummern, beteiligte Personen).
        </li>
        <li>
          Betroffene Personen: Leistungsempfänger und Auftraggeber;
          Interessenten; Kommunikationspartner; Geschäfts- und Vertragspartner;
          Dritte Personen; Nutzer (z. B. Webseitenbesucher, Nutzer von
          Onlinediensten). Beschäftigte (z. B. Angestellte, Bewerber,
          Aushilfskräfte und sonstige Mitarbeiter).
        </li>
        <li>
          Zwecke der Verarbeitung: Erbringung vertraglicher Leistungen und
          Erfüllung vertraglicher Pflichten; Büro- und Organisationsverfahren;
          Geschäftsprozesse und betriebswirtschaftliche Verfahren;
          Kommunikation; Marketing; Absatzförderung; Öffentlichkeitsarbeit;
          Finanz- und Zahlungsmanagement. Informationstechnische Infrastruktur
          (Betrieb und Bereitstellung von Informationssystemen und technischen
          Geräten (Computer, Server etc.))
        </li>
        <li>
          Aufbewahrung und Löschung: Löschung entsprechend Angaben im Abschnitt
          "Allgemeine Informationen zur Datenspeicherung und Löschung".
        </li>
        <li>
          Rechtsgrundlagen: Vertragserfüllung und vorvertragliche Anfragen (Art.
          6 Abs. 1 S. 1 lit. b) DSGVO); Berechtigte Interessen (Art. 6 Abs. 1 S.
          1 lit. f) DSGVO). Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c)
          DSGVO).
        </li>
      </ul>

      <h3>
        Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:{' '}
      </h3>
      <ul>
        <li>
          Kontaktverwaltung und Kontaktpflege: Verfahren, die im Rahmen der
          Organisation, Pflege und Sicherung von Kontaktinformationen
          erforderlich sind (z. B. die Einrichtung und Wartung einer zentralen
          Kontaktdatenbank, regelmäßige Aktualisierungen der
          Kontaktinformationen, Überwachung der Datenintegrität, Implementierung
          von Datenschutzmaßnahmen, Sicherstellung der Zugriffskontrollen,
          Durchführung von Backups und Wiederherstellungen der Kontaktdaten,
          Schulung von Mitarbeitern im effektiven Umgang mit
          Kontaktmanagement-Software, regelmäßige Überprüfung der
          Kommunikationshistorie und Anpassung der Kontaktstrategien);
          Rechtsgrundlagen: Vertragserfüllung und vorvertragliche Anfragen (Art.
          6 Abs. 1 S. 1 lit. b) DSGVO), Berechtigte Interessen (Art. 6 Abs. 1 S.
          1 lit. f) DSGVO).
        </li>
        <li>
          Allgemeiner Zahlungsverkehr: Verfahren, die bei der Durchführung von
          Zahlungsvorgängen, der Überwachung von Bankkonten und der Kontrolle
          von Zahlungsströmen erforderlich sind (z. B. Erstellung und Prüfung
          von Überweisungen, Abwicklung des Lastschriftverkehrs, Kontrolle von
          Kontoauszügen, Überwachung von Zahlungseingängen und -ausgängen,
          Rücklastschriftmanagement, Kontenabstimmung, Cash-Management);
          Rechtsgrundlagen: Vertragserfüllung und vorvertragliche Anfragen (Art.
          6 Abs. 1 S. 1 lit. b) DSGVO), Berechtigte Interessen (Art. 6 Abs. 1 S.
          1 lit. f) DSGVO).
        </li>
        <li>
          Buchhaltung, Kreditorenbuchhaltung, Debitorenbuchhaltung: Verfahren,
          die bei der Erfassung, Bearbeitung und Kontrolle von
          Geschäftsvorgängen im Bereich der Kreditoren- und Debitorenbuchhaltung
          erforderlich sind (z. B. Erstellung und Prüfung von eingehenden und
          ausgehenden Rechnungen, Überwachung und Verwaltung von offenen Posten,
          Durchführung des Zahlungsverkehrs, Abwicklung des Mahnwesens,
          Kontenabstimmung im Rahmen von Forderungen und Verbindlichkeiten,
          Kreditorenbuchhaltung und Debitorenbuchhaltung); Rechtsgrundlagen:
          Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1
          lit. b) DSGVO), Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c)
          DSGVO), Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).
        </li>
        <li>
          Finanzbuchhaltung und Steuern: Verfahren, die bei der Erfassung,
          Verwaltung und Kontrolle von finanzrelevanten Geschäftsvorfällen sowie
          bei der Berechnung, Meldung und Zahlung von Steuern erforderlich sind
          (z. B. Kontierung und Verbuchung von Geschäftsvorfällen, Erstellung
          von Quartalsund Jahresabschlüssen, Durchführung des Zahlungsverkehrs,
          Abwicklung des Mahnwesens, Kontenabstimmung, steuerliche Beratung,
          Erstellung und Einreichung von Steuererklärungen, Abwicklung des
          Steuerwesens); Rechtsgrundlagen: Vertragserfüllung und vorvertragliche
          Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO), Rechtliche Verpflichtung
          (Art. 6 Abs. 1 S. 1 lit. c) DSGVO), Berechtigte Interessen (Art. 6
          Abs. 1 S. 1 lit. f) DSGVO).
        </li>
        <li>
          Marketing, Werbung und Absatzförderung: Verfahren, die im Rahmen von
          Marketing, Werbung und Absatzförderung erforderlich sind (z. B.
          Marktanalyse und Zielgruppenbestimmung, Entwicklung von
          Marketingstrategien, Planung und Durchführung von Werbekampagnen,
          Gestaltung und Produktion von Werbematerialien, Online-Marketing
          einschließlich SEO und Social Media Kampagnen, Eventmarketing und
          Messebeteiligungen, Kundenbindungsprogramme,
          Verkaufsförderungsmaßnahmen, Performance-Messung und Optimierung der
          Marketingaktivitäten, Budgetverwaltung und Kostenkontrolle);
          Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f)
          DSGVO).
        </li>
        <li>
          Öffentlichkeitsarbeit: Verfahren, die im Rahmen der
          Öffentlichkeitsarbeit und Public Relations erforderlich sind (z. B.
          Entwicklung und Umsetzung von Kommunikationsstrategien, Planung und
          Durchführung von PR-Kampagnen, Erstellung und Verbreitung von
          Pressemitteilungen, Pflege vonMedienkontakten, Monitoring und Analyse
          der Medienresonanz, Organisation von Pressekonferenzen und
          öffentlichen Veranstaltungen, Krisenkommunikation, Erstellung von
          Content für soziale Medien und Unternehmenswebseiten, Betreuung des
          Corporate Branding); Rechtsgrundlagen: Berechtigte Interessen (Art. 6
          Abs. 1 S. 1 lit. f) DSGVO).{' '}
        </li>
      </ul>

      <h2>Bereitstellung des Onlineangebots und Webhosting </h2>
      <p>
        Wir verarbeiten die Daten der Nutzer, um ihnen unsere Online-Dienste zur
        Verfügung stellen zu können. Zu diesem Zweck verarbeiten wir die
        IP-Adresse des Nutzers, die notwendig ist, um die Inhalte und Funktionen
        unserer Online-Dienste an den Browser oder das Endgerät der Nutzer zu
        übermitteln.
      </p>
      <ul>
        <li>
          Verarbeitete Datenarten: Nutzungsdaten (z. B. Seitenaufrufe und
          Verweildauer, Klickpfade, Nutzungsintensität und -frequenz, verwendete
          Gerätetypen und Betriebssysteme, Interaktionen mit Inhalten und
          Funktionen); Meta-, Kommunikations- und Verfahrensdaten (z. B.
          IPAdressen, Zeitangaben, Identifikationsnummern, beteiligte Personen);
          Protokolldaten (z. B. Logfiles betreffend Logins oder den Abruf von
          Daten oder Zugriffszeiten.). Inhaltsdaten (z. B. textliche oder
          bildliche Nachrichten und Beiträge sowie die sie betreffenden
          Informationen, wie z. B. Angaben zur Autorenschaft oder Zeitpunkt der
          Erstellung).
        </li>
        <li>
          Betroffene Personen: Nutzer (z. B. Webseitenbesucher, Nutzer von
          Onlinediensten).
        </li>
        <li>
          Zwecke der Verarbeitung: Bereitstellung unseres Onlineangebotes und
          Nutzerfreundlichkeit; Informationstechnische Infrastruktur (Betrieb
          und Bereitstellung von Informationssystemen und technischen Geräten
          (Computer, Server etc.)). Sicherheitsmaßnahmen.
        </li>
        <li>
          Aufbewahrung und Löschung: Löschung entsprechend Angaben im Abschnitt
          "Allgemeine Informationen zur Datenspeicherung und Löschung".
        </li>
        <li>
          Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f)
          DSGVO).
        </li>
      </ul>
      <h3>
        Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:
      </h3>
      <ul>
        <li>
          Bereitstellung Onlineangebot auf gemietetem Speicherplatz: Für die
          Bereitstellung unseres Onlineangebotes nutzen wir Speicherplatz,
          Rechenkapazität und Software, die wir von einem entsprechenden
          Serveranbieter (auch "Webhoster" genannt) mieten oder anderweitig
          beziehen; Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1 S. 1
          lit. f) DSGVO).
        </li>
        <li>
          Erhebung von Zugriffsdaten und Logfiles: Der Zugriff auf unser
          Onlineangebot wird in Form von sogenannten "Server-Logfiles"
          protokolliert. Zu den Serverlogfiles können die Adresse und der Name
          der abgerufenen Webseiten und Dateien, Datum und Uhrzeit des Abrufs,
          übertragene Datenmengen, Meldung über erfolgreichen Abruf, Browsertyp
          nebst Version, das Betriebssystem des Nutzers, Referrer URL (die zuvor
          besuchte Seite) und im Regelfall IP-Adressen und der anfragende
          Provider gehören. Die Serverlogfiles können zum einen zu
          Sicherheitszwecken eingesetzt werden, z. B. um eine Überlastung der
          Server zu vermeiden (insbesondere im Fall von missbräuchlichen
          Angriffen, sogenannten DDoS-Attacken), und zum anderen, um die
          Auslastung der Server und ihre Stabilität sicherzustellen;
          Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f)
          DSGVO). Löschung von Daten: Logfile-Informationen werden für die Dauer
          von maximal 30 Tagen gespeichert und danach gelöscht oder
          anonymisiert. Daten, deren weitere Aufbewahrung zu Beweiszwecken
          erforderlich ist, sind bis zur endgültigen Klärung des jeweiligen
          Vorfalls von der Löschung ausgenommen
        </li>
        <li>
          E-Mail-Versand und -Hosting: Die von uns in Anspruch genommenen
          Webhosting-Leistungen umfassen ebenfalls den Versand, den Empfang
          sowie die Speicherung von E-Mails. Zu diesen Zwecken werden die
          Adressen der Empfänger sowie Absender als auch weitere Informationen
          betreffend den EMailversand (z. B. die beteiligten Provider) sowie die
          Inhalte der jeweiligen EMails verarbeitet. Die vorgenannten Daten
          können ferner zu Zwecken der Erkennung von SPAM verarbeitet werden.
          Wir bitten darum, zu beachten, dass E-Mails im Internet grundsätzlich
          nicht verschlüsselt versendet werden. Im Regelfall werden E-Mails zwar
          auf dem Transportweg verschlüsselt, aber (sofern kein sogenanntes
          Ende-zu-Ende-Verschlüsselungsverfahren eingesetzt wird) nicht auf den
          Servern, von denen sie abgesendet und empfangen werden. Wir können
          daher für den Übertragungsweg der E-Mails zwischen dem Absender und
          dem Empfang auf unserem Server keine Verantwortung übernehmen;
          Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f)
          DSGVO).
        </li>
        <li>
          Content-Delivery-Network: Wir setzen ein "Content-Delivery-Network"
          (CDN) ein. Ein CDN ist ein Dienst, mit dessen Hilfe Inhalte eines
          Onlineangebotes, insbesondere große Mediendateien, wie Grafiken oder
          Programm-Skripte, mit Hilfe regional verteilter und über das Internet
          verbundener Server schneller und sicherer ausgeliefert werden können;
          Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f)
          DSGVO).
        </li>
        <li>
          Hetzner: Leistungen auf dem Gebiet der Bereitstellung von
          informationstechnischer Infrastruktur und verbundenen Dienstleistungen
          (z. B. Speicherplatz und/oder Rechenkapazitäten); Dienstanbieter:
          Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen,
          Deutschland; Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1
          S. 1 lit. f) DSGVO); Website:{' '}
          <a
            href="https://www.hetzner.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.hetzner.com
          </a>
          ; Datenschutzerklärung:{' '}
          <a
            href="https://www.hetzner.com/de/rechtliches/datenschutz"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.hetzner.com/de/rechtliches/datenschutz
          </a>
          ; Auftragsverarbeitungsvertrag:{' '}
          <a
            href="https://docs.hetzner.com/de/general/general-terms-and-conditions/data-privacy-faq/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://docs.hetzner.com/de/general/general-terms-and-conditions/data-privacy-faq/
          </a>
        </li>
        <li>
          STRATO: Leistungen auf dem Gebiet der Bereitstellung von
          informationstechnischer Infrastruktur und verbundenen Dienstleistungen
          (z. B. Speicherplatz und/oder Rechenkapazitäten); Dienstanbieter:
          STRATO AG, Pascalstraße 10,10587 Berlin, Deutschland;
          Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f)
          DSGVO); Website:{' '}
          <a
            href="https://www.strato.de"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.strato.de
          </a>
          ; Datenschutzerklärung:{' '}
          <a
            href="https://www.strato.de/datenschutz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.strato.de/datenschutz/
          </a>
          ; Auftragsverarbeitungsvertrag: bereitgestellt.
        </li>
        <li>
          bunny.net: Content-Delivery-Network (CDN) - Dienst, mit dessen Hilfe
          Inhalte eines Onlineangebotes, insbesondere große Mediendateien, wie
          Grafiken oder Programm-Skripte mit Hilfe regional verteilter und über
          das Internet verbundener Server, schneller und sicherer ausgeliefert
          werden können; Dienstanbieter: BUNNYWAY d.o.o., Cesta komandanta
          Staneta 4A, 1215 Medvode, Slowenien; Rechtsgrundlagen: Berechtigte
          Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO); Website:
          <a href="https://bunny.net" target="_blank" rel="noopener noreferrer">
            https://bunny.net
          </a>
          ; Datenschutzerklärung:{' '}
          <a
            href="https://bunny.net/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://bunny.net/privacy/
          </a>
          . Auftragsverarbeitungsvertrag: Wird vom Dienstanbieter
          bereitgestellt.
        </li>
      </ul>

      <h2>Einsatz von Cookies</h2>
      <p>
        Unter dem Begriff „Cookies" werden Funktionen, die Informationen auf
        Endgeräten der Nutzer speichern und aus ihnen auslesen, verstanden.
        Cookies können ferner in Bezug auf unterschiedliche Anliegen Einsatz
        finden, etwa zu Zwecken der Funktionsfähigkeit, der Sicherheit und des
        Komforts von Onlineangeboten sowie der Erstellung von Analysen der
        Besucherströme. Wir verwenden Cookies gemäß den gesetzlichen
        Vorschriften. Dazu holen wir, wenn erforderlich, vorab die Zustimmung
        der Nutzer ein. Ist eine Zustimmung nicht notwendig, setzen wir auf
        unsere berechtigten Interessen. Dies gilt, wenn das Speichern und
        Auslesen von Informationen unerlässlich ist, um ausdrücklich
        angeforderte Inhalte und Funktionen bereitstellen zu können. Dazu zählen
        etwa die Speicherung von Einstellungen sowie die Sicherstellung der
        Funktionalität und Sicherheit unseres Onlineangebots. Die Einwilligung
        kann jederzeit widerrufen werden. Wir informieren klar über deren Umfang
        und welche Cookies genutzt werden.
      </p>

      <p>
        Hinweise zu datenschutzrechtlichen Rechtsgrundlagen: Ob wir
        personenbezogene Daten mithilfe von Cookies verarbeiten, hängt von einer
        Einwilligung ab. Liegt eine Einwilligung vor, dient sie als
        Rechtsgrundlage. Ohne Einwilligung stützen wir uns auf unsere
        berechtigten Interessen, die vorstehend in diesem Abschnitt und im
        Kontext der jeweiligen Dienste und Verfahren erläutert sind.
      </p>
      <p>
        Speicherdauer: Im Hinblick auf die Speicherdauer werden die folgenden
        Arten von Cookies unterschieden:
      </p>
      <ul>
        <li>
          Temporäre Cookies (auch: Session- oder Sitzungscookies): Temporäre
          Cookies werden spätestens gelöscht, nachdem ein Nutzer ein
          Onlineangebot verlassen und sein Endgerät (z. B. Browser oder mobile
          Applikation) geschlossen hat.
        </li>
        <li>
          Permanente Cookies: Permanente Cookies bleiben auch nach dem Schließen
          des Endgeräts gespeichert. So können beispielsweise der Log-inStatus
          gespeichert und bevorzugte Inhalte direkt angezeigt werden, wenn der
          Nutzer eine Website erneut besucht. Ebenso können die mithilfe von
          Cookies erhobenen Nutzerdaten zur Reichweitenmessung Verwendung
          finden. Sofern wir Nutzern keine expliziten Angaben zur Art und
          Speicherdauer von Cookies mitteilen (z. B. im Rahmen der Einholung der
          Einwilligung), sollten sie davon ausgehen, dass diese permanent sind
          und die Speicherdauer bis zu zwei Jahre betragen kann.
        </li>
      </ul>
      <p>
        Allgemeine Hinweise zum Widerruf und Widerspruch (Opt-out): Nutzer
        können die von ihnen abgegebenen Einwilligungen jederzeit widerrufen und
        zudem einen Widerspruch gegen die Verarbeitung entsprechend den
        gesetzlichen Vorgaben, auch mittels der Privatsphäre-Einstellungen ihres
        Browsers, erklären.
      </p>

      <ul>
        <li>
          Verarbeitete Datenarten: Meta-, Kommunikations- und Verfahrensdaten
          (z. B. IP-Adressen, Zeitangaben, Identifikationsnummern, beteiligte
          Personen).
        </li>
        <li>
          Betroffene Personen: Nutzer (z. B. Webseitenbesucher, Nutzer von
          Onlinediensten).
        </li>
        <li>
          Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f)
          DSGVO).
        </li>
      </ul>

      <h3>
        Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:{' '}
      </h3>

      <ul>
        <li>
          Cookiebot: Einwilligungsmanagement: Verfahren zur Einholung,
          Protokollierung, Verwaltung und des Widerrufs von Einwilligungen,
          insbesondere für den Einsatz von Cookies und ähnlichen Technologien
          zur Speicherung, Auslesen und Verarbeitung von Informationen auf
          Endgeräten der Nutzer sowie deren Verarbeitung; Dienstanbieter:
          Usercentrics A/S, Havnegade 39, 1058 Kopenhagen, Dänemark; Website:
          <a
            href="https://www.cookiebot.com/de"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.cookiebot.com/de
          </a>
          ; Datenschutzerklärung:{' '}
          <a
            href="https://www.cookiebot.com/de/privacy-policy/;
"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.cookiebot.com/de/privacy-policy/
          </a>
          ; Auftragsverarbeitungsvertrag: Wird vom Dienstanbieter
          bereitgestellt; Weitere Informationen: Gespeicherte Daten (auf dem
          Server des Dienstleisters): Die IP-Nummer des Nutzers in
          anonymisierter Form (die letzten drei Ziffern werden auf 0 gesetzt),
          Datum und Uhrzeit der Zustimmung, Browserangaben, die URL, von der die
          Zustimmung gesendet wurde, Ein anonymer, zufälliger und
          verschlüsselter Schlüsselwert. der Einwilligungsstatus des Nutzers.
        </li>
      </ul>
      <PrivacyPolicyTwo />
      <PrivacyPolicyThree />
    </div>
  );
};

export default withPageShell(PrivacyPolicy);
