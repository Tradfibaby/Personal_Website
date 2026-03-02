export default function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: '0.7rem',
      letterSpacing: '0.15em',
      color: '#555',
      textTransform: 'uppercase',
      marginBottom: '1.5rem',
    }}>
      {children}
    </p>
  )
}
