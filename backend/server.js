import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

// ── Routes portail client ──────────────────────────────────────────────────────
import clientsRoutes       from './routes/client/Clients.routes.js';
import reclamationsRoutes  from './routes/reclamations.routes.js';
import performancesRoutes  from './routes/performances.routes.js';
import assignationRoutes   from './routes/assignation.routes.js';
import offresRoutes        from './routes/Offres.routes.js';
import demandeServiceRoutes from './routes/client/demandeService.route.js';
import categoriesRoutes    from './routes/client/categoriesReclamations.routes.js';

// ── Routes CRM interne ────────────────────────────────────────────────────────
import crmAuthRoutes          from './routes/crm/auth.routes.js';
import crmUsersRoutes         from './routes/crm/users.routes.js';
import crmRolesRoutes         from './routes/crm/roles.routes.js';
import crmLogsRoutes          from './routes/crm/logs.routes.js';
import crmNotificationsRoutes from './routes/crm/notifications.routes.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.set('io', io);

// ── Routes portail client ──────────────────────────────────────────────────────
app.use('/api/clients',                clientsRoutes);
app.use('/api/reclamations',           reclamationsRoutes);
app.use('/api/performances',           performancesRoutes);
app.use('/api/assignation',            assignationRoutes);
app.use('/api/offres',                 offresRoutes);
app.use('/api/demandes-service',       demandeServiceRoutes);
app.use('/api/categories-reclamation', categoriesRoutes);

// ── Routes CRM interne ────────────────────────────────────────────────────────
app.use('/api/crm/auth',          crmAuthRoutes);
app.use('/api/crm/users',         crmUsersRoutes);
app.use('/api/crm/roles',         crmRolesRoutes);
app.use('/api/crm/logs',          crmLogsRoutes);
app.use('/api/crm/notifications', crmNotificationsRoutes);

// ── Socket.IO ─────────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  socket.on('join_user',        (userId)        => socket.join(`user_${userId}`));
  socket.on('join_tech',        (techId)        => socket.join(`tech_${techId}`));
  socket.on('join_reclamation', (reclamationId) => socket.join(`reclamation_${reclamationId}`));
  socket.on('disconnect', () => {});
});

// ── Santé ─────────────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'OK', timestamp: new Date() }));

// ── Erreurs globales ──────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur', details: err.message });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 CRM AT — Serveur démarré sur le port ${PORT}`));