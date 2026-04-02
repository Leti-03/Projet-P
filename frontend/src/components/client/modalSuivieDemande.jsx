// src/components/client/ModalSuiviDemande.jsx
import React from 'react';
import { X, CheckCircle, Clock, Loader, XCircle, MapPin, Calendar, FileText, Wifi, Phone, Router, Globe, Zap } from 'lucide-react';

const ETAPES = [
  { key: 'soumise',      label: 'Demande soumise',        desc: 'Votre demande a bien été reçue.',                  icon: '📋' },
  { key: 'en_cours',     label: 'En cours de traitement', desc: 'Un agent examine votre dossier.',                  icon: '⚙️' },
  { key: 'traitee',      label: 'Demande traitée',        desc: 'Votre demande a été traitée avec succès.',         icon: '✅' },
];

const STATUT_TO_STEP = {
  en_attente: 0,
  en_cours:   1,
  approuvee:  2,
  terminee:   2,
  rejetee:    -1, // cas rejet
};

const SERVICE_CONFIG = {
  ligne_telephonique: { label: 'Ligne Téléphonique', icon: <Phone size={18}/>,  color: '#3B82F6' },
  adsl:               { label: 'Internet ADSL',      icon: <Wifi size={18}/>,   color: '#8B5CF6' },
  achat_modem:        { label: 'Achat Modem',        icon: <Router size={18}/>, color: '#F59E0B' },
  ip_fixe:            { label: '@IP Fixe',           icon: <Globe size={18}/>,  color: '#10B981' },
  fttx:               { label: 'FTTX (Fibre)',       icon: <Zap size={18}/>,    color: '#EF4444' },
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : null;

export default function ModalSuiviDemande({ demande, onClose }) {
  if (!demande) return null;

  const svc        = SERVICE_CONFIG[demande.type_service] || { label: demande.type_service, icon: <Globe size={18}/>, color: '#6B7280' };
  const currentStep = STATUT_TO_STEP[demande.statut] ?? 0;
  const isRejected  = demande.statut === 'rejetee';

  return (
    <div className="cds-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cds-modal">

        {/* ── Header ── */}
        <div className="cds-modal-header" style={{ borderBottom: `3px solid ${svc.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${svc.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: svc.color }}>
              {svc.icon}
            </div>
            <div>
              <h2 className="cds-modal-title">{svc.label}</h2>
              <p className="cds-modal-id">#{String(demande.id).slice(0, 8).toUpperCase()} · {formatDate(demande.created_at)?.split(' à')[0]}</p>
            </div>
          </div>
          <button onClick={onClose} className="cds-modal-close">
            <X size={20}/>
          </button>
        </div>

        {/* ── Corps ── */}
        <div className="cds-modal-body">

          {/* ── Timeline suivi ── */}
          <div className="cds-modal-section">
            <h3 className="cds-modal-section-title">📊 Suivi de votre demande</h3>

            {isRejected ? (
              /* Cas rejet */
              <div className="cds-rejected-box">
                <XCircle size={32} color="#EF4444" style={{ marginBottom: 10 }}/>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#DC2626', marginBottom: 6 }}>Demande rejetée</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>Votre demande n'a pas pu être traitée. Contactez le support pour plus d'informations.</div>
              </div>
            ) : (
              <div className="cds-timeline">
                {ETAPES.map((etape, i) => {
                  const isDone   = i < currentStep;
                  const isActive = i === currentStep;
                  const isTodo   = i > currentStep;

                  return (
                    <div key={etape.key} className="cds-timeline-item">
                      {/* Ligne verticale */}
                      {i < ETAPES.length - 1 && (
                        <div className={`cds-timeline-line ${isDone ? 'done' : ''}`} />
                      )}

                      {/* Cercle */}
                      <div className={`cds-timeline-circle ${isDone ? 'done' : isActive ? 'active' : 'todo'}`}>
                        {isDone   && <CheckCircle size={16} color="white"/>}
                        {isActive && <Loader size={16} color="white" style={{ animation: 'spin 1.5s linear infinite' }}/>}
                        {isTodo   && <span style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF' }}>{i + 1}</span>}
                      </div>

                      {/* Contenu */}
                      <div className={`cds-timeline-content ${isActive ? 'active' : ''}`}>
                        <div className="cds-timeline-icon">{etape.icon}</div>
                        <div>
                          <div className={`cds-timeline-label ${isDone ? 'done' : isActive ? 'active' : 'todo'}`}>
                            {etape.label}
                          </div>
                          <div className="cds-timeline-desc">{etape.desc}</div>
                          {isDone && i === 0 && (
                            <div className="cds-timeline-date">
                              <Calendar size={10}/> {formatDate(demande.created_at)}
                            </div>
                          )}
                          {isActive && (
                            <div className="cds-timeline-active-badge">En cours...</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Infos demande ── */}
          <div className="cds-modal-section">
            <h3 className="cds-modal-section-title">📋 Détails de la demande</h3>
            <div className="cds-info-grid">
              <div className="cds-info-item">
                <span className="cds-info-label">Service</span>
                <span className="cds-info-value" style={{ color: svc.color, fontWeight: 700 }}>{svc.label}</span>
              </div>
              {demande.wilaya && (
                <div className="cds-info-item">
                  <span className="cds-info-label">Wilaya</span>
                  <span className="cds-info-value"><MapPin size={12}/> {demande.wilaya}</span>
                </div>
              )}
              {demande.adresse_installation && (
                <div className="cds-info-item" style={{ gridColumn: 'span 2' }}>
                  <span className="cds-info-label">Adresse d'installation</span>
                  <span className="cds-info-value">{demande.adresse_installation}</span>
                </div>
              )}
              {demande.details && Object.keys(demande.details).length > 0 && (
                Object.entries(demande.details).map(([k, v]) => v ? (
                  <div key={k} className="cds-info-item">
                    <span className="cds-info-label">{k.replace(/_/g, ' ')}</span>
                    <span className="cds-info-value">{v}</span>
                  </div>
                ) : null)
              )}
              <div className="cds-info-item">
                <span className="cds-info-label">Convention acceptée</span>
                <span className="cds-info-value">{demande.convention_acceptee ? '✅ Oui' : '❌ Non'}</span>
              </div>
              <div className="cds-info-item">
                <span className="cds-info-label">Date de soumission</span>
                <span className="cds-info-value">{formatDate(demande.created_at)}</span>
              </div>
            </div>
          </div>

          {/* ── Documents ── */}
          {(demande.doc_residence_url || demande.doc_identite_recto_url || demande.doc_passeport_url) && (
            <div className="cds-modal-section">
              <h3 className="cds-modal-section-title">📎 Documents joints</h3>
              <div className="cds-docs-grid">
                {demande.doc_residence_url && (
                  <a href={demande.doc_residence_url} target="_blank" rel="noopener noreferrer" className="cds-doc-link">
                    <FileText size={14}/> Justificatif résidence
                  </a>
                )}
                {demande.doc_identite_recto_url && (
                  <a href={demande.doc_identite_recto_url} target="_blank" rel="noopener noreferrer" className="cds-doc-link">
                    <FileText size={14}/> Pièce d'identité (recto)
                  </a>
                )}
                {demande.doc_identite_verso_url && (
                  <a href={demande.doc_identite_verso_url} target="_blank" rel="noopener noreferrer" className="cds-doc-link">
                    <FileText size={14}/> Pièce d'identité (verso)
                  </a>
                )}
                {demande.doc_passeport_url && (
                  <a href={demande.doc_passeport_url} target="_blank" rel="noopener noreferrer" className="cds-doc-link">
                    <FileText size={14}/> Passeport
                  </a>
                )}
                {demande.doc_convention_url && (
                  <a href={demande.doc_convention_url} target="_blank" rel="noopener noreferrer" className="cds-doc-link">
                    <FileText size={14}/> Convention signée
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="cds-modal-footer">
          <button onClick={onClose} className="cds-modal-close-btn">Fermer</button>
          <a href="tel:3131" className="cds-modal-contact-btn">📞 Contacter le support</a>
        </div>

      </div>
    </div>
  );
}