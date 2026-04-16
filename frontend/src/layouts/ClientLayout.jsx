import ClientSidebar from '../components/client/ClientSidebar';

export default function ClientLayout({ children }) {
  return (
    <div className="layout-wrapper">
      <aside className="client-sidebar-aside">
        <ClientSidebar />
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}