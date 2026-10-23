import Card from '../ui/Card'
import Icon from '../ui/Icon'

/** Centered icon + title + caption card (overview stats, about pillars, values, inclusions). */
export default function IconCard({ icon, title, text, className = '' }) {
  return (
    <Card className={`flex flex-col items-center gap-1.5 p-4 text-center ${className}`}>
      <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-full text-forest ring-1 ring-forest/25">
        <Icon name={icon} size={20} />
      </span>
      <p className="text-sm font-semibold leading-tight">{title}</p>
      {text && <p className="text-xs text-muted">{text}</p>}
    </Card>
  )
}
