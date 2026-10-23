export default function Card({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`rounded-[var(--radius-card)] border border-line bg-white shadow-card ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
