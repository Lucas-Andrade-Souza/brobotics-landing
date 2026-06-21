import React, { useState, useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Brobotics — landing page de divulgação / lista de espera
//
// Direção de design:
//  - Paleta "painel industrial": fundo quase-preto azulado, âmbar de
//    sinalização (botão de emergência / atenção em CNC) como accent
//    primário, verde-fósforo de osciloscópio como accent secundário de
//    dados/status.
//  - Tipografia: mono condensada para coordenadas/headline curtas (HMI),
//    sans neutra para corpo, mono pequena uppercase para labels de eixo.
//  - Assinatura: painel de juntas J1–J6 ao vivo no hero, réplica
//    estilizada do painel de controle real do app, "respirando" em idle.
// ---------------------------------------------------------------------------

const SCREENSHOTS = [
  {
    src: "/screenshots/pontos.webp",
    title: "Painel de pontos",
    desc: "Cinemática direta e inversa com cálculo de juntas e biblioteca de posições salvas.",
  },
  {
    src: "/screenshots/workspace.webp",
    title: "Workspace de projetos",
    desc: "Projetos, cenas e robôs organizados em painéis dockáveis — arraste um robô para a cena ativa.",
  },
  {
    src: "/screenshots/wizard-1-identificacao.webp",
    title: "Novo robô · identificação",
    desc: "Defina fabricante, modelo, payload, alcance e número de graus de liberdade.",
  },
  {
    src: "/screenshots/wizard-2-stls.webp",
    title: "Novo robô · importar STLs",
    desc: "Carregue os arquivos STL de cada link do robô com preview 3D instantâneo.",
  },
  {
    src: "/screenshots/wizard-3-links.webp",
    title: "Novo robô · montar links",
    desc: "Associe cada STL à sua junta e ajuste posição e rotação relativa em tempo real.",
  },
];

const JOINT_LABELS = ["J1", "J2", "J3", "J4", "J5", "J6"];

function useJointTelemetry() {
  const [angles, setAngles] = useState([12.4, -38.1, 64.7, 0.0, 52.3, -8.6]);
  const tRef = useRef(0);

  useEffect(() => {
    let raf;
    const speeds = [0.18, 0.13, 0.21, 0.09, 0.16, 0.24];
    const bases = [12.4, -38.1, 64.7, 0.0, 52.3, -8.6];
    const amps = [4.5, 3.2, 2.8, 6.1, 3.6, 5.4];
    const tick = () => {
      tRef.current += 0.016;
      setAngles(
        bases.map(
          (b, i) =>
            b + Math.sin(tRef.current * speeds[i] + i * 1.7) * amps[i]
        )
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return angles;
}

function JointPanel() {
  const angles = useJointTelemetry();
  return (
    <div className="joint-panel" aria-hidden="true">
      <div className="joint-panel__head">
        <span className="joint-panel__dot" />
        <span>TELEMETRIA · TEMPO REAL</span>
      </div>
      {JOINT_LABELS.map((label, i) => {
        const pct = ((angles[i] + 90) / 180) * 100;
        return (
          <div className="joint-row" key={label}>
            <span className="joint-row__label">{label}</span>
            <div className="joint-row__track">
              <div
                className="joint-row__fill"
                style={{ width: `${Math.max(2, Math.min(98, pct))}%` }}
              />
              <div
                className="joint-row__thumb"
                style={{ left: `${Math.max(2, Math.min(98, pct))}%` }}
              />
            </div>
            <span className="joint-row__value">
              {angles[i].toFixed(1)}°
            </span>
          </div>
        );
      })}
      <div className="joint-panel__coords">
        <div>
          <span className="coord-axis">X</span>
          <span className="coord-val">140.0</span>
        </div>
        <div>
          <span className="coord-axis">Y</span>
          <span className="coord-val">140.0</span>
        </div>
        <div>
          <span className="coord-axis">Z</span>
          <span className="coord-val">140.0</span>
        </div>
      </div>
    </div>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("integrador");
  const [status, setStatus] = useState("idle"); // idle | sent

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.includes("@")) return;
    // Sem backend conectado ainda — troque por uma chamada real
    // (Formspree, Resend, planilha via API, etc.) quando integrar.
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="waitlist waitlist--done">
        <p className="waitlist__done-title">Inscrição confirmada.</p>
        <p className="waitlist__done-sub">
          Você está na lista. Avisamos no seu e-mail assim que as vagas do
          acesso antecipado abrirem.
        </p>
      </div>
    );
  }

  return (
    <form className="waitlist" onSubmit={handleSubmit}>
      <div className="waitlist__row">
        <label className="sr-only" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Entrar na lista</button>
      </div>
      <div className="waitlist__roles">
        {[
          ["integrador", "Integrador de sistemas"],
          ["engenheiro", "Engenharia de automação"],
          ["maker", "Maker / pesquisa"],
          ["outro", "Outro"],
        ].map(([value, label]) => (
          <button
            type="button"
            key={value}
            className={
              "role-chip" + (role === value ? " role-chip--active" : "")
            }
            onClick={() => setRole(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </form>
  );
}

function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>;
}

function ProductShowcase() {
  const [active, setActive] = useState(0);
  const current = SCREENSHOTS[active];

  return (
    <div className="showcase">
      <div className="showcase__stage">
        <div className="showcase__stage-bar">
          <span className="showcase__dot showcase__dot--r" />
          <span className="showcase__dot showcase__dot--y" />
          <span className="showcase__dot showcase__dot--g" />
          <span className="showcase__stage-title">{current.title}</span>
        </div>
        <img
          className="showcase__img"
          src={current.src}
          alt={`Captura de tela do Brobotics — ${current.title}`}
        />
      </div>
      <p className="showcase__desc">{current.desc}</p>
      <div className="showcase__thumbs">
        {SCREENSHOTS.map((shot, i) => (
          <button
            key={shot.title}
            type="button"
            className={
              "showcase__thumb" +
              (i === active ? " showcase__thumb--active" : "")
            }
            onClick={() => setActive(i)}
            aria-label={shot.title}
          >
            <img src={shot.src} alt="" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function BroboticsLanding() {
  return (
    <div className="bro">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap');

        .bro {
          --bg-0: #0a0d11;
          --bg-1: #11151b;
          --bg-2: #161b22;
          --line: #232a33;
          --line-soft: #1a2028;
          --amber: #ff8a1f;
          --amber-dim: #8a4e16;
          --phosphor: #57e8a8;
          --phosphor-dim: #2c7d5a;
          --ink-0: #eef1f4;
          --ink-1: #9aa4b2;
          --ink-2: #5f6976;
          --font-mono: 'JetBrains Mono', ui-monospace, monospace;
          --font-sans: 'Inter', system-ui, sans-serif;

          background: var(--bg-0);
          color: var(--ink-0);
          font-family: var(--font-sans);
          min-height: 100vh;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }
        .bro * { box-sizing: border-box; }
        .bro a { color: inherit; }

        .sr-only {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }

        .bro .shell {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ---------- top bar ---------- */
        .topbar {
          border-bottom: 1px solid var(--line-soft);
          background: linear-gradient(180deg, var(--bg-0), rgba(10,13,17,0.6));
        }
        .topbar__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.02em;
        }
        .brand__mark {
          width: 22px; height: 22px;
          border: 1.5px solid var(--amber);
          position: relative;
          flex-shrink: 0;
        }
        .brand__mark::before, .brand__mark::after {
          content: "";
          position: absolute;
          background: var(--amber);
        }
        .brand__mark::before { width: 2px; height: 10px; left: 9px; top: 5px; }
        .brand__mark::after { width: 10px; height: 2px; top: 9px; left: 5px; }
        .topbar__status {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--ink-2);
          letter-spacing: 0.05em;
        }
        .pulse-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--phosphor);
          box-shadow: 0 0 0 0 rgba(87,232,168,0.5);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(87,232,168,0.45); }
          70% { box-shadow: 0 0 0 6px rgba(87,232,168,0); }
          100% { box-shadow: 0 0 0 0 rgba(87,232,168,0); }
        }

        /* ---------- hero ---------- */
        .hero {
          padding: 88px 0 96px;
          background-image:
            linear-gradient(var(--line-soft) 1px, transparent 1px),
            linear-gradient(90deg, var(--line-soft) 1px, transparent 1px);
          background-size: 56px 56px;
          background-position: center -1px;
          position: relative;
        }
        .hero::after {
          content: "";
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 55% at 50% 0%, rgba(10,13,17,0) 0%, var(--bg-0) 78%);
          pointer-events: none;
        }
        .hero__grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 56px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--amber);
          border: 1px solid var(--amber-dim);
          background: rgba(255,138,31,0.06);
          padding: 5px 10px;
          margin-bottom: 24px;
        }
        h1.headline {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 46px;
          line-height: 1.12;
          letter-spacing: -0.01em;
          margin: 0 0 22px;
          color: var(--ink-0);
        }
        h1.headline em {
          font-style: normal;
          color: var(--amber);
        }
        .lede {
          font-size: 17px;
          color: var(--ink-1);
          max-width: 50ch;
          margin: 0 0 36px;
        }
        .hero__cta { max-width: 480px; }

        .stack-tags {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin-top: 28px;
        }
        .stack-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.04em;
          color: var(--ink-2);
          border: 1px solid var(--line);
          padding: 4px 9px;
        }

        /* ---------- joint panel (signature element) ---------- */
        .joint-panel {
          background: var(--bg-1);
          border: 1px solid var(--line);
          padding: 18px 20px 22px;
        }
        .joint-panel__head {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.08em;
          color: var(--ink-2);
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--line-soft);
        }
        .joint-panel__dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--phosphor);
        }
        .joint-row {
          display: grid;
          grid-template-columns: 28px 1fr 56px;
          align-items: center;
          gap: 12px;
          margin-bottom: 11px;
        }
        .joint-row__label {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--ink-2);
        }
        .joint-row__track {
          position: relative;
          height: 3px;
          background: var(--line);
        }
        .joint-row__fill {
          position: absolute; top: 0; left: 0; bottom: 0;
          background: var(--phosphor-dim);
        }
        .joint-row__thumb {
          position: absolute; top: 50%;
          width: 9px; height: 9px;
          background: var(--phosphor);
          transform: translate(-50%, -50%);
        }
        .joint-row__value {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--ink-1);
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        .joint-panel__coords {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid var(--line-soft);
        }
        .coord-axis {
          display: block;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--amber-dim);
          letter-spacing: 0.06em;
        }
        .coord-val {
          display: block;
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--ink-0);
          font-variant-numeric: tabular-nums;
        }

        /* ---------- waitlist ---------- */
        .waitlist__row {
          display: flex;
          gap: 0;
          border: 1px solid var(--line);
        }
        .waitlist input[type="email"] {
          flex: 1;
          background: var(--bg-1);
          border: none;
          color: var(--ink-0);
          font-family: var(--font-sans);
          font-size: 14px;
          padding: 14px 16px;
          outline: none;
        }
        .waitlist input[type="email"]::placeholder { color: var(--ink-2); }
        .waitlist input[type="email"]:focus {
          box-shadow: inset 0 0 0 1.5px var(--amber);
        }
        .waitlist button[type="submit"] {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.03em;
          background: var(--amber);
          color: #1a0f02;
          border: none;
          padding: 0 22px;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s ease;
        }
        .waitlist button[type="submit"]:hover { background: #ffa14d; }

        .waitlist__roles {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin-top: 14px;
        }
        .role-chip {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--ink-1);
          background: transparent;
          border: 1px solid var(--line);
          padding: 6px 11px;
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .role-chip:hover { border-color: var(--ink-2); color: var(--ink-0); }
        .role-chip--active {
          border-color: var(--phosphor-dim);
          color: var(--phosphor);
          background: rgba(87,232,168,0.06);
        }

        .waitlist--done {
          border: 1px solid var(--phosphor-dim);
          background: rgba(87,232,168,0.05);
          padding: 18px 20px;
        }
        .waitlist__done-title {
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--phosphor);
          margin: 0 0 6px;
          font-size: 14px;
        }
        .waitlist__done-sub {
          margin: 0;
          font-size: 13.5px;
          color: var(--ink-1);
        }

        .form-note {
          font-size: 12px;
          color: var(--ink-2);
          margin-top: 10px;
        }

        /* ---------- sections ---------- */
        .section { padding: 88px 0; border-top: 1px solid var(--line-soft); }
        .section-label {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.1em;
          color: var(--amber);
          margin-bottom: 14px;
        }
        .section h2 {
          font-family: var(--font-mono);
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 16px;
          max-width: 26ch;
        }
        .section .section-lede {
          color: var(--ink-1);
          max-width: 60ch;
          font-size: 15.5px;
          margin: 0 0 48px;
        }

        /* feature grid */
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--line-soft);
          border: 1px solid var(--line-soft);
        }
        .feature-card {
          background: var(--bg-0);
          padding: 28px 26px;
        }
        .feature-card__index {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--ink-2);
          margin-bottom: 16px;
        }
        .feature-card h3 {
          font-size: 15.5px;
          font-weight: 600;
          margin: 0 0 10px;
          color: var(--ink-0);
        }
        .feature-card p {
          font-size: 13.5px;
          color: var(--ink-1);
          margin: 0;
          line-height: 1.6;
        }

        /* ---------- product showcase ---------- */
        .showcase__stage {
          border: 1px solid var(--line);
          background: var(--bg-1);
          overflow: hidden;
        }
        .showcase__stage-bar {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 14px;
          border-bottom: 1px solid var(--line-soft);
          background: var(--bg-2);
        }
        .showcase__dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--line);
        }
        .showcase__dot--r { background: #5a3a3a; }
        .showcase__dot--y { background: #5a4f30; }
        .showcase__dot--g { background: #345a44; }
        .showcase__stage-title {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--ink-2);
          margin-left: 8px;
          letter-spacing: 0.03em;
        }
        .showcase__img {
          display: block;
          width: 100%;
          height: auto;
        }
        .showcase__desc {
          font-size: 14px;
          color: var(--ink-1);
          max-width: 70ch;
          margin: 18px 0 20px;
        }
        .showcase__thumbs {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }
        .showcase__thumb {
          padding: 0;
          border: 1px solid var(--line);
          background: var(--bg-1);
          cursor: pointer;
          overflow: hidden;
          line-height: 0;
          opacity: 0.55;
          transition: opacity 0.15s ease, border-color 0.15s ease;
        }
        .showcase__thumb:hover { opacity: 0.85; }
        .showcase__thumb--active {
          opacity: 1;
          border-color: var(--amber);
        }
        .showcase__thumb img {
          display: block;
          width: 100%;
          height: auto;
        }

        /* pipeline / architecture strip */
        .pipeline {
          display: flex;
          align-items: stretch;
          border: 1px solid var(--line);
          background: var(--bg-1);
          overflow-x: auto;
        }
        .pipeline__node {
          flex: 1;
          min-width: 150px;
          padding: 20px 18px;
          border-right: 1px solid var(--line);
        }
        .pipeline__node:last-child { border-right: none; }
        .pipeline__node-label {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.06em;
          color: var(--phosphor);
          margin-bottom: 8px;
        }
        .pipeline__node-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 6px;
          color: var(--ink-0);
        }
        .pipeline__node-sub {
          font-size: 12px;
          color: var(--ink-2);
          line-height: 1.5;
        }

        /* protocol strip */
        .protocols {
          display: flex; flex-wrap: wrap; gap: 10px;
        }
        .protocol-chip {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--ink-1);
          border: 1px solid var(--line);
          padding: 8px 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .protocol-chip__dot {
          width: 5px; height: 5px;
          background: var(--ink-2);
        }
        .protocol-chip--primary {
          color: var(--amber);
          border-color: var(--amber-dim);
        }
        .protocol-chip--primary .protocol-chip__dot { background: var(--amber); }

        /* final cta */
        .final-cta {
          text-align: left;
          padding: 96px 0 100px;
          border-top: 1px solid var(--line-soft);
          background-image:
            linear-gradient(var(--line-soft) 1px, transparent 1px),
            linear-gradient(90deg, var(--line-soft) 1px, transparent 1px);
          background-size: 56px 56px;
        }
        .final-cta__inner { max-width: 560px; }
        .final-cta h2 { font-size: 30px; margin-bottom: 14px; }
        .final-cta .section-lede { margin-bottom: 36px; }

        /* footer */
        .footer {
          border-top: 1px solid var(--line-soft);
          padding: 28px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--ink-2);
          letter-spacing: 0.02em;
        }

        @media (max-width: 880px) {
          .hero__grid { grid-template-columns: 1fr; }
          .feature-grid { grid-template-columns: 1fr; }
          h1.headline { font-size: 34px; }
          .pipeline { flex-direction: column; }
          .pipeline__node { border-right: none; border-bottom: 1px solid var(--line); }
          .showcase__thumbs { grid-template-columns: repeat(3, 1fr); }
        }

        @media (prefers-reduced-motion: reduce) {
          .pulse-dot { animation: none; }
        }
      `}</style>

      <header className="topbar">
        <div className="shell topbar__inner">
          <div className="brand">
            <span className="brand__mark" />
            BROBOTICS
          </div>
          <div className="topbar__status">
            <span className="pulse-dot" />
            ACESSO ANTECIPADO · EM DESENVOLVIMENTO
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="shell hero__grid">
          <div>
            <span className="eyebrow">SOFTWARE DE ROBÓTICA INDUSTRIAL</span>
            <h1 className="headline">
              Programe e simule robôs industriais <em>antes</em> de tocar no
              chão de fábrica.
            </h1>
            <p className="lede">
              Brobotics é um ambiente desktop para cinemática direta e
              inversa, simulação de células produtivas e programação de
              tarefas reais de pick-and-place e montagem — com visualização
              3D nativa e controle de juntas em tempo real.
            </p>
            <div className="hero__cta">
              <WaitlistForm />
              <p className="form-note">
                Sem spam. Avisamos só quando houver vaga no acesso antecipado.
              </p>
            </div>
            <div className="stack-tags">
              <span className="stack-tag">C# / .NET</span>
              <span className="stack-tag">WPF · MVVM</span>
              <span className="stack-tag">HelixToolkit 3D</span>
              <span className="stack-tag">URDF</span>
              <span className="stack-tag">Cinemática DLS/LM</span>
            </div>
          </div>
          <JointPanel />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionLabel>O QUE O BROBOTICS FAZ</SectionLabel>
          <h2>Da junta ao programa, num único ambiente.</h2>
          <p className="section-lede">
            Controle de posição cartesiana e angular, importação de modelos
            reais e simulação de tarefas — pensado para quem programa robôs
            de verdade, não só visualiza demos.
          </p>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-card__index">01</div>
              <h3>Cinemática direta e inversa</h3>
              <p>
                Entradas de posição (X, Y, Z) e orientação (RX, RY, RZ) com
                cálculo de ângulos de junta em tempo real, prontas para
                qualquer cadeia cinemática.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__index">02</div>
              <h3>Importação URDF, STL e OBJ</h3>
              <p>
                Traga modelos reais de robôs e células de produção direto
                para a cena 3D, com pré-preenchimento automático dos
                parâmetros do robô a partir do URDF.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__index">03</div>
              <h3>Montagem de célula produtiva</h3>
              <p>
                Arraste robôs, mesas, esteiras e objetos para montar a célula
                de trabalho e validar alcance e colisões antes da instalação
                física.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__index">04</div>
              <h3>Simulação de pick-and-place</h3>
              <p>
                Programe e valide tarefas reais de manipulação e montagem em
                ambiente simulado, com trajetórias e pontos salvos por
                programa.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__index">05</div>
              <h3>Painel de controle de juntas</h3>
              <p>
                Sliders e valores numéricos por junta, jogging cartesiano e
                modo relativo com rotação local baseada em quaternions.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__index">06</div>
              <h3>Visualização 3D dedicada</h3>
              <p>
                Viewport com câmera, iluminação e gizmo de pivô próprios,
                construído sobre HelixToolkit — sem dependência de motores de
                jogo pesados.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionLabel>EM DESENVOLVIMENTO ATIVO</SectionLabel>
          <h2>O app já roda. Estas são telas reais, não mockups.</h2>
          <p className="section-lede">
            Do painel de controle de juntas ao wizard que importa um robô
            novo a partir de arquivos STL, passo a passo — o que você vê
            abaixo é a build atual do Brobotics.
          </p>
          <ProductShowcase />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionLabel>ARQUITETURA</SectionLabel>
          <h2>Brobotics fala com o controlador, não com o robô direto.</h2>
          <p className="section-lede">
            O fluxo de comando passa pelo controlador nativo de cada robô —
            o mesmo modelo usado por integradores em campo. Brobotics define
            a trajetória; o controlador executa o laço de servo fechado.
          </p>
          <div className="pipeline">
            <div className="pipeline__node">
              <div className="pipeline__node-label">01 · PLANEJAMENTO</div>
              <div className="pipeline__node-title">Brobotics</div>
              <div className="pipeline__node-sub">
                Cinemática, trajetórias e pontos de programa
              </div>
            </div>
            <div className="pipeline__node">
              <div className="pipeline__node-label">02 · TRANSPORTE</div>
              <div className="pipeline__node-title">Serial / Ethernet</div>
              <div className="pipeline__node-sub">
                RS-232/485 e TCP/IP como protocolos primários
              </div>
            </div>
            <div className="pipeline__node">
              <div className="pipeline__node-label">03 · EXECUÇÃO</div>
              <div className="pipeline__node-title">Controlador do robô</div>
              <div className="pipeline__node-sub">
                Laço de servo fechado em tempo real
              </div>
            </div>
            <div className="pipeline__node">
              <div className="pipeline__node-label">04 · MOVIMENTO</div>
              <div className="pipeline__node-title">Robô físico</div>
              <div className="pipeline__node-sub">
                Execução da trajetória planejada
              </div>
            </div>
          </div>
          <div style={{ height: 28 }} />
          <div className="protocols">
            <span className="protocol-chip protocol-chip--primary">
              <span className="protocol-chip__dot" />
              UR RTDE
            </span>
            <span className="protocol-chip">
              <span className="protocol-chip__dot" />
              FANUC PCDK
            </span>
            <span className="protocol-chip">
              <span className="protocol-chip__dot" />
              KUKA RSI
            </span>
            <span className="protocol-chip">
              <span className="protocol-chip__dot" />
              ABB RWS / PC SDK
            </span>
            <span className="protocol-chip">
              <span className="protocol-chip__dot" />
              EtherCAT (futuro)
            </span>
            <span className="protocol-chip">
              <span className="protocol-chip__dot" />
              Profinet RT (futuro)
            </span>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="shell final-cta__inner">
          <SectionLabel>ACESSO ANTECIPADO</SectionLabel>
          <h2>Entre na lista de espera.</h2>
          <p className="section-lede">
            O Brobotics está em desenvolvimento ativo. Quem entrar agora na
            lista recebe acesso antecipado e prioridade para testar as
            primeiras versões.
          </p>
          <WaitlistForm />
        </div>
      </section>

      <footer className="shell footer">
        <span>© 2026 BROBOTICS</span>
        <span>BUILD EM DESENVOLVIMENTO · ÚLTIMA ATUALIZAÇÃO JUN/2026</span>
      </footer>
    </div>
  );
}
