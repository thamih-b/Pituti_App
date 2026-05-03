export const CONDITION_GROUPS = {
  endocrine:    'Endócrinas y Metabólicas',
  degenerative: 'Degenerativas y Estructurales',
  viral:        'Virales Incurables',
  neurological: 'Neurológicas y Autoinmunes',
  other:        'Otras Condiciones',
} as const

export interface ConditionItem {
  id: string; label: string; group: string; species?: 'cat' | 'dog'
}

export const CONDITIONS_CATALOG: ConditionItem[] = [
  { id: 'diabetes',        label: 'Diabetes Mellitus',            group: CONDITION_GROUPS.endocrine },
  { id: 'hypothyroidism',  label: 'Hipotiroidismo',               group: CONDITION_GROUPS.endocrine,    species: 'dog' },
  { id: 'hyperthyroidism', label: 'Hipertiroidismo',              group: CONDITION_GROUPS.endocrine,    species: 'cat' },
  { id: 'ckd',             label: 'Insuficiencia Renal Crónica',  group: CONDITION_GROUPS.degenerative },
  { id: 'arthritis',       label: 'Artritis y Artrosis',          group: CONDITION_GROUPS.degenerative },
  { id: 'hipdysplasia',    label: 'Displasia de Cadera',          group: CONDITION_GROUPS.degenerative },
  { id: 'cardiopathy',     label: 'Cardiopatías Crónicas',        group: CONDITION_GROUPS.degenerative },
  { id: 'felv',            label: 'FeLV Leucemia Felina',         group: CONDITION_GROUPS.viral,        species: 'cat' },
  { id: 'fiv',             label: 'FIV Inmunodeficiencia Felina', group: CONDITION_GROUPS.viral,        species: 'cat' },
  { id: 'epilepsy',        label: 'Epilepsia',                    group: CONDITION_GROUPS.neurological },
  { id: 'lupus',           label: 'Lupus y Pénfigo',              group: CONDITION_GROUPS.neurological },
  { id: 'atopy',           label: 'Atopia y Alergias Crónicas',   group: CONDITION_GROUPS.other },
  { id: 'blinddeaf',       label: 'Ceguera o Sordera',            group: CONDITION_GROUPS.other },
]