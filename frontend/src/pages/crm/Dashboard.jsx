import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import Layout             from '../../components/crm/common/Layout';
import CarteRecap         from '../../components/crm/dashboard/CarteRecap';
import Graphique          from '../../components/crm/dashboard/Graphique';
import Alertes            from '../../components/crm/dashboard/Alertes';
import DernieresActivites from '../../components/crm/dashboard/DernieresActivites';
import StatsVentes        from '../../components/crm/dashboard/StatsVentes';
import ActionsRapides     from '../../components/crm/dashboard/ActionsRapides';
import MesTaches          from '../../components/crm/dashboard/MesTaches';
import statsService       from '../../services/statistiques';

export default function Dashboard() {
  const [kpis,        setKpis]        = useState(null);
  const [evolution,   setEvolution]   = useState([]);
  const [repartition, setRepartition] = useState([]);
  const [activites,   setActivites]   = useState([]);
  const [alertes,     setAlertes]     = useState([]);
  const [agents,      setAgents]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchAll = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const [k, ev, rep, act, al, ag] = await Promise.all([
        statsService.getKpis(),
        statsService.getEvolutionMensuelle(),
        statsService.getRepartitionReclamations(),
        statsService.getDernieresActivites(),
        statsService.getAlertes(),
        statsService.getPerformancesAgents(),
      ]);
      setKpis(k); setEvolution(ev); setRepartition(rep);
      setActivites(act); setAlertes(al); setAgents(ag);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    const interval = setInterval(() => fetchAll(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return (
    <Layout>
      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 className="at-title">Dashboard</h1>
          <p className="at-subtitle">
            Mis à jour à {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button
          onClick={() => fetchAll(true)}
          disabled={refreshing}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
            border: '1px solid var(--at-border)', borderRadius: 12, background: 'white',
            fontSize: 13, fontWeight: 600, color: 'var(--at-text-sub)', cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif', opacity: refreshing ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          Actualiser
        </button>
      </div>

      {/* KPIs */}
      <CarteRecap data={kpis} loading={loading} />

      {/* Graphique + Alertes */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginTop: 20 }}>
        <Graphique data={evolution} loading={loading} />
        <Alertes data={alertes} loading={loading} />
      </div>

      {/* Stats réclamations + agents */}
      <div style={{ marginTop: 20 }}>
        <StatsVentes repartition={repartition} agents={agents} loading={loading} />
      </div>

      {/* Activités + Actions + Tâches */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 20 }}>
        <DernieresActivites data={activites} loading={loading} />
        <ActionsRapides />
        <MesTaches />
      </div>
    </Layout>
  );
}