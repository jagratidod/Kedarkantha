import { useMemo } from 'react'
import AsyncView from '../ui/AsyncView'
import FramedShowcase from './FramedShowcase'
import { useAsync } from '../../hooks/useAsync'
import { getBestTime } from '../../features/trek/api'

/** Best Time to Visit: one step per season, on a framed full-screen photo (same shell as Things to Carry). */

const WHY = {
  'December - February': 'Deep, fresh snow on every stretch of the trail and a frozen Juda Ka Talab. The classic Kedarkantha winter.',
  'March - April': 'Lighter snow, long clear days and the widest Himalayan views from the summit ridge.',
  November: 'The first snowfall of the season with quiet trails and the smallest groups.',
}

const temp = (s) => s.temp.replace('Temperature: ', '')

function Showcase({ data }) {
  const steps = useMemo(
    () =>
      data.seasons.map((s, i) => ({
        id: s.months,
        content: (
          <>
            <p className="gc-line text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70" style={{ '--i': 0 }}>
              {String(i + 1).padStart(2, '0')} · {s.note}
            </p>
            <p className="gc-line mt-3 font-display text-4xl font-medium leading-none md:text-6xl" style={{ '--i': 1 }}>{s.months}</p>
            <p className="gc-line mt-4 inline-flex rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold ring-1 ring-white/30 backdrop-blur" style={{ '--i': 2 }}>{temp(s)}</p>
            <p className="gc-line mt-4 max-w-md text-[13px] leading-relaxed text-white/80 md:text-base" style={{ '--i': 3 }}>{WHY[s.months] || s.note}</p>
          </>
        ),
      })),
    [data],
  )

  const panel = (
    <div className="mx-auto max-w-3xl">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Season guide</p>
      <ul className="divide-y divide-white/15">
        {data.seasons.map((s) => (
          <li key={s.months} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
            <span className="font-display text-2xl md:text-3xl">{s.months}</span>
            <span className="text-sm text-white/75">{s.note} · {temp(s)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs text-white/60">{data.disclaimer}</p>
    </div>
  )

  return (
    <FramedShowcase
      label="Best time to visit"
      heading="Best Time to Visit"
      focus={data.seasons.map((s) => s.focus)}
      steps={steps}
      panel={panel}
      panelLabel="season guide"
      stepHeight="h-[16rem] md:h-[17rem]"
      stepWidth="max-w-[34rem]"
    />
  )
}

export default function BestTimeShowcase() {
  const state = useAsync(getBestTime)
  return (
    <AsyncView state={state} fallback={<div className="h-svh bg-white" />}>
      {(d) => <Showcase data={d} />}
    </AsyncView>
  )
}
