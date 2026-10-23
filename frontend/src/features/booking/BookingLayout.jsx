import { Outlet, useLocation } from 'react-router-dom'
import Stepper from '../../components/ui/Stepper'

export const STEPS = ['Select Date', 'Traveller Details', 'Payment']
const PATHS = ['/book/date', '/book/travellers', '/book/payment']

export default function BookingLayout() {
  const { pathname } = useLocation()
  const current = Math.max(0, PATHS.indexOf(pathname))
  return (
    <div className="container-page max-w-2xl py-6 sm:py-10">
      <Stepper steps={STEPS} current={current} />
      <div className="mt-6"><Outlet /></div>
    </div>
  )
}
