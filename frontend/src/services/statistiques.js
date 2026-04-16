import crmApi from './crm/api';

const statsService = {
  getKpis: () =>
    crmApi.get('/stats/kpis').then((r) => r.data),

  getEvolutionMensuelle: () =>
    crmApi.get('/stats/evolution').then((r) => r.data),

  getRepartitionReclamations: () =>
    crmApi.get('/stats/reclamations/repartition').then((r) => r.data),

  getDernieresActivites: () =>
    crmApi.get('/stats/activites').then((r) => r.data),

  getAlertes: () =>
    crmApi.get('/stats/alertes').then((r) => r.data),

  getPerformancesAgents: () =>
    crmApi.get('/stats/performances/agents').then((r) => r.data),
};

export default statsService;