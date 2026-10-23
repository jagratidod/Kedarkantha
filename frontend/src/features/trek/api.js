import { request } from '../../lib/apiClient'
import * as d from './data'

export const getHome = () =>
  request('/trek', { mock: () => ({ trek: d.trek, highlights: d.highlights }) })
export const getJourneys = () => request('/journeys', { mock: () => d.journeys })
export const getItinerary = () => request('/trek/itinerary', { mock: () => d.itinerary })
export const getGallery = () =>
  request('/gallery', { mock: () => ({ categories: d.galleryCategories, items: d.gallery }) })
export const getAbout = () => request('/about', { mock: () => d.about })
export const getInclusions = () => request('/trek/inclusions', { mock: () => d.inclusions })
export const getPickup = () => request('/trek/pickup', { mock: () => d.pickup })
export const getDifficulty = () => request('/trek/difficulty', { mock: () => d.difficulty })
export const getThingsToCarry = () => request('/trek/carry', { mock: () => d.thingsToCarry })
export const getBestTime = () => request('/trek/best-time', { mock: () => d.bestTime })
export const getFaqs = () => request('/faqs', { mock: () => d.faqs })
