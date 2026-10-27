import { useMemo } from 'react'
import AsyncView from '../ui/AsyncView'
import Icon from '../ui/Icon'
import FramedShowcase from './FramedShowcase'
import { useAsync } from '../../hooks/useAsync'
import { getThingsToCarry } from '../../features/trek/api'

/** Things to Carry: four groups of items, stepped through on a framed full-screen photo. */

const NOTES = {
  shoe: 'Waterproof, ankle-high, with a firm grip for snow and ice.',
  jacket: 'A down or woollen jacket for sub-zero nights above the tree line.',
  shirt: 'Thermal tops and bottoms as your base layer, never cotton.',
  glove: 'Insulated gloves, a woollen cap and a muffler for the summit wind.',
  glasses: 'UV-protection sunglasses against snow glare.',
  bottle: 'A one-litre bottle; hot water at camp keeps it from freezing.',
  pill: 'Your own medicines, plus the guide carries the group first-aid kit.',
  backpack: 'A 40-50 L pack with a rain cover and a comfortable hip belt.',
  torch: 'A headlamp keeps both hands free on the pre-dawn summit push.',
  pole: 'Poles take the load off your knees on the long descent.',
  snack: 'Energy bars and dry fruits for the climb between meals.',
  camera: 'A camera and a power bank; cold drains batteries fast.',
  sock: 'Extra woollen socks, a dry pair for every night at camp.',
  sun: 'Sunscreen and lip balm; the sun is strong at 12,500 ft.',
}

function groupSteps(d) {
  const m = d.mandatory, o = d.optional
  return [
    { kicker: 'Mandatory', title: 'Wear it', items: m.slice(0, 4) },
    { kicker: 'Mandatory', title: 'Carry it', items: m.slice(4) },
    { kicker: 'Optional', title: 'Good to have', items: o.slice(0, 3) },
    { kicker: 'Optional', title: 'Little extras', items: o.slice(3) },
  ]
}

function Showcase({ data }) {
  const steps = useMemo(
    () =>
      groupSteps(data).map((st, i) => ({
        id: st.title,
        content: (
          <>
            <p className="gc-line text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70" style={{ '--i': 0 }}>
              {String(i + 1).padStart(2, '0')} · {st.kicker} · {st.title}
            </p>
            <ul className="mt-3 space-y-2.5">
              {st.items.map((it, j) => (
                <li key={it.text} className="gc-line flex items-start gap-3" style={{ '--i': j + 1 }}>
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur">
                    <Icon name={it.icon} size={16} />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold leading-tight md:text-lg">{it.text}</span>
                    <span className="block text-[12px] leading-snug text-white/75 md:text-sm">{NOTES[it.icon] || 'Pack it before you leave Dehradun.'}</span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        ),
      })),
    [data],
  )

  const panel = (
    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
      {[['Mandatory', data.mandatory], ['Optional', data.optional]].map(([t, list]) => (
        <div key={t}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{t} items</p>
          <ul className="space-y-3">
            {list.map((it) => (
              <li key={it.text} className="flex items-center gap-3 text-sm md:text-base">
                <Icon name={it.icon} size={18} className="shrink-0 text-white/80" /> {it.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )

  return <FramedShowcase label="Things to carry" heading="Things to Carry" steps={steps} panel={panel} panelLabel="complete packing checklist" />
}

export default function ThingsCarryShowcase() {
  const state = useAsync(getThingsToCarry)
  return (
    <AsyncView state={state} fallback={<div className="h-svh bg-white" />}>
      {(d) => <Showcase data={d} />}
    </AsyncView>
  )
}
