import React, { useState } from "react";

// ---------- Données du quiz ----------
const QUESTIONS = [
  {
    id: "statut",
    label: "Votre statut",
    options: [
      { value: "auto", label: "Auto-entrepreneur / micro-entreprise" },
      { value: "tpe", label: "TPE (SASU, EURL, SARL...)" },
      { value: "pme", label: "PME avec salariés" },
    ],
  },
  {
    id: "volume",
    label: "Factures émises par mois",
    options: [
      { value: "faible", label: "Moins de 10" },
      { value: "moyen", label: "Entre 10 et 50" },
      { value: "fort", label: "Plus de 50" },
    ],
  },
  {
    id: "outil",
    label: "Votre outil actuel",
    options: [
      { value: "rien", label: "Excel, Word, ou papier" },
      { value: "basique", label: "Un logiciel de facturation simple" },
      { value: "complet", label: "Un logiciel comptable complet" },
    ],
  },
  {
    id: "compta",
    label: "Avez-vous un expert-comptable ?",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
    ],
  },
  {
    id: "besoin",
    label: "Ce que vous recherchez avant tout",
    options: [
      { value: "simple", label: "Être en conformité, simplement" },
      { value: "temps", label: "Gagner du temps sur toute la gestion" },
      { value: "tresorerie", label: "Une vue complète sur ma trésorerie" },
    ],
  },
];

// ---------- Logique de recommandation ----------
function recommander(reponses) {
  const { statut, volume, outil, compta, besoin } = reponses;

  if (besoin === "tresorerie" || (compta === "oui" && statut !== "auto" && volume === "fort")) {
    return {
      nom: "Pennylane",
      lien: "#lien-affilie-pennylane",
      raison:
        "Vous avez besoin d'une vue d'ensemble sur votre trésorerie et travaillez avec un expert-comptable. Pennylane couvre la facturation, la comptabilité et le pilotage financier dans un seul outil, avec une collaboration fluide avec votre cabinet.",
    };
  }

  if (statut === "auto" && (volume === "faible" || outil === "rien") && besoin !== "temps") {
    return {
      nom: "Abby",
      lien: "#lien-affilie-abby",
      raison:
        "En tant qu'auto-entrepreneur avec un faible volume de factures, vous avez surtout besoin d'un outil simple et rapide à mettre en place. Abby est pensé pour les micro-entrepreneurs : prise en main immédiate, sans complexité inutile.",
    };
  }

  return {
    nom: "Indy",
    lien: "#lien-affilie-indy",
    raison:
      "Pour gagner du temps sur l'ensemble de votre gestion (devis, factures, relances) sans vous noyer dans des fonctionnalités superflues, Indy offre un bon équilibre entre simplicité et complétude.",
  };
}

// ---------- Échéances réglementaires ----------
function echeances(statut) {
  if (statut === "pme") {
    return {
      reception: "1er septembre 2026",
      emission: "1er septembre 2026",
      note: "En tant que PME, vous êtes concerné par les deux obligations dès la même date.",
    };
  }
  return {
    reception: "1er septembre 2026",
    emission: "1er septembre 2027",
    note: "Vous devez pouvoir recevoir des factures électroniques dès 2026, et en émettre vous-même à partir de 2027.",
  };
}

