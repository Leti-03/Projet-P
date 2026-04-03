import ClientSidebar from '../components/client/ClientSidebar';

/**
 * Layout pour les pages qui ne doivent PAS scroller (ex: Réclamation, Suivi).
 * Le main-content est figé en height: 100vh, overflow: hidden.
 * Les autres pages utilisent ClientLayout normal.
 */
export default function ClientLayoutFixed({ children }) {
  return (
    <div className="layout-wrapper">
      <ClientSidebar />
      <main className="main-content-fixed">
        {children}
      </main>
    </div>
  );
}