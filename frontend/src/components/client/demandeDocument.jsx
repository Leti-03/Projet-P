// src/components/client/DemandeDocuments.jsx
import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, CheckCircle, Upload, Camera, X, FileText } from 'lucide-react';

// ── Composant FaceScanner ─────────────────────────────────────────────────────
const FaceScanner = ({ label, preview, fileName, isCamera, onCapture, onRemove }) => {
  const fileInputRef = useRef(null); // gardé pour compatibilité
  const videoRef     = useRef(null);
  const canvasRef    = useRef(null);
  const streamRef    = useRef(null);
  const [mode, setMode]               = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError]   = useState('');

  const startCamera = async () => {
    setCameraError('');
    setMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); setCameraActive(true); }
    } catch { setCameraError("Impossible d'accéder à la caméra."); setMode(null); }
  };

  const capturePhoto = useCallback(() => {
    const video = videoRef.current; const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      const file = new File([blob], `scan_${Date.now()}.jpg`, { type: 'image/jpeg' });
      // isCamera=true pour distinguer photo vs import
      onCapture(file, URL.createObjectURL(blob), true);
      stopCamera();
    }, 'image/jpeg', 0.92);
  }, [onCapture]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null; setCameraActive(false); setMode(null);
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) { setMode(null); return; }
    onCapture(file, URL.createObjectURL(file), false);
    setMode(null);
    e.target.value = '';
  };

  // ── Aperçu selon le type ──────────────────────────────────────────────────
  if (preview) {
    const isPdf = fileName?.toLowerCase().endsWith('.pdf');

    return (
      <div className="ds-doc-slot filled">
        <span className="ds-doc-slot-label">{label}</span>

        {/* Photo caméra → aperçu image plein */}
        {isCamera ? (
          <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
            <img src={preview} alt={label} style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block', borderRadius: 8 }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'white', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle size={10} color="#78BE20"/> Photo prise
              </span>
              <button type="button" onClick={onRemove}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 4, color: 'white', cursor: 'pointer', padding: '2px 6px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                <X size={10}/> Refaire
              </button>
            </div>
          </div>
        ) : (
          /* Import fichier → nom + miniature ou icône PDF + bouton retirer */
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: 10 }}>
            {/* Miniature */}
            <div style={{ width: 40, height: 40, borderRadius: 8, background: isPdf ? '#FEF3C7' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {isPdf
                ? <FileText size={20} color="#D97706"/>
                : <img src={preview} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} />
              }
            </div>

            {/* Nom + statut */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#065f46', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {fileName || 'Document importé'}
              </div>
              <div style={{ fontSize: 10, color: '#059669', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <CheckCircle size={10}/> Prêt à l'envoi
              </div>
            </div>

            {/* Bouton retirer */}
            <button type="button" onClick={onRemove}
              style={{ background: 'none', border: '1px solid #fed7d7', borderRadius: 6, color: '#c53030', cursor: 'pointer', padding: '5px 9px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0, fontWeight: 700, whiteSpace: 'nowrap' }}>
              <X size={11}/> Retirer
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ds-doc-slot">
      <span className="ds-doc-slot-label">{label}</span>
      {!mode && (
        <div style={{ display: 'flex', gap: 7 }}>
          <button type="button" onClick={startCamera}
            style={{ flex: 1, padding: '8px 6px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#4a5568', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Camera size={13}/> Photo
          </button>

          <label
            style={{ flex: 1, padding: '8px 6px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#4a5568', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Upload size={13}/> Importer
            <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={handleFileChange} />
          </label>
        </div>
      )}
      {mode === 'camera' && (
        <div style={{ borderRadius: 8, overflow: 'hidden', border: '2px solid #0070B8', marginTop: 6 }}>
          {cameraError ? (
            <div style={{ padding: 10, background: '#fff5f5', color: '#c53030', fontSize: 12 }}>⚠️ {cameraError}</div>
          ) : (
            <>
              <video ref={videoRef} style={{ width: '100%', maxHeight: 160, objectFit: 'cover', display: 'block' }} playsInline muted />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div style={{ display: 'flex', gap: 6, padding: 7, background: '#1a1a1a' }}>
                <button type="button" onClick={capturePhoto} disabled={!cameraActive}
                  style={{ flex: 1, padding: 8, background: '#78BE20', color: 'white', border: 'none', borderRadius: 7, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <Camera size={12}/> Capturer
                </button>
                <button type="button" onClick={stopCamera}
                  style={{ padding: '8px 11px', background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: 7, cursor: 'pointer' }}>
                  <X size={12}/>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ── Composant principal ───────────────────────────────────────────────────────
export default function DemandeDocuments({ docs, onDocCapture, onDocRemove, convention, onConventionChange, onBack, onSubmit, loading }) {

  const convFileRef = useRef(null);

  const handleConvFile = e => {
    const file = e.target.files[0]; if (!file) return;
    onConventionChange({ ...convention, justif_file: file, justif_preview: URL.createObjectURL(file) });
    e.target.value = '';
  };

  const canSubmit =
    docs.residence_preview &&
    (
      (docs.type_identite === 'carte_identite' && docs.id_recto_preview && docs.id_verso_preview) ||
      (docs.type_identite === 'passeport' && docs.passeport_preview)
    );

  return (
    <div>

      {/* ── Justificatif de résidence ── */}
      <div className="ds-form-section">
        <p className="ds-form-section-title">🪪 Justificatif de résidence</p>
        {/* <p style={{ fontSize: 12, color: '#718096', marginBottom: 12 }}>
          Facture d'eau, d'électricité, ou attestation de résidence (moins de 3 mois).
        </p> */}
        <FaceScanner
          label="Justificatif de résidence *"
          preview={docs.residence_preview}
          fileName={docs.residence_fileName}
          isCamera={docs.residence_isCamera}
          onCapture={(file, url, cam) => onDocCapture('residence', file, url, null, cam)}
          onRemove={() => onDocRemove('residence')}
        />
      </div>

      {/* ── Pièce d'identité ── */}
      <div className="ds-form-section">
        <p className="ds-form-section-title">🪪 Pièce d'identité</p>

        {/* Choix type */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          {[
            { value: 'carte_identite', label: "Carte d'identité" },
            { value: 'passeport',      label: 'Passeport'        }
          ].map(opt => (
            <button key={opt.value} type="button"
              onClick={() => { onDocCapture('type_identite', null, null, opt.value); }}
              style={{
                flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13,
                border:     docs.type_identite === opt.value ? '2px solid #0070B8' : '2px solid #e2e8f0',
                background: docs.type_identite === opt.value ? '#EFF6FF'           : 'white',
                color:      docs.type_identite === opt.value ? '#0070B8'           : '#718096',
                transition: '0.15s', fontFamily: 'Poppins, sans-serif'
              }}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Carte identité : recto + verso */}
        {docs.type_identite === 'carte_identite' && (
          <>
            <div className="ds-doc-grid">
              <FaceScanner label=" Recto *" preview={docs.id_recto_preview}
                fileName={docs.id_recto_fileName} isCamera={docs.id_recto_isCamera}
                onCapture={(file, url, cam) => onDocCapture('id_recto', file, url, null, cam)}
                onRemove={() => onDocRemove('id_recto')} />
              <FaceScanner label="Verso *" preview={docs.id_verso_preview}
                fileName={docs.id_verso_fileName} isCamera={docs.id_verso_isCamera}
                onCapture={(file, url, cam) => onDocCapture('id_verso', file, url, null, cam)}
                onRemove={() => onDocRemove('id_verso')} />
            </div>
            {/* Barre progression */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <div style={{ flex: 1, height: 3, borderRadius: 3, background: docs.id_recto_preview ? '#78BE20' : '#e2e8f0' }} />
              <span style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                {docs.id_recto_preview && docs.id_verso_preview ? '✅ Complet' : docs.id_recto_preview ? 'Verso manquant' : 'Recto + Verso requis'}
              </span>
              <div style={{ flex: 1, height: 3, borderRadius: 3, background: docs.id_verso_preview ? '#78BE20' : '#e2e8f0' }} />
            </div>
          </>
        )}

        {/* Passeport : une seule face */}
        {docs.type_identite === 'passeport' && (
          <FaceScanner label="📘 Page principale *" preview={docs.passeport_preview}
            fileName={docs.passeport_fileName} isCamera={docs.passeport_isCamera}
            onCapture={(file, url, cam) => onDocCapture('passeport', file, url, null, cam)}
            onRemove={() => onDocRemove('passeport')} />
        )}
      </div>

      {/* ── Convention ── */}
      <div className="ds-convention-box">
        <label className="ds-convention-check">
          <input
            type="checkbox"
            checked={convention.accepted}
            onChange={e => onConventionChange({ ...convention, accepted: e.target.checked })}
          />
          <span className="ds-convention-text">
            J'accepte et je reconnais avoir pris connaissance des <strong>conditions générales d'abonnement</strong> et de la <strong>convention de service</strong> d'Algérie Télécom.
          </span>
        </label>

        {/* Upload justificatif si convention cochée */}
        {convention.accepted && (
          <div className="ds-convention-upload">
            <p style={{ fontSize: 12, fontWeight: 700, color: '#065f46', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={14}/> Joindre le justificatif signé (optionnel)
            </p>

            {convention.justif_preview ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'white', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                <CheckCircle size={16} color="#22863a"/>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#22863a', flex: 1 }}>Document joint</span>
                <button type="button" onClick={() => onConventionChange({ ...convention, justif_file: null, justif_preview: '' })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <X size={14}/>
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => convFileRef.current?.click()}
                style={{ width: '100%', padding: '9px', borderRadius: 8, border: '1px dashed #a7f3d0', background: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                <Upload size={13}/> Importer le document signé
              </button>
            )}
            <input ref={convFileRef} type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={handleConvFile} />
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <div className="ds-nav-btns">
        <button className="ds-btn-back" onClick={onBack}>
          <ChevronLeft size={16}/> Retour
        </button>
        <button className="ds-btn-next" onClick={onSubmit} disabled={!canSubmit || loading}>
          {loading ? 'Envoi en cours...' : '✅ Soumettre la demande'}
        </button>
      </div>

      {!canSubmit && (
        <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
          {!docs.residence_preview ? 'Justificatif de résidence requis.' : 'Pièce d\'identité complète requise.'}
        </p>
      )}
    </div>
  );
}