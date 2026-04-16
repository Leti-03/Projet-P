import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

/**
 * TypeModal — Modal de sélection des types de dérangement
 *
 * Usage dans ClientReclamation:
 *   import TypeModal from './TypeModal';
 *   <TypeModal category={modalCat} onConfirm={handleConfirm} onClose={() => setModalCat(null)} />
 *
 * Props:
 *   category  : objet catégorie { label, color, bg, icon, groups } | null
 *   onConfirm : (checkedItems: string[]) => void
 *   onClose   : () => void
 */
export default function TypeModal({ category, onConfirm, onClose }) {
  const [checked, setChecked] = useState([]);

  // Reset les coches à chaque ouverture d'une nouvelle catégorie
  useEffect(() => {
    setChecked([]);
  }, [category]);

  // Bloquer le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (category) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [category]);

  if (!category) return null;

  const toggle = (item) => {
    setChecked(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleConfirm = () => {
    if (checked.length === 0) return;
    onConfirm(checked);
  };

  // Fermer sur clic overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      {/* ── Styles injectés dans le <head> pour éviter les conflits CSS ── */}
      <style>{`
        .at-modal-overlay {
          position: fixed !important;
          top: 0 !important; left: 0 !important;
          right: 0 !important; bottom: 0 !important;
          z-index: 99999 !important;
          background: rgba(0, 0, 0, 0.55) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 20px !important;
        }
        .at-modal-box {
          background: #ffffff !important;
          border-radius: 16px !important;
          width: 100% !important;
          max-width: 520px !important;
          max-height: 88vh !important;
          display: flex !important;
          flex-direction: column !important;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.28) !important;
          overflow: hidden !important;
          position: relative !important;
        }
        .at-modal-body {
          overflow-y: auto !important;
          flex: 1 !important;
          padding: 8px 20px 16px !important;
        }
        .at-modal-item:hover {
          background: #F7FAFC !important;
        }
        .at-modal-item.active:hover {
          opacity: 0.92 !important;
        }
      `}</style>

      {/* ── Overlay ── */}
      <div className="at-modal-overlay" onClick={handleOverlayClick}>

        {/* ── Boîte du modal ── */}
        <div className="at-modal-box" onClick={(e) => e.stopPropagation()}>

          {/* Header coloré */}
          <div style={{
            padding: '16px 20px',
            background: category.bg,
            borderBottom: `2px solid ${category.color}30`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}>
            <div style={{
              width: 46, height: 46,
              borderRadius: 12,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: category.color,
              flexShrink: 0,
              boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
            }}>
              {category.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1A202C' }}>
                {category.label}
              </div>
              <div style={{ fontSize: 12, color: '#718096', marginTop: 2 }}>
                Cochez le(s) type(s) de dérangement
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.85)',
                border: 'none',
                borderRadius: 8,
                padding: 6,
                cursor: 'pointer',
                color: '#718096',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Corps scrollable */}
          <div className="at-modal-body">
            {category.groups.map((group) => (
              <div key={group.title}>

                {/* Titre de groupe style dossier AT */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  margin: '18px 0 8px',
                  padding: '6px 8px',
                  background: '#F7F8FA',
                  borderRadius: 6,
                  borderLeft: `3px solid ${category.color}`,
                }}>
                  <span style={{ fontSize: 15 }}>📁</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#4A5568' }}>
                    {group.title}
                  </span>
                </div>

                {/* Items avec checkbox custom */}
                {group.items.map((item) => {
                  const isChecked = checked.includes(item);
                  return (
                    <div
                      key={item}
                      className={`at-modal-item${isChecked ? ' active' : ''}`}
                      onClick={() => toggle(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 12px',
                        marginLeft: 20,
                        marginBottom: 4,
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: isChecked ? `${category.color}12` : 'transparent',
                        border: `1px solid ${isChecked ? category.color + '50' : 'transparent'}`,
                        transition: 'all 0.12s ease',
                      }}
                    >
                      {/* Checkbox visuelle */}
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        flexShrink: 0,
                        border: `2px solid ${isChecked ? category.color : '#CBD5E0'}`,
                        background: isChecked ? category.color : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.12s ease',
                      }}>
                        {isChecked && <Check size={11} color="#fff" strokeWidth={3} />}
                      </div>

                      <span style={{
                        fontSize: 13,
                        color: isChecked ? category.color : '#2D3748',
                        fontWeight: isChecked ? 600 : 400,
                        lineHeight: 1.4,
                      }}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer avec compteur + boutons */}
          <div style={{
            padding: '14px 20px',
            borderTop: '1px solid #EDF2F7',
            display: 'flex',
            gap: 10,
            flexShrink: 0,
            background: '#FAFAFA',
          }}>
            {/* Compteur */}
            {checked.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 12,
                color: category.color,
                fontWeight: 600,
                minWidth: 80,
              }}>
                {checked.length} sélectionné{checked.length > 1 ? 's' : ''}
              </div>
            )}

            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 13,
                color: '#718096',
                fontWeight: 500,
              }}
            >
              Annuler
            </button>

            <button
              onClick={handleConfirm}
              disabled={checked.length === 0}
              style={{
                flex: 2,
                padding: '10px',
                background: checked.length > 0 ? category.color : '#CBD5E0',
                border: 'none',
                borderRadius: 8,
                cursor: checked.length > 0 ? 'pointer' : 'not-allowed',
                fontSize: 13,
                color: '#fff',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'background 0.15s',
              }}
            >
              <Check size={15} />
              Confirmer
            </button>
          </div>

        </div>
      </div>
    </>
  );
}