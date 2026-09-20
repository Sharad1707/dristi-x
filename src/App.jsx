import { useState } from 'react'
import './App.css'

const navItems = ['Overview', 'Patients', 'Screening', 'Review queue', 'Reports']
const navIcons = { Overview: '▦', Patients: '♙', Screening: '⊙', 'Review queue': '☷', Reports: '↗' }
const sampleEyes = [
  { name: 'Synthetic fundus demo', label: 'Fundus reference', url: '/sample-fundus.svg' },
  { name: 'Eye reference 01', label: 'External eye photo', url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=85' },
  { name: 'Eye reference 02', label: 'External eye photo', url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=85' },
]

function App() {
  const [patient] = useState({ name: 'Anita Sharma', id: 'DR-2048', age: '52' })
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [status, setStatus] = useState('ready')
  const [activeNav, setActiveNav] = useState('Screening')

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImage(file)
    setImageUrl(URL.createObjectURL(file))
    setStatus('ready')
  }
  const loadSample = (sample) => {
    setImage({ name: sample.name, size: 0 })
    setImageUrl(sample.url)
    setStatus('ready')
  }
  const runAnalysis = () => {
    setStatus('analyzing')
    window.setTimeout(() => setStatus('complete'), 1600)
  }
  const resetScreening = () => {
    setImage(null)
    setImageUrl(null)
    setStatus('ready')
  }
  const isComplete = status === 'complete'

  return <div className="app-shell">
    <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
    <main className="main-content"><Header resetScreening={resetScreening} />
      {activeNav === 'Screening' ? <><PatientStrip patient={patient} /><Workflow image={image} isComplete={isComplete} />{!isComplete ? <UploadWorkspace image={image} handleImage={handleImage} loadSample={loadSample} runAnalysis={runAnalysis} /> : <ClinicalReport imageUrl={imageUrl} onNew={resetScreening} />}</> : <NavigationView view={activeNav} setActiveNav={setActiveNav} />}
      {status === 'analyzing' && <div className="analysis-overlay"><div className="loader"></div><strong>Preparing screening report</strong><span>Checking image quality · Running model inference · Creating explanation</span></div>}
      <footer className="app-footer"><span><i className="online-dot" /> Local inference mode</span><span>Drishti-XAI prototype · v0.1.0</span></footer>
    </main>
  </div>
}

function Sidebar({ activeNav, setActiveNav }) {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark">◉</span><span>drishti<span>-xai</span></span></div><div className="clinic-switcher"><span className="clinic-icon">↗</span><div><strong>Aranya Health Centre</strong><small>Rural screening unit</small></div><span className="chevron">⌄</span></div><nav className="main-nav" aria-label="Primary navigation">{navItems.map((item) => <button type="button" key={item} className={activeNav === item ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav(item)}><span className="nav-symbol">{navIcons[item]}</span>{item}{item === 'Review queue' && <em>04</em>}</button>)}</nav><div className="sidebar-bottom"><button type="button" className="nav-item"><span className="nav-symbol">?</span>Help centre</button><div className="profile"><span className="avatar">RK</span><div><strong>Dr. Riya Kapoor</strong><small>Healthcare worker</small></div><span className="more">•••</span></div></div></aside>
}

function Header({ resetScreening }) {
  return <header className="topbar"><div><p className="eyebrow">SCREENING WORKSPACE / <span>LIVE</span></p><h1>Good morning, Dr. Kapoor <span>✦</span></h1></div><div className="top-actions"><button type="button" className="icon-button" aria-label="Notifications">♢<b></b></button><button type="button" className="help-button">?</button><button type="button" className="outline-button" onClick={resetScreening}>+ New screening</button></div></header>
}

function PatientStrip({ patient }) {
  return <section className="patient-strip"><div className="patient-heading"><div className="patient-avatar">AS</div><div><p className="eyebrow">ACTIVE PATIENT</p><h2>{patient.name}</h2><span>{patient.id} <i /> {patient.age} years <i /> Female</span></div></div><div className="strip-actions"><span className="saved">● Auto-saved just now</span><button type="button" className="quiet-button">Patient details ↗</button></div></section>
}

function Workflow({ image, isComplete }) {
  return <div className="workflow"><div className="workflow-step done"><span>✓</span><span>Patient</span></div><div className="connector done" /><div className={image ? 'workflow-step done' : 'workflow-step current'}><span>{image ? '✓' : '2'}</span><span>Fundus image</span></div><div className="connector" /><div className={isComplete ? 'workflow-step done' : 'workflow-step'}><span>{isComplete ? '✓' : '3'}</span><span>AI analysis</span></div><div className="connector" /><div className="workflow-step"><span>4</span><span>Review & report</span></div></div>
}

function NavigationView({ view, setActiveNav }) {
  const content = {
    Overview: { eyebrow: 'CLINIC OVERVIEW', title: 'Screening activity', copy: 'A concise view of today\'s patient safety and review workload.', action: 'Open screening' },
    Patients: { eyebrow: 'PATIENT DIRECTORY', title: 'Patients', copy: 'Find a patient record and start a new retinal screening.', action: 'Register patient' },
    'Review queue': { eyebrow: 'CLINICAL REVIEW QUEUE', title: 'Cases awaiting review', copy: 'Prioritize AI-assisted screenings that need an ophthalmologist decision.', action: 'Open first case' },
    Reports: { eyebrow: 'REPORTS & INSIGHTS', title: 'Screening reports', copy: 'Review recent outcomes, referral activity, and model-assisted findings.', action: 'Create report' },
  }[view]
  return <section className="navigation-view"><div className="view-heading"><div><p className="eyebrow">{content.eyebrow}</p><h2>{content.title}</h2><p className="panel-copy">{content.copy}</p></div><button type="button" className="primary-button" onClick={() => setActiveNav('Screening')}>{content.action} <span>→</span></button></div><NavigationPanel view={view} setActiveNav={setActiveNav} /></section>
}

function NavigationPanel({ view, setActiveNav }) {
  switch (view) {
    case 'Overview': return <OverviewPanel />
    case 'Patients': return <PatientsPanel setActiveNav={setActiveNav} />
    case 'Review queue': return <ReviewPanel setActiveNav={setActiveNav} />
    default: return <ReportsPanel />
  }
}

function OverviewPanel() {
  return <><div className="metric-grid"><Metric value="128" label="Screenings this month" trend="+18%" /><Metric value="04" label="Cases awaiting review" trend="Needs attention" alert /><Metric value="92%" label="Image quality pass rate" trend="Stable" /></div><div className="panel activity-panel"><div className="card-heading"><div><p className="eyebrow">TODAY'S ACTIVITY</p><h3>Screening operations</h3></div><span className="model-chip">Local mode</span></div><div className="activity-row"><span className="activity-icon teal">✓</span><div><strong>12 screenings completed</strong><small>Across 8 registered patients</small></div><b>Today</b></div><div className="activity-row"><span className="activity-icon amber">!</span><div><strong>4 cases need clinical review</strong><small>2 moderate-risk recommendations</small></div><b>Queue</b></div><div className="activity-row"><span className="activity-icon blue">↗</span><div><strong>7 referrals suggested</strong><small>Based on model-assisted screening</small></div><b>This week</b></div></div></>
}

function Metric({ value, label, trend, alert }) { return <div className={alert ? 'metric-card alert' : 'metric-card'}><strong>{value}</strong><span>{label}</span><small>{trend}</small></div> }
function PatientsPanel({ setActiveNav }) { return <div className="panel table-panel"><div className="table-toolbar"><input aria-label="Search patients" placeholder="Search by name or patient ID" /><button type="button" className="quiet-button">Filter</button></div><div className="patient-table"><div className="table-row table-head"><span>Patient</span><span>Last screening</span><span>Status</span><span>Action</span></div><div className="table-row"><strong>Anita Sharma <small>DR-2048 · 52 years</small></strong><span>Today, 11:42 AM</span><em className="table-status review">Review suggested</em><button type="button" className="table-link" onClick={() => setActiveNav('Screening')}>Open</button></div><div className="table-row"><strong>Ramesh Patel <small>DR-2041 · 61 years</small></strong><span>Yesterday, 3:18 PM</span><em className="table-status clear">Completed</em><button type="button" className="table-link">View</button></div><div className="table-row"><strong>Sunita Rao <small>DR-2038 · 47 years</small></strong><span>18 Sep 2026</span><em className="table-status pending">Pending</em><button type="button" className="table-link">View</button></div></div></div> }
function ReviewPanel({ setActiveNav }) { return <div className="panel queue-panel"><div className="queue-item priority"><span className="queue-number">01</span><div><strong>Anita Sharma · DR-2048</strong><p>Moderate model risk · 3 indicators flagged · screening today</p></div><button type="button" className="primary-button" onClick={() => setActiveNav('Screening')}>Review case →</button></div><div className="queue-item"><span className="queue-number">02</span><div><strong>Sunita Rao · DR-2038</strong><p>Image quality review · recapture may be required</p></div><button type="button" className="quiet-button">Open case</button></div><div className="queue-item"><span className="queue-number">03</span><div><strong>Vikram Singh · DR-2029</strong><p>Low-confidence result · specialist confirmation requested</p></div><button type="button" className="quiet-button">Open case</button></div></div> }
function ReportsPanel() { return <><div className="metric-grid"><Metric value="128" label="Total screenings" trend="September 2026" /><Metric value="31" label="Referrals suggested" trend="24% of screenings" /><Metric value="04" label="Reports awaiting sign-off" trend="Clinician queue" alert /></div><div className="panel activity-panel"><div className="card-heading"><div><p className="eyebrow">REPORTING NOTE</p><h3>Clinical governance</h3></div></div><p className="panel-copy report-note">Every report should be reviewed by a qualified clinician before it informs a diagnosis or treatment decision. Model outputs and heatmaps should be retained with the screening record for audit.</p><button type="button" className="quiet-button">Download monthly summary ↗</button></div></> }

function UploadWorkspace({ image, handleImage, loadSample, runAnalysis }) {
  return <section className="workspace-grid"><div className="panel upload-panel"><div className="panel-heading"><div><p className="eyebrow">STEP 02 / IMAGE INPUT</p><h2>Upload fundus image</h2></div><span className="status-pill">Encrypted locally</span></div><p className="panel-copy">Add a clear, centered retinal image. Drishti checks image quality before analysis.</p><label htmlFor="fundus-image" className={image ? 'drop-zone has-image' : 'drop-zone'} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); handleImage({ target: { files: event.dataTransfer.files } }) }}>{image ? <><div className="file-icon">◉</div><strong>{image.name}</strong><span>{image.size ? `${(image.size / 1024 / 1024).toFixed(1)} MB` : 'Sample image'} · ready to check</span><span className="replace-link">Replace image</span></> : <><div className="upload-icon">↑</div><strong>Drop retinal image here</strong><span>or click to browse from this device</span><small>JPG, PNG, SVG · maximum 10 MB</small></>}</label><input id="fundus-image" type="file" accept="image/png,image/jpeg,image/svg+xml" hidden onChange={handleImage} /><div className="supported-row"><span>◎</span><div><strong>Supported capture</strong><small>Fundus camera or smartphone adapter</small></div><a href="#quality">View requirements</a></div><div className="sample-library"><div className="sample-library-head"><div><strong>Try a sample image</strong><small>For interface demonstration</small></div><span>3 samples</span></div><div className="sample-grid">{sampleEyes.map((sample) => <button type="button" className="sample-card" key={sample.name} onClick={() => loadSample(sample)}><img src={sample.url} alt="" /><span><strong>{sample.name}</strong><small>{sample.label}</small></span></button>)}</div><p className="sample-disclaimer">External eye photos are reference images only and are not suitable for diabetic-retinopathy screening.</p></div><div className="panel-footer"><button type="button" className="text-button" onClick={() => loadSample(sampleEyes[0])}>Use fundus demo ↗</button>{image && <button type="button" className="primary-button" onClick={runAnalysis}>Run quality check <span>→</span></button>}</div></div><aside className="side-column"><div className="panel patient-card"><div className="panel-heading"><div><p className="eyebrow">SCREENING NOTES</p><h3>Patient context</h3></div><button type="button" className="small-edit">Edit</button></div><label htmlFor="reason">Reason for screening<select id="reason"><option>Routine diabetic screening</option><option>Follow-up examination</option><option>Vision concern</option></select></label><label htmlFor="notes">Notes<textarea id="notes" placeholder="Add relevant clinical context..." defaultValue="Type 2 diabetes · 8 years" /></label><div className="privacy-note"><span>◇</span><p><strong>Privacy protected</strong><br />Images are processed on this device and are not shared without consent.</p></div></div><div className="tip-card"><span className="tip-mark">✦</span><div><strong>Capture guidance</strong><p>Ensure the optic disc and macula are visible with minimal glare and motion blur.</p></div></div></aside></section>
}

