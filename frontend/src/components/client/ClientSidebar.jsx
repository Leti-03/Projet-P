

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label:'Notifications', path:'/client/notifications',
    icon:(a)=><svg width="18" height="18" viewBox="0 0 24 24" fill={a?'white':'#4CAF50'}><path d="M12 2a7 7 0 00-7 7v6l-2 2v1h18v-1l-2-2V9a7 7 0 00-7-7zm0 20a2 2 0 002-2h-4a2 2 0 002 2z"/></svg> },
  { label:'Réclamations', path:'/client/reclamation',
    icon:(a)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={a?'white':'none'} stroke={a?'white':'#4CAF50'} strokeWidth="2"/><rect x="11" y="6" width="2" height="8" rx="1" fill={a?'#4CAF50':'#4CAF50'}/><circle cx="12" cy="17" r="1.3" fill={a?'#4CAF50':'#4CAF50'}/></svg> },
  { label:'Suivi', path:'/client/suivi',
    icon:(a)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke={a?'white':'#4CAF50'} strokeWidth="2" fill={a?'white':'none'}/></svg> },
  { label:'Historique', path:'/client/historique',
    icon:(a)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={a?'white':'#4CAF50'} strokeWidth="2"/><path d="M12 7v5l3 3" stroke={a?'white':'#4CAF50'} strokeWidth="2" strokeLinecap="round"/></svg> },
  { label:'Promotions', path:'/client/promotions',
    icon:(a)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill={a?'white':'none'} stroke={a?'white':'#4CAF50'} strokeWidth="2" strokeLinejoin="round"/></svg> },
  { label:'Factures', path:'/client/factures',
    icon:(a)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke={a?'white':'#4CAF50'} strokeWidth="2"/><path d="M9 8h6M9 12h6M9 16h4" stroke={a?'white':'#4CAF50'} strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { label:'Assistant', path:'/client/assistant',
    icon:(a)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="4" stroke={a?'white':'#4CAF50'} strokeWidth="2"/><circle cx="9" cy="13" r="2" fill={a?'white':'#4CAF50'}/><circle cx="15" cy="13" r="2" fill={a?'white':'#4CAF50'}/><path d="M12 3v4" stroke={a?'white':'#4CAF50'} strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="2.5" r="1.5" fill={a?'white':'#4CAF50'}/></svg> },
];

export default function ClientSidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [hovered, setHovered] = useState(null);

  return (
    <>
      <style>{`
        @keyframes sbIn { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:none} }
        @keyframes tipIn { from{opacity:0;transform:translateY(-50%) translateX(-6px)} to{opacity:1;transform:translateY(-50%) translateX(0)} }
      `}</style>
      <div style={{
        position:'fixed', left:10, top:10, bottom:10, width:60,
        zIndex:1000, background:'white',
        borderRadius:18, boxShadow:'0 4px 20px rgba(0,0,0,0.10)',
        border:'1px solid #F0F0F0',
        display:'flex', flexDirection:'column', alignItems:'center',
        padding:'14px 0', animation:'sbIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
      }}>
        {/* Logo AT */}
        <div onClick={() => navigate('/client/dashboard')} style={{
          width:38, height:38, borderRadius:10, overflow:'hidden',
          cursor:'pointer', marginBottom:10, flexShrink:0,
          transition:'transform 0.2s', border:'1px solid #E8E8E8',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 2px 6px rgba(0,0,0,0.08)',
        }}
          onMouseEnter={e=>e.currentTarget.style.transform='scale(1.08)'}
          onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
        >
          <svg viewBox="0 0 40 40" width="34" height="34">
            <circle cx="20" cy="20" r="18" fill="white"/>
            <path d="M20 5 A15 15 0 0 0 5 20 A15 15 0 0 0 20 35" stroke="#1565C0" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <path d="M20 5 A15 15 0 0 1 35 20 A15 15 0 0 1 20 35" stroke="#4CAF50" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <path d="M20 11 A9 9 0 0 0 11 20 A9 9 0 0 0 20 29" stroke="#1565C0" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M20 11 A9 9 0 0 1 29 20 A9 9 0 0 1 20 29" stroke="#4CAF50" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <circle cx="20" cy="20" r="3.5" fill="#1565C0"/>
          </svg>
        </div>

        <div style={{ width:30, height:1, background:'#F0F0F0', marginBottom:8 }}/>

        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, width:'100%' }}>
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={i} style={{ position:'relative', width:'100%', display:'flex', justifyContent:'center' }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <button onClick={() => navigate(item.path)} style={{
                  width:40, height:40, borderRadius:12,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  border:'none', cursor:'pointer', transition:'all 0.18s',
                  background: isActive ? '#4CAF50' : hovered===i ? '#F5FBF5' : 'transparent',
                  transform: hovered===i && !isActive ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isActive ? '0 3px 10px rgba(76,175,80,0.4)' : 'none',
                }}>
                  {item.icon(isActive)}
                </button>
                {hovered === i && (
                  <div style={{
                    position:'absolute', left:'calc(100% + 10px)', top:'50%',
                    transform:'translateY(-50%)',
                    background:'#1a1a1a', color:'white',
                    fontSize:11, fontWeight:500, padding:'5px 10px',
                    borderRadius:8, whiteSpace:'nowrap',
                    pointerEvents:'none', animation:'tipIn 0.15s both',
                    fontFamily:'system-ui,sans-serif', zIndex:2000,
                  }}>
                    {item.label}
                    <div style={{ position:'absolute', right:'100%', top:'50%', transform:'translateY(-50%)', width:0, height:0, borderTop:'4px solid transparent', borderBottom:'4px solid transparent', borderRight:'5px solid #1a1a1a' }}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ width:30, height:1, background:'#F0F0F0', marginTop:8, marginBottom:8 }}/>

        <div style={{ position:'relative' }}
          onMouseEnter={() => setHovered('out')}
          onMouseLeave={() => setHovered(null)}
        >
          <button style={{
            width:40, height:40, borderRadius:12,
            display:'flex', alignItems:'center', justifyContent:'center',
            border:'none', cursor:'pointer', transition:'all 0.18s',
            background: hovered==='out' ? '#FEF2F2' : 'transparent',
            transform: hovered==='out' ? 'scale(1.1)' : 'scale(1)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3" stroke="#E53935" strokeWidth="2" strokeLinecap="round"/>
              <path d="M15 8l5 4-5 4M9 12h11" stroke="#E53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {hovered === 'out' && (
            <div style={{
              position:'absolute', left:'calc(100% + 10px)', top:'50%',
              transform:'translateY(-50%)',
              background:'#E53935', color:'white',
              fontSize:11, fontWeight:500, padding:'5px 10px',
              borderRadius:8, whiteSpace:'nowrap',
              pointerEvents:'none', animation:'tipIn 0.15s both',
              fontFamily:'system-ui,sans-serif', zIndex:2000,
            }}>
              Déconnexion
              <div style={{ position:'absolute', right:'100%', top:'50%', transform:'translateY(-50%)', width:0, height:0, borderTop:'4px solid transparent', borderBottom:'4px solid transparent', borderRight:'5px solid #E53935' }}/>
            </div>
          )}
        </div>
      </div>
    </>
  );
}