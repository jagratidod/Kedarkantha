import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { Skeleton } from '../components/ui/AsyncView'
import { BookingProvider } from '../features/booking/BookingContext'
import BookingLayout from '../features/booking/BookingLayout'
import Home from '../pages/Home'

const page = (loader) => lazy(loader)
const Itinerary = page(() => import('../pages/Itinerary'))
const Departures = page(() => import('../pages/Departures'))
const Gallery = page(() => import('../pages/Gallery'))
const About = page(() => import('../pages/About'))
const Inclusions = page(() => import('../pages/Inclusions'))
const PickupDrop = page(() => import('../pages/PickupDrop'))
const Difficulty = page(() => import('../pages/Difficulty'))
const ThingsToCarry = page(() => import('../pages/ThingsToCarry'))
const BestTime = page(() => import('../pages/BestTime'))
const Faqs = page(() => import('../pages/Faqs'))
const Reviews = page(() => import('../pages/Reviews'))
const StepDate = page(() => import('../features/booking/StepDate'))
const StepTravellers = page(() => import('../features/booking/StepTravellers'))
const StepPayment = page(() => import('../features/booking/StepPayment'))
const BookingConfirmed = page(() => import('../pages/BookingConfirmed'))
const NotFound = page(() => import('../pages/NotFound'))

const Fallback = () => (
  <div className="container-page space-y-4 py-10" role="status" aria-label="Loading">
    <Skeleton className="h-10 w-1/2" /><Skeleton className="h-48 w-full" />
  </div>
)

export default function AppRoutes() {
  return (
    <BookingProvider>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="itinerary" element={<Itinerary />} />
            <Route path="departures" element={<Departures />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="about" element={<About />} />
            <Route path="inclusions" element={<Inclusions />} />
            <Route path="pickup-drop" element={<PickupDrop />} />
            <Route path="difficulty" element={<Difficulty />} />
            <Route path="things-to-carry" element={<ThingsToCarry />} />
            <Route path="best-time" element={<BestTime />} />
            <Route path="faqs" element={<Faqs />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="book" element={<BookingLayout />}>
              <Route index element={<Navigate to="date" replace />} />
              <Route path="date" element={<StepDate />} />
              <Route path="travellers" element={<StepTravellers />} />
              <Route path="payment" element={<StepPayment />} />
            </Route>
            <Route path="booking/confirmed/:id" element={<BookingConfirmed />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BookingProvider>
  )
}
