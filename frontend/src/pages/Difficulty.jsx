import PageHero from '../components/layout/PageHero'
import AsyncView from '../components/ui/AsyncView'
import FitnessQuiz from '../components/sections/FitnessQuiz'
import { useAsync } from '../hooks/useAsync'
import { useSeo } from '../hooks/useSeo'
import { getDifficulty } from '../features/trek/api'

export default function Difficulty({ embedded = false }) {
  useSeo({ enabled: !embedded, title: 'Difficulty & Fitness', description: 'Kedarkantha is an easy-moderate trek. Take the quick fitness quiz to see if you are ready.' })
  const state = useAsync(getDifficulty)
  return (
    <>
      {!embedded && <PageHero title="Difficulty & Fitness" subtitle="Know what to expect before you go." focus="70% 45%" />}
      <section className="bg-[#0E2233] px-4 py-14 sm:py-20" aria-labelledby="quiz-title">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#7EB5D6]">Difficulty &amp; Fitness</p>
          <h2 id="quiz-title" className="mt-2 font-display text-4xl font-semibold leading-tight text-white sm:text-6xl">Are you ready for Kedarkantha?</h2>
          <p className="mt-3 text-sm text-[#8FAEC5] sm:text-base">Five quick questions. No wrong answers, just an honest idea of how the trek will feel for you.</p>
        </div>
        <AsyncView state={state}>{(d) => <FitnessQuiz info={d} />}</AsyncView>
      </section>
    </>
  )
}