// ---------- Composant principal ----------
export default function DiagnosticFacturation() {
  const [step, setStep] = useState(0);
  const [reponses, setReponses] = useState({});
  const [termine, setTermine] = useState(false);

  const total = QUESTIONS.length;
  const question = QUESTIONS[step];
  const progress = Math.round((step / total) * 100);

  function repondre(value) {
    const next = { ...reponses, [question.id]: value };
    setReponses(next);
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      setTermine(true);
    }
  }

  function recommencer() {
    setReponses({});
    setStep(0);
    setTermine(false);
  }

  return (
    <div className="diag-root">
      <style>{STYLES}</style>

      <header className="diag-header">
        <div className="diag-eyebrow">Diagnostic gratuit · 2 minutes</div>
        <h1 className="diag-title">
          Facturation électronique&nbsp;: <span className="diag-title-accent">êtes-vous prêt&nbsp;?</span>
        </h1>
        <p className="diag-sub">
          Répondez à 5 questions simples pour savoir ce qui change pour vous,
          à partir de quelle date, et quel outil correspond à votre situation.
        </p>
      </header>

      <main className="diag-card">
        {!termine ? (
          <>
            <div className="diag-progress-track">
              <div className="diag-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="diag-step-label">
              Question {step + 1} / {total}
            </div>

            <h2 className="diag-question">{question.label}</h2>

            <div className="diag-options">
              {question.options.map((opt) => (
                <button
                  key={opt.value}
                  className="diag-option"
                  onClick={() => repondre(opt.value)}
                >
                  <span>{opt.label}</span>
                  <span className="diag-arrow" aria-hidden="true">→</span>
                </button>
              ))}
            </div>

            {step > 0 && (
              <button className="diag-back" onClick={() => setStep(step - 1)}>
                ← Question précédente
              </button>
            )}
          </>
        ) : (
          <Resultat reponses={reponses} onRestart={recommencer} />
        )}
      </main>

      <footer className="diag-footer">
        Basé sur le calendrier officiel de la réforme de facturation électronique
        (DGFiP). Ce diagnostic donne une orientation générale et ne remplace pas
        l'avis de votre expert-comptable.
      </footer>
    </div>
  );
}

// ---------- Page de résultat ----------
function Resultat({ reponses, onRestart }) {
  const reco = recommander(reponses);
  const dates = echeances(reponses.statut);

  const statutLabel = {
    auto: "auto-entrepreneur",
    tpe: "TPE",
    pme: "PME",
  }[reponses.statut];

  return (
    <div className="diag-result">
      <div className="diag-stamp">Diagnostic terminé</div>

      <h2 className="diag-result-title">Votre situation, en clair</h2>
      <p className="diag-result-text">
        En tant que <strong>{statutLabel}</strong>, voici les deux dates à retenir&nbsp;:
      </p>

      <div className="diag-dates">
        <div className="diag-date-box">
          <div className="diag-date-label">Recevoir des factures électroniques</div>
          <div className="diag-date-value">{dates.reception}</div>
        </div>
        <div className="diag-date-box">
          <div className="diag-date-label">Émettre des factures électroniques</div>
          <div className="diag-date-value">{dates.emission}</div>
        </div>
      </div>
      <p className="diag-note">{dates.note}</p>

      <div className="diag-divider" />

      <h2 className="diag-result-title">Notre recommandation</h2>
      <div className="diag-reco-card">
        <div className="diag-reco-name">{reco.nom}</div>
        <p className="diag-reco-text">{reco.raison}</p>
        <a className="diag-cta" href={reco.lien}>
          Découvrir {reco.nom}
        </a>
      </div>

      <div className="diag-alt">
        <strong>Petit volume de factures&nbsp;?</strong> Si vous émettez très peu
        de factures par mois, le portail public de facturation (gratuit) peut
        aussi suffire. Les outils ci-dessus offrent en plus l'automatisation,
        les relances et le suivi.
      </div>

      <button className="diag-restart" onClick={onRestart}>
        Refaire le diagnostic
      </button>
    </div>
  );
}

