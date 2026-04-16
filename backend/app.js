import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';

const app = express();

app.use(cors({ origin: process.env.CRM_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes CRM ───────────────────────────────────────────────────────────
import authRoutes          from './routes/crm/auth.routes.js';
import usersRoutes         from './routes/crm/users.routes.js';
import rolesRoutes         from './routes/crm/roles.routes.js';
import techniciensRoutes   from './routes/crm/techniciens.routes.js';
import interventionsRoutes from './routes/crm/interventions.routes.js';
import logsRoutes          from './routes/crm/logs.routes.js';
import notificationsRoutes from './routes/crm/notifications.routes.js';
import statsRoutes         from './routes/crm/stats.routes.js';
import facturesCRMRoutes   from './routes/crm/factures.routes.js';

app.use('/api/crm/auth',          authRoutes);
app.use('/api/crm/users',         usersRoutes);
app.use('/api/crm/roles',         rolesRoutes);
app.use('/api/crm/techniciens',   techniciensRoutes);
app.use('/api/crm/interventions', interventionsRoutes);
app.use('/api/crm/logs',          logsRoutes);
app.use('/api/crm/notifications', notificationsRoutes);
app.use('/api/crm/stats',         statsRoutes);
app.use('/api/crm/factures',      facturesCRMRoutes);

// ─── Routes Client ────────────────────────────────────────────────────────
import facturesClientRoutes from './routes/client/factures.routes.js';
app.use('/api/client/factures', facturesClientRoutes);

// ─── Santé ────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'OK', message: 'CRM API is running' }));

// ─── Erreurs globales ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Erreur globale:', err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur interne' });
});

app.listen(ENV.PORT, () => {
  console.log(`🚀 CRM AT — Serveur démarré sur le port ${ENV.PORT}`);
});

export default app;