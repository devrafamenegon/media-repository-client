export interface Media {
  id: string
  label: string
  url: string
  participantId: string
}

export interface Participant {
  id: string
  name: string
}

export interface Routes {
  href: string
  label: string
  active: boolean
}