// ---------- Styles ----------
const STYLES = `
:root {
  --diag-cream: #FAF6F0;
  --diag-paper: #F1EBE2;
  --diag-ink: #1F2D3D;
  --diag-ink-soft: #4A5A6B;
  --diag-accent: #C75D3C;
  --diag-accent-soft: #F3DDD3;
  --diag-green: #5A8A6E;
  --diag-green-soft: #E1ECE4;
  --diag-line: #E0D8CC;
}

.diag-root {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--diag-cream);
  color: var(--diag-ink);
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px 32px;
  box-sizing: border-box;
}

.diag-header {
  max-width: 560px;
  text-align: center;
  margin-bottom: 32px;
}

.diag-eyebrow {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--diag-accent);
  margin-bottom: 12px;
}

.diag-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 600;
  line-height: 1.15;
  margin: 0 0 12px;
  color: var(--diag-ink);
}

.diag-title-accent {
  color: var(--diag-accent);
  font-style: italic;
}

.diag-sub {
  font-size: 16px;
  line-height: 1.6;
  color: var(--diag-ink-soft);
  margin: 0;
}

.diag-card {
  width: 100%;
  max-width: 560px;
  background: #FFFFFF;
  border: 1px solid var(--diag-line);
  border-radius: 20px;
  padding: 36px;
  box-shadow: 0 1px 3px rgba(31, 45, 61, 0.04);
  box-sizing: border-box;
}

.diag-progress-track {
  width: 100%;
  height: 6px;
  background: var(--diag-paper);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 16px;
}

.diag-progress-fill {
  height: 100%;
  background: var(--diag-accent);
  border-radius: 999px;
  transition: width 0.35s ease;
}

.diag-step-label {
  font-size: 13px;
  color: var(--diag-ink-soft);
  font-weight: 500;
  letter-spacing: 0.03em;
  margin-bottom: 8px;
}

.diag-question {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 24px;
  line-height: 1.3;
}

.diag-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.diag-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 16px 18px;
  border: 1px solid var(--diag-line);
  border-radius: 12px;
  background: var(--diag-cream);
  color: var(--diag-ink);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.1s ease;
  font-family: inherit;
}

.diag-option:hover {
  border-color: var(--diag-accent);
  background: #FFFFFF;
}

.diag-option:active {
  transform: scale(0.99);
}

.diag-option:focus-visible {
  outline: 2px solid var(--diag-accent);
  outline-offset: 2px;
}

.diag-arrow {
  color: var(--diag-accent);
  font-size: 16px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.diag-option:hover .diag-arrow {
  opacity: 1;
}

.diag-back {
  margin-top: 20px;
  background: none;
  border: none;
  color: var(--diag-ink-soft);
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  padding: 4px 0;
}

.diag-back:hover {
  color: var(--diag-ink);
}

/* ---------- Résultat ---------- */
.diag-result {
  display: flex;
  flex-direction: column;
}

.diag-stamp {
  display: inline-block;
  align-self: flex-start;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--diag-green);
  border: 1.5px solid var(--diag-green);
  border-radius: 999px;
  padding: 5px 14px;
  margin-bottom: 20px;
  transform: rotate(-2deg);
}

.diag-result-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 21px;
  font-weight: 600;
  margin: 0 0 12px;
}

.diag-result-text {
  font-size: 15px;
  line-height: 1.6;
  color: var(--diag-ink-soft);
  margin: 0 0 18px;
}

.diag-dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 10px;
}

.diag-date-box {
  background: var(--diag-paper);
  border-radius: 12px;
  padding: 16px;
}

.diag-date-label {
  font-size: 12.5px;
  color: var(--diag-ink-soft);
  margin-bottom: 6px;
  line-height: 1.4;
}

.diag-date-value {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--diag-ink);
}

.diag-note {
  font-size: 13.5px;
  color: var(--diag-ink-soft);
  line-height: 1.5;
  margin: 0;
}

.diag-divider {
  height: 1px;
  background: var(--diag-line);
  margin: 28px 0;
}

.diag-reco-card {
  background: var(--diag-green-soft);
  border-radius: 14px;
  padding: 22px;
}

.diag-reco-name {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--diag-ink);
  margin-bottom: 8px;
}

.diag-reco-text {
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--diag-ink-soft);
  margin: 0 0 16px;
}

.diag-cta {
  display: inline-block;
  background: var(--diag-ink);
  color: #FFFFFF;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 22px;
  border-radius: 10px;
  transition: background 0.15s ease;
}

.diag-cta:hover {
  background: var(--diag-accent);
}

.diag-alt {
  margin-top: 18px;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--diag-ink-soft);
  background: var(--diag-paper);
  border-radius: 12px;
  padding: 14px 16px;
}

.diag-restart {
  align-self: center;
  margin-top: 24px;
  background: none;
  border: 1px solid var(--diag-line);
  border-radius: 999px;
  padding: 10px 22px;
  font-size: 13.5px;
  color: var(--diag-ink-soft);
  cursor: pointer;
  font-family: inherit;
}

.diag-restart:hover {
  border-color: var(--diag-ink);
  color: var(--diag-ink);
}

.diag-footer {
  max-width: 560px;
  text-align: center;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--diag-ink-soft);
  margin-top: 28px;
  opacity: 0.8;
}

@media (max-width: 480px) {
  .diag-card { padding: 24px; }
  .diag-dates { grid-template-columns: 1fr; }
}
`;
