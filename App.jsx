import { useState, useEffect, useMemo } from "react";
import { ArrowRight, ArrowLeft, Copy, Check, FileText, ClipboardList, RotateCcw } from "lucide-react";

const INK = "#17233D";
const INK_SOFT = "#3B4A66";
const PAPER = "#F6F3EC";
const GOLD = "#B8863C";
const GOLD_SOFT = "#DDBD84";

const REDENEN = ["Stage", "Minor / uitwisseling", "Vrijwilligerswerk in het buitenland", "Overig"];

const STEPS = [
  { n: 1, label: "Gegevens" },
  { n: 2, label: "Toestemmingsbrief" },
  { n: 3, label: "Modelcontract" },
];

function formatDatumNL(isoDate) {
  if (!isoDate) return "[datum]";
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d)) return isoDate;
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

function vandaag() {
  return new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

function Field({ label, children, required }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5" style={{ color: INK }}>
        {label} {required && <span style={{ color: GOLD }}>*</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full border rounded-sm px-3.5 py-2.5 bg-white text-sm outline-none transition-colors";

export default function SubletShieldWizard() {
  const [step, setStep] = useState(1);
  const [letterText, setLetterText] = useState("");
  const [contractText, setContractText] = useState("");
  const [copied, setCopied] = useState({ letter: false, contract: false });

  const [form, setForm] = useState({
    studentNaam: "",
    studentEmail: "",
    studentAdres: "",
    studentPostcode: "",
    studentPlaats: "",
    contractnummer: "",
    verhuurderNaam: "",
    startdatum: "",
    einddatum: "",
    reden: REDENEN[0],
    onderhuurderNaam: "",
    onderhuurderEmail: "",
    onderhuurderTelefoon: "",
    onderhuurderWoonplaats: "",
  });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const requiredOk =
    form.studentNaam.trim() &&
    form.studentAdres.trim() &&
    form.studentPostcode.trim() &&
    form.studentPlaats.trim() &&
    form.verhuurderNaam.trim() &&
    form.startdatum &&
    form.einddatum &&
    form.onderhuurderNaam.trim() &&
    form.onderhuurderEmail.trim();

  const generateLetter = useMemo(
    () => () => {
      const f = form;
      return `${f.studentPlaats || "[plaats]"}, ${vandaag()}

Betreft: Verzoek om toestemming voor onderhuur (huisbewaring)
${f.contractnummer ? `Huurcontractnummer: ${f.contractnummer}` : ""}

Geachte heer/mevrouw,

Hierbij verzoek ik u toestemming te verlenen voor tijdelijke onderhuur van de door mij gehuurde woonruimte aan ${f.studentAdres || "[adres]"}, ${f.studentPostcode || "[postcode]"} ${f.studentPlaats || "[plaats]"}, op grond van artikel 7:244 van het Burgerlijk Wetboek.

Ik ben van ${formatDatumNL(f.startdatum)} tot ${formatDatumNL(f.einddatum)} afwezig in verband met ${f.reden.toLowerCase()} in het buitenland. Om leegstand en de daaraan verbonden risico's te voorkomen, wil ik de woning gedurende deze periode in bewaring geven aan een door mij gekozen huisbewaarder.

Gegevens huisbewaarder:
Naam: ${f.onderhuurderNaam || "[naam]"}
E-mail: ${f.onderhuurderEmail || "[e-mail]"}
${f.onderhuurderTelefoon ? `Telefoon: ${f.onderhuurderTelefoon}` : ""}
${f.onderhuurderWoonplaats ? `Huidige woonplaats: ${f.onderhuurderWoonplaats}` : ""}

De huisbewaarder zal uitsluitend de woning bewonen gedurende bovengenoemde periode en zal deze bij mijn terugkomst in de oorspronkelijke staat opleveren. Ik blijf zelf volledig verantwoordelijk voor de huurbetalingen en alle overige verplichtingen uit de huurovereenkomst, en zal geen huurpenningen vragen aan de huisbewaarder anders dan een gebruikelijke kostenbijdrage.

Graag verneem ik of u met dit verzoek akkoord kunt gaan. Ik ben uiteraard bereid aanvullende informatie te verstrekken indien gewenst.

Met vriendelijke groet,


${f.studentNaam || "[naam student]"}
${f.studentAdres || "[adres]"}
${f.studentPostcode || ""} ${f.studentPlaats || ""}
${f.studentEmail || "[e-mail]"}`;
    },
    [form]
  );

  const generateContract = useMemo(
    () => () => {
      const f = form;
      return `CONCEPT MODELCONTRACT HUISBEWARING
(dit is een concept — laat het contract altijd nakijken door een juridisch adviseur voordat het wordt ondertekend)

Ondergetekenden:

1. ${f.studentNaam || "[naam student]"}, wonende aan ${f.studentAdres || "[adres]"}, ${f.studentPostcode || ""} ${f.studentPlaats || ""}, hierna te noemen "Hoofdhuurder";

2. ${f.onderhuurderNaam || "[naam huisbewaarder]"}, ${f.onderhuurderWoonplaats ? `wonende te ${f.onderhuurderWoonplaats}` : "[woonplaats]"}, hierna te noemen "Huisbewaarder";

komen het volgende overeen:

Artikel 1 — Object
Huisbewaarder verblijft gedurende de hierna genoemde periode in de woning gelegen aan ${f.studentAdres || "[adres]"}, ${f.studentPostcode || ""} ${f.studentPlaats || ""}, met toestemming van ${f.verhuurderNaam || "[naam verhuurder/corporatie]"}.

Artikel 2 — Duur
Deze overeenkomst vangt aan op ${formatDatumNL(f.startdatum)} en eindigt van rechtswege op ${formatDatumNL(f.einddatum)}, zonder dat voorafgaande opzegging is vereist.

Artikel 3 — Vergoeding en borg
Huisbewaarder betaalt aan Hoofdhuurder een kostenbijdrage van € [in te vullen] per maand, alsmede een borgsom van € [in te vullen], te voldoen vóór aanvang van de bewaringsperiode. De borg wordt na afloop, onder aftrek van eventuele schade, geretourneerd.

Artikel 4 — Verplichtingen Huisbewaarder
— zorgvuldig gebruik van de woning en de aanwezige inboedel;
— geen wijzigingen aan de woning aanbrengen zonder voorafgaande toestemming van Hoofdhuurder;
— geen onderverhuur of overdracht van de woning aan derden;
— de woning bij het einde van deze overeenkomst schoon en in de oorspronkelijke staat opleveren.

Artikel 5 — Beëindiging
Deze overeenkomst eindigt automatisch op de in Artikel 2 genoemde einddatum. Tussentijdse beëindiging is alleen mogelijk met wederzijds goedvinden van beide partijen.

Artikel 6 — Aansprakelijkheid
Huisbewaarder is aansprakelijk voor schade aan de woning of inboedel die ontstaat tijdens de bewaringsperiode, met uitzondering van normale slijtage.

Artikel 7 — Overig
Deze overeenkomst is geen huurovereenkomst in de zin van het Burgerlijk Wetboek en verleent Huisbewaarder geen huurbescherming.

Aldus overeengekomen en in tweevoud ondertekend te ${f.studentPlaats || "[plaats]"}, op ${vandaag()}.


Hoofdhuurder                              Huisbewaarder


_____________________                     _____________________
${f.studentNaam || "[naam student]"}                             ${f.onderhuurderNaam || "[naam huisbewaarder]"}`;
    },
    [form]
  );

  useEffect(() => {
    if (step === 2 && !letterText) setLetterText(generateLetter());
    if (step === 3 && !contractText) setContractText(generateContract());
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied((c) => ({ ...c, [key]: true }));
      setTimeout(() => setCopied((c) => ({ ...c, [key]: false })), 2000);
    } catch {
      setCopied((c) => ({ ...c, [key]: false }));
    }
  };

  return (
    <div className="min-h-full w-full flex justify-center p-4 sm:p-8" style={{ backgroundColor: PAPER }}>
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold" style={{ color: INK }}>
            SubletShield — toestemming &amp; contract
          </h1>
          <p className="text-sm mt-1" style={{ color: INK_SOFT }}>
            Vul je gegevens één keer in en krijg direct een toestemmingsbrief en een concept-huurovereenkomst.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors"
                  style={{
                    borderColor: step >= s.n ? GOLD : "#D8D3C6",
                    backgroundColor: step >= s.n ? GOLD : "white",
                    color: step >= s.n ? "white" : INK_SOFT,
                  }}
                >
                  {step > s.n ? <Check size={16} /> : s.n}
                </div>
                <span
                  className="mt-2 text-xs whitespace-nowrap"
                  style={{ color: step >= s.n ? INK : INK_SOFT }}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-2 mb-5"
                  style={{ backgroundColor: step > s.n ? GOLD : "#D8D3C6" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="bg-white border rounded-sm p-6 sm:p-8" style={{ borderColor: "#D8D3C6" }}>
            <h2 className="text-lg font-semibold mb-1" style={{ color: INK }}>
              Jouw gegevens
            </h2>
            <p className="text-sm mb-6" style={{ color: INK_SOFT }}>
              Deze gegevens gebruiken we voor zowel de toestemmingsbrief als het modelcontract.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Naam" required>
                <input className={inputClass} style={{ borderColor: "#D8D3C6" }} value={form.studentNaam} onChange={update("studentNaam")} placeholder="Voor- en achternaam" />
              </Field>
              <Field label="E-mail">
                <input type="email" className={inputClass} style={{ borderColor: "#D8D3C6" }} value={form.studentEmail} onChange={update("studentEmail")} placeholder="jij@student.nl" />
              </Field>
              <Field label="Adres (straat + huisnummer)" required>
                <input className={inputClass} style={{ borderColor: "#D8D3C6" }} value={form.studentAdres} onChange={update("studentAdres")} placeholder="Studentenlaan 12" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Postcode" required>
                  <input className={inputClass} style={{ borderColor: "#D8D3C6" }} value={form.studentPostcode} onChange={update("studentPostcode")} placeholder="3011 AB" />
                </Field>
                <Field label="Plaats" required>
                  <input className={inputClass} style={{ borderColor: "#D8D3C6" }} value={form.studentPlaats} onChange={update("studentPlaats")} placeholder="Rotterdam" />
                </Field>
              </div>
              <Field label="Huurcontractnummer">
                <input className={inputClass} style={{ borderColor: "#D8D3C6" }} value={form.contractnummer} onChange={update("contractnummer")} placeholder="Optioneel" />
              </Field>
              <Field label="Naam verhuurder / woningcorporatie" required>
                <input className={inputClass} style={{ borderColor: "#D8D3C6" }} value={form.verhuurderNaam} onChange={update("verhuurderNaam")} placeholder="Bijv. DUWO" />
              </Field>
              <Field label="Vertrekdatum" required>
                <input type="date" className={inputClass} style={{ borderColor: "#D8D3C6" }} value={form.startdatum} onChange={update("startdatum")} />
              </Field>
              <Field label="Terugkeerdatum" required>
                <input type="date" className={inputClass} style={{ borderColor: "#D8D3C6" }} value={form.einddatum} onChange={update("einddatum")} />
              </Field>
              <Field label="Reden van afwezigheid">
                <select className={inputClass} style={{ borderColor: "#D8D3C6" }} value={form.reden} onChange={update("reden")}>
                  {REDENEN.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="h-px my-7" style={{ backgroundColor: "#D8D3C6" }} />

            <h2 className="text-lg font-semibold mb-1" style={{ color: INK }}>
              Gegevens huisbewaarder
            </h2>
            <p className="text-sm mb-6" style={{ color: INK_SOFT }}>
              Degene die tijdens jouw afwezigheid in de kamer of woning verblijft.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Naam" required>
                <input className={inputClass} style={{ borderColor: "#D8D3C6" }} value={form.onderhuurderNaam} onChange={update("onderhuurderNaam")} placeholder="Voor- en achternaam" />
              </Field>
              <Field label="E-mail" required>
                <input type="email" className={inputClass} style={{ borderColor: "#D8D3C6" }} value={form.onderhuurderEmail} onChange={update("onderhuurderEmail")} placeholder="naam@voorbeeld.com" />
              </Field>
              <Field label="Telefoon">
                <input className={inputClass} style={{ borderColor: "#D8D3C6" }} value={form.onderhuurderTelefoon} onChange={update("onderhuurderTelefoon")} placeholder="Optioneel" />
              </Field>
              <Field label="Huidige woonplaats">
                <input className={inputClass} style={{ borderColor: "#D8D3C6" }} value={form.onderhuurderWoonplaats} onChange={update("onderhuurderWoonplaats")} placeholder="Optioneel" />
              </Field>
            </div>

            <div className="flex justify-end mt-8">
              <button
                disabled={!requiredOk}
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: GOLD, color: "white" }}
              >
                Genereer toestemmingsbrief <ArrowRight size={16} />
              </button>
            </div>
            {!requiredOk && (
              <p className="text-xs mt-3 text-right" style={{ color: INK_SOFT }}>
                Vul de velden met * in om verder te gaan.
              </p>
            )}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <DocumentPanel
            icon={<FileText size={18} />}
            title="Toestemmingsbrief"
            description="Kant-en-klaar om te versturen naar je woningcorporatie of huisbaas. Je kunt de tekst nog aanpassen voordat je hem kopieert."
            text={letterText}
            onChange={setLetterText}
            onRegenerate={() => setLetterText(generateLetter())}
            onCopy={() => copyToClipboard(letterText, "letter")}
            copied={copied.letter}
          >
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium"
                style={{ color: INK_SOFT, border: "1px solid #D8D3C6" }}
              >
                <ArrowLeft size={16} /> Vorige
              </button>
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm font-semibold text-sm"
                style={{ backgroundColor: GOLD, color: "white" }}
              >
                Genereer modelcontract <ArrowRight size={16} />
              </button>
            </div>
          </DocumentPanel>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <DocumentPanel
            icon={<ClipboardList size={18} />}
            title="Concept-huurovereenkomst"
            description="Modelcontract Huisbewaring op basis van jouw gegevens. Laat dit altijd controleren voordat het wordt ondertekend."
            text={contractText}
            onChange={setContractText}
            onRegenerate={() => setContractText(generateContract())}
            onCopy={() => copyToClipboard(contractText, "contract")}
            copied={copied.contract}
          >
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium"
                style={{ color: INK_SOFT, border: "1px solid #D8D3C6" }}
              >
                <ArrowLeft size={16} /> Vorige
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setLetterText("");
                  setContractText("");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium"
                style={{ color: INK, border: `1px solid ${GOLD}` }}
              >
                <RotateCcw size={16} /> Nieuwe aanvraag starten
              </button>
            </div>
          </DocumentPanel>
        )}
      </div>
    </div>
  );
}

function DocumentPanel({ icon, title, description, text, onChange, onRegenerate, onCopy, copied, children }) {
  return (
    <div className="bg-white border rounded-sm p-6 sm:p-8" style={{ borderColor: "#D8D3C6" }}>
      <div className="flex items-start justify-between gap-4 mb-1">
        <div className="flex items-center gap-2" style={{ color: INK }}>
          {icon}
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onRegenerate}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-medium"
            style={{ color: INK_SOFT, border: "1px solid #D8D3C6" }}
            title="Opnieuw genereren op basis van stap 1"
          >
            <RotateCcw size={14} /> Opnieuw genereren
          </button>
          <button
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-semibold"
            style={{ backgroundColor: copied ? "#33493C" : GOLD, color: "white" }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Gekopieerd" : "Kopiëren"}
          </button>
        </div>
      </div>
      <p className="text-sm mb-4" style={{ color: INK_SOFT }}>
        {description}
      </p>

      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        rows={16}
        className="w-full border rounded-sm p-4 text-sm leading-relaxed font-mono resize-y outline-none"
        style={{ borderColor: "#D8D3C6", color: INK, backgroundColor: PAPER }}
      />

      {children}
    </div>
  );
}
