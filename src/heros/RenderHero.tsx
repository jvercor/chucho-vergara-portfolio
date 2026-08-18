import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { ModelHero } from '@/heros/ModelHero'
import { TerminalHero } from '@/heros/TerminalHero'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'

const heroes = {
  highImpact: HighImpactHero,
  modelHero: ModelHero,
  terminalHero: TerminalHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
