// src/hooks/useDemandes.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/demandes-service';

// ── Toutes les demandes avec filtres ─────────────────────────────────────────
export function useDemandes({ type_service, statut, page = 1, limit = 20 } = {}) {
  const [data, setData]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit });
      if (type_service) params.append('type_service', type_service);
      if (statut)       params.append('statut', statut);
      const res = await axios.get(`${API}?${params}`);
      setData(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur chargement');
    } finally {
      setLoading(false);
    }
  }, [type_service, statut, page, limit]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, total, loading, error, refetch: fetch };
}

// ── Comptage par catégorie ────────────────────────────────────────────────────
export function useDemandesStats() {
  const [stats, setStats]     = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const SERVICES = ['ligne_telephonique', 'adsl', 'achat_modem', 'ip_fixe', 'fttx'];

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          SERVICES.map(s =>
            axios.get(`${API}?type_service=${s}&limit=1`).then(r => ({
              type: s,
              total: r.data.total || 0,
              en_attente: 0,
            }))
          )
        );
        // Aussi fetch par statut en_attente
        const pending = await Promise.all(
          SERVICES.map(s =>
            axios.get(`${API}?type_service=${s}&statut=en_attente&limit=1`).then(r => ({
              type: s,
              count: r.data.total || 0,
            }))
          )
        );
        const pendingMap = Object.fromEntries(pending.map(p => [p.type, p.count]));
        const map = Object.fromEntries(results.map(r => [r.type, { total: r.total, en_attente: pendingMap[r.type] || 0 }]));
        setStats(map);
      } catch (err) {
        setError('Erreur chargement stats');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { stats, loading, error };
}

// ── Une demande par ID ────────────────────────────────────────────────────────
export function useDemandeById(id) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`${API}/${id}`)
      .then(r => setData(r.data))
      .catch(err => setError(err.response?.data?.error || 'Introuvable'))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

// ── Mise à jour du statut ─────────────────────────────────────────────────────
export async function updateDemandeStatut(id, statut) {
  const res = await axios.put(`http://localhost:5000/api/demandes-service/${id}/statut`, { statut });
  return res.data;
}