// traduzido e sem mock

// conditions.ts
export const CONDITION_GROUP_KEYS = {
  endocrine:    'conditions.groups.endocrine',
  degenerative: 'conditions.groups.degenerative',
  viral:        'conditions.groups.viral',
  neurological: 'conditions.groups.neurological',
  other:        'conditions.groups.other',
} as const

export type ConditionLabelKey =
  | 'conditions.labels.diabetes'
  | 'conditions.labels.hypothyroidism'
  | 'conditions.labels.hyperthyroidism'
  | 'conditions.labels.ckd'
  | 'conditions.labels.arthritis'
  | 'conditions.labels.hipdysplasia'
  | 'conditions.labels.cardiopathy'
  | 'conditions.labels.felv'
  | 'conditions.labels.fiv'
  | 'conditions.labels.epilepsy'
  | 'conditions.labels.lupus'
  | 'conditions.labels.atopy'
  | 'conditions.labels.blinddeaf'

export type ConditionGroupKey =
  | 'conditions.groups.endocrine'
  | 'conditions.groups.degenerative'
  | 'conditions.groups.viral'
  | 'conditions.groups.neurological'
  | 'conditions.groups.other'

export interface ConditionItem {
  id: string
  labelKey: ConditionLabelKey
  groupKey: ConditionGroupKey
  species?: 'cat' | 'dog'
}
export const CONDITIONS_CATALOG = [
  { id: 'diabetes',        labelKey: 'conditions.labels.diabetes',        groupKey: CONDITION_GROUP_KEYS.endocrine },
  { id: 'hypothyroidism',  labelKey: 'conditions.labels.hypothyroidism',  groupKey: CONDITION_GROUP_KEYS.endocrine,    species: 'dog' },
  { id: 'hyperthyroidism', labelKey: 'conditions.labels.hyperthyroidism', groupKey: CONDITION_GROUP_KEYS.endocrine,    species: 'cat' },
  { id: 'ckd',             labelKey: 'conditions.labels.ckd',             groupKey: CONDITION_GROUP_KEYS.degenerative },
  { id: 'arthritis',       labelKey: 'conditions.labels.arthritis',       groupKey: CONDITION_GROUP_KEYS.degenerative },
  { id: 'hipdysplasia',    labelKey: 'conditions.labels.hipdysplasia',    groupKey: CONDITION_GROUP_KEYS.degenerative },
  { id: 'cardiopathy',     labelKey: 'conditions.labels.cardiopathy',     groupKey: CONDITION_GROUP_KEYS.degenerative },
  { id: 'felv',            labelKey: 'conditions.labels.felv',            groupKey: CONDITION_GROUP_KEYS.viral,        species: 'cat' },
  { id: 'fiv',             labelKey: 'conditions.labels.fiv',             groupKey: CONDITION_GROUP_KEYS.viral,        species: 'cat' },
  { id: 'epilepsy',        labelKey: 'conditions.labels.epilepsy',        groupKey: CONDITION_GROUP_KEYS.neurological },
  { id: 'lupus',           labelKey: 'conditions.labels.lupus',           groupKey: CONDITION_GROUP_KEYS.neurological },
  { id: 'atopy',           labelKey: 'conditions.labels.atopy',           groupKey: CONDITION_GROUP_KEYS.other },
  { id: 'blinddeaf',       labelKey: 'conditions.labels.blinddeaf',       groupKey: CONDITION_GROUP_KEYS.other },
] as const satisfies readonly ConditionItem[]