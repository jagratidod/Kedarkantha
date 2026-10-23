import AsyncView from '../components/ui/AsyncView'
import FaqPhoneShowcase from '../components/sections/FaqPhoneShowcase'
import { useAsync } from '../hooks/useAsync'
import { useSeo } from '../hooks/useSeo'
import { getFaqs } from '../features/trek/api'

export default function Faqs({ embedded = false }) {
  const state = useAsync(getFaqs)
  useSeo({ enabled: !embedded,
    title: 'FAQs - Kedarkantha Trek',
    description: 'Answers to common questions about the Kedarkantha trek: best time, difficulty, age limit, weather and cancellation.',
    jsonLd: state.data && {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: state.data.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  })
  return (
    <AsyncView state={state}>
      {(faqs) => <FaqPhoneShowcase faqs={faqs} />}
    </AsyncView>
  )
}