function ClinicalReport({ imageUrl, onNew }) {
  return <section className="clinical-report"><div className="report-header"><div><div className="report-title-row"><span className="report-type">AI-ASSISTED SCREENING REPORT</span><span className="report-status">PRELIMINARY</span></div><h2>Retinal screening assessment</h2><p className="panel-copy">Structured findings for ophthalmologist review. Generated 20 Sep 2026 · 11:42 AM.</p></div><div className="report-actions"><button type="button" className="quiet-button">Print report</button><button type="button" className="outline-button" onClick={onNew}>+ New screening</button></div></div><div className="clinical-banner"><span className="banner-icon">!</span><div><strong>Clinical review recommended</strong><p>This screening indicates findings that may be associated with diabetic retinopathy. Confirm image findings and diagnosis with a qualified ophthalmologist.</p></div><span className="priority-badge">Priority: routine</span></div><div className="report-grid"><div className="report-main"><section className="panel report-card imaging-card"><div className="card-heading"><div><p className="eyebrow">IMAGE REVIEW</p><h3>Fundus image and model attention</h3></div><span className="model-chip">Grad-CAM · v0.1</span></div><div className="report-image-wrap"><div className="retina-stage report-retina"><div className="retina-glow" style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}></div><div className="heat-spot one"></div><div className="heat-spot two"></div><div className="heat-spot three"></div><div className="scan-crosshair"></div><span className="scan-tag">Highest attention region</span></div><div className="image-quality"><div><span className="quality-icon good">✓</span><div><strong>Image quality acceptable</strong><small>Centered field · adequate illumination</small></div></div><span className="quality-score">88 / 100</span></div></div><div className="scan-legend"><span><i className="legend-red"></i> High influence</span><span><i className="legend-yellow"></i> Moderate influence</span><span><i className="legend-blue"></i> Low influence</span></div><p className="caption">Heatmap indicates regions that contributed most to the model output. It is an interpretability aid, not proof of lesion location.</p></section><section className="panel report-card findings-card"><div className="card-heading"><div><p className="eyebrow">OBSERVED INDICATORS</p><h3>Findings requiring review</h3></div><span className="finding-count">3 flagged</span></div><div className="finding-list"><FindingRow title="Microaneurysm-like patterns" location="Superior temporal quadrant" level="Moderate" tone="moderate" /><FindingRow title="Small hemorrhage-like regions" location="Inferior temporal quadrant" level="Low" tone="low" /><FindingRow title="Vascular irregularity" location="Temporal arcade" level="Moderate" tone="moderate" /></div><div className="finding-note"><span>ⓘ</span><p>These are model-generated visual indicators, not confirmed clinical signs. Inspect the original image before recording a clinical impression.</p></div></section></div><aside className="report-side"><section className="panel report-card risk-card"><div className="risk-heading"><div><p className="eyebrow">RISK STRATIFICATION</p><h3>Requires review</h3></div><span className="risk-symbol">!</span></div><div className="risk-level"><span>Screening risk level</span><strong>MODERATE</strong></div><div className="risk-meter"><span></span></div><div className="risk-stats"><div><span>Model probability</span><strong>91.8%</strong></div><div><span>Model sensitivity</span><strong>High priority</strong></div></div><p className="risk-copy">The model output is above the review threshold. This supports referral for clinical assessment, not an autonomous diagnosis.</p><button type="button" className="primary-button full">Mark for clinician review <span>→</span></button></section><section className="panel report-card patient-summary"><div className="card-heading"><div><p className="eyebrow">PATIENT SUMMARY</p><h3>Anita Sharma</h3></div><span className="summary-id">DR-2048</span></div><dl><div><dt>Age / sex</dt><dd>52 years / Female</dd></div><div><dt>Screening reason</dt><dd>Routine diabetic screening</dd></div><div><dt>Diabetes history</dt><dd>Type 2 · 8 years</dd></div><div><dt>Image reviewed</dt><dd>Fundus reference</dd></div></dl></section><section className="panel report-card next-step-card"><p className="eyebrow">RECOMMENDED NEXT STEP</p><h3>Ophthalmologist review</h3><p>Review the original image, model attention areas, and patient history within 2 weeks.</p><button type="button" className="quiet-button">Add clinical note +</button></section></aside></div><div className="report-footer"><span><strong>Decision support only.</strong> Final diagnosis and treatment decisions remain with a qualified medical professional.</span><span>Model: Drishti screening demo · Not validated for clinical use</span></div></section>
}
function FindingRow({ title, location, level, tone }) { return <div className="finding-row"><span className={`finding-dot ${tone}`}></span><div><strong>{title}</strong><small>{location}</small></div><span className={`level-tag ${tone}`}>{level}</span></div> }
export default App
