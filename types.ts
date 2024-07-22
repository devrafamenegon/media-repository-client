export interface Media {
  id: string
  numericId: number
  label: string
  url: string
  participantId: string
  isNsfw: string
}

export interface Participant {
  id: string
  name: string,
  txtColor: string,
  bgColor: string
}

export interface Routes {
  href: string
  label: string
  active: boolean
}