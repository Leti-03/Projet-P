// src/pages/crm/MonProfil.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/crm/AuthContext.jsx';
import Layout from '../../components/crm/common/Layout.jsx';
import api from '../../services/crm/api.js';
export default function MonProfil() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(`/users/${user.id}`);
        setProfileData(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des informations');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontFamily: "'Poppins', sans-serif" }}>Chargement...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{ padding: '32px', textAlign: 'center', color: '#ef4444', fontFamily: "'Poppins', sans-serif" }}>{error}</div>
      </Layout>
    );
  }

  const data = profileData || user;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Jamais';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div style={s.page}>
        {/* Header content: Avatar, Full Name, Role Badge */}
        <div style={s.header}>
          <div style={s.bigAvatar}>
            {data?.prenom?.[0]}{data?.nom?.[0]}
          </div>
          <div>
            <h1 style={s.title}>{data?.prenom} {data?.nom}</h1>
            <div style={s.badgeWrap}>
              {data?.est_superadmin ? (
                <span style={s.superBadge}>⚡ Super Admin</span>
              ) : (
                <span style={s.roleBadge}>
                  👤 {data?.roles?.[0]?.nom || 'Non assigné'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Read-Only Card */}
        <div style={s.card}>
          <div style={s.cardTitle}>Mon profil</div>
          <div style={s.grid}>
            <div style={s.field}>
              <div style={s.label}>Prénom</div>
              <div style={s.value}>{data?.prenom || '—'}</div>
            </div>
            <div style={s.field}>
              <div style={s.label}>Nom</div>
              <div style={s.value}>{data?.nom || '—'}</div>
            </div>
            <div style={s.field}>
              <div style={s.label}>Email</div>
              <div style={s.value}>{data?.email || '—'}</div>
            </div>
            <div style={s.field}>
              <div style={s.label}>Téléphone</div>
              <div style={s.value}>{data?.telephone || '—'}</div>
            </div>
            <div style={s.field}>
              <div style={s.label}>Rôle</div>
              <div style={s.value}>{data?.roles?.[0]?.nom || 'Non assigné'}</div>
            </div>
            <div style={s.field}>
              <div style={s.label}>Statut</div>
              <div style={s.value}>
                {data?.est_actif !== undefined ? (data?.est_actif ? 'Actif' : 'Inactif') : (data?.statut || '—')}
              </div>
            </div>
            <div style={s.field}>
              <div style={s.label}>Super Admin</div>
              <div style={s.value}>{data?.est_superadmin ? 'Oui' : 'Non'}</div>
            </div>
          </div>
          <div style={s.divider} />
          <div style={s.grid}>
            <div style={s.field}>
              <div style={s.label}>Membre depuis</div>
              <div style={s.value}>{formatDate(data?.date_creation || data?.createdAt)}</div>
            </div>
            <div style={s.field}>
              <div style={s.label}>Dernière connexion</div>
              <div style={s.value}>{formatDate(data?.dernier_login || data?.last_login)}</div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div style={s.footerText}>
          Pour modifier vos informations ou changer votre mot de passe, contactez votre administrateur.
        </div>
      </div>
    </Layout>
  );
}

const s = {
  page: { padding: '40px 32px', maxWidth: 800, margin: '0 auto', fontFamily: "'Poppins', sans-serif" },
  header: { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 },
  bigAvatar: { width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #006837, #4CAF50)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, boxShadow: '0 4px 12px rgba(76,175,80,0.3)' },
  title: { fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' },
  badgeWrap: { display: 'flex', gap: 8 },
  superBadge: { padding: '6px 14px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', borderRadius: 999, fontSize: 13, fontWeight: 700 },
  roleBadge: { padding: '6px 14px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 999, fontSize: 13, fontWeight: 700 },
  card: { background: 'white', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: 32, border: '1px solid #f0f4f8' },
  cardTitle: { fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 24 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, paddingBottom: 24 },
  divider: { height: 1, background: '#f1f5f9', margin: '0 0 24px 0' },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#64748b' },
  value: { fontSize: 15, fontWeight: 500, color: '#1e293b' },
  statusBadge: { padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, display: 'inline-block' },
  footerText: { marginTop: 32, textAlign: 'center', fontSize: 13, color: '#3b82f6', fontWeight: 500, opacity: 0.9 },
};
