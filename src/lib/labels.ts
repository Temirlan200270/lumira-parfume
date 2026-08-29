export function genderLabel(gender: 'male' | 'female' | 'unisex'): string {
  if (gender === 'male') return 'Мужской'
  if (gender === 'female') return 'Женский'
  return 'Унисекс'
}

export function sectionLabel(section: 'razliv' | 'raspiv'): string {
  return section === 'raspiv' ? 'Распив' : 'Разлив'
}

export function perfumeHref(slug: string | undefined): string {
  return slug ? `/perfume/${slug}` : '/'
}

export function aromaCountLabel(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return `${count} аромат`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} аромата`
  return `${count} ароматов`
}
