import { motion, AnimatePresence } from 'framer-motion';

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' },
  modal: { background: '#fff', borderRadius: '30px', padding: '50px', maxWidth: '450px', width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' },
  successCircle: { width: '100px', height: '100px', background: '#78BE20', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: 'white', fontSize: '50px', boxShadow: '0 10px 20px rgba(120, 190, 32, 0.3)' },
  title: { fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '15px', marginTop: 0 },
  text: { fontSize: '15px', color: '#64748b', lineHeight: 1.6, marginBottom: '30px' },
  btn: { background: '#1e293b', color: '#fff', border: 'none', padding: '16px 35px', borderRadius: '15px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: '0.3s', boxShadow: '0 10px 20px rgba(30, 41, 59, 0.2)' },
};

export default function ConfirmationSoumission({ isVisible, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          style={styles.overlay}
        >
          <motion.div 
            initial={{ scale: 0.5, y: 100, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.5, y: 100, opacity: 0 }} 
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            style={styles.modal}
          >
            {/* Cercle animé au lieu du fichier JSON manquant */}
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1, rotate: 360 }} 
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              style={styles.successCircle}
            >
              ✓
            </motion.div>

            <h2 style={styles.title}>Réclamation Envoyée !</h2>
            <p style={styles.text}>
              Merci ! Votre demande a été transmise avec succès à nos équipes techniques. Un conseiller reviendra vers vous rapidement.
            </p>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={styles.btn} 
              onClick={onClose}
            >
              RETOUR AU FORMULAIRE
            </motion.button>

            {/* Petites particules décoratives (remplace les confettis) */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0], y: [-20, -100], x: (i % 2 === 0 ? -50 : 50) * Math.random() }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                style={{ position: 'absolute', top: '50%', left: '50%', width: '10px', height: '10px', background: i % 2 === 0 ? '#78BE20' : '#0070B8', borderRadius: '50%' }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}