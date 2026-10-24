import { useState } from 'react'
import PageHero from '../components/layout/PageHero'
import CTABanner from '../components/layout/CTABanner'
import AsyncView from '../components/ui/AsyncView'
import Chips from '../components/ui/Chips'
import { useAsync } from '../hooks/useAsync'
import { useSeo } from '../hooks/useSeo'
import { getGallery } from '../features/trek/api'

import GalleryHeader from '../components/gallery/GalleryHeader'
import {
  ExactFamilyMosaicGrid,
  ExactCenterTextMosaicGrid,
  AsymmetricSteppedArchGrid,
  ScatteredColorGrid,
  EditorialRealEstateGrid,
} from '../components/gallery/GalleryGrids'

export default function Gallery({ embedded = false }) {
  useSeo({ enabled: !embedded, title: 'Photo Gallery', description: 'Moments from our Kedarkantha treks: summit sunrises, snowy trails, campsites and happy groups.' })
  const state = useAsync(getGallery)
  const [cat, setCat] = useState('All')

  const renderGrid = (category, list) => {
    switch (category) {
      case 'All':
        return <ExactFamilyMosaicGrid items={list} centerTitle="KEDARKANTHA" />
      case 'Summit':
        return <AsymmetricSteppedArchGrid items={list} />
      case 'Trails':
        return <ScatteredColorGrid items={list} />
      case 'Campsites':
        return <EditorialRealEstateGrid items={list} />
      case 'Groups':
        return <ExactCenterTextMosaicGrid items={list} centerTitle="TREK BUDDIES" />
      case 'Scenery':
        return <ExactFamilyMosaicGrid items={list} centerTitle="SCENERY" />
      default:
        return <ExactFamilyMosaicGrid items={list} centerTitle="KEDARKANTHA" />
    }
  }

  return (
    <>
      {!embedded && <PageHero title="Photo Gallery" subtitle="Moments from our Kedarkantha treks." focus="50% 40%" />}
      <section className="w-full py-8 sm:py-12">
        <AsyncView state={state}>
          {({ categories, items }) => {
            const list = cat === 'All' ? items : items.filter((i) => i.category === cat)
            return (
              <>
                {embedded ? (
                  <GalleryHeader title="Photo Gallery" subtitle="Moments from our Kedarkantha treks.">
                    <div className="flex justify-center">
                      <Chips variant="outline" options={categories} value={cat} onChange={setCat} label="Filter photos" />
                    </div>
                  </GalleryHeader>
                ) : (
                  <div className="mb-8 flex justify-center">
                    <Chips options={categories} value={cat} onChange={setCat} label="Filter photos" />
                  </div>
                )}
                {list.length === 0 ? (
                  <p className="py-10 text-center text-muted">No photos in this category yet.</p>
                ) : (
                  <div key={cat} className="transition-all duration-500 ease-out animate-in fade-in">
                    {renderGrid(cat, list)}
                  </div>
                )}
              </>
            )
          }}
        </AsyncView>
      </section>
      {!embedded && <CTABanner title="Be a Part of Our Stories" text="Create your own Himalayan memories." label="Book Your Trek" to="/book" />}
    </>
  )
}
