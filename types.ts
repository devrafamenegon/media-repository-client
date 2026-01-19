export interface Media {
  id: string
  numericId: number
  label: string
  url: string
  participantId: string
  isNsfw: boolean
  viewCount?: number
}

export interface Participant {
  id: string
  name: string,
  txtColor: string,
  bgColor: string
}

export interface ReactionType {
  id: string
  key: string
  label: string
  emoji?: string | null
  order: number
  isActive: boolean
}

export interface MediaComment {
  id: string
  mediaId: string
  userId: string
  authorName?: string | null
  authorImageUrl?: string | null
  body: string
  createdAt: string
  updatedAt: string
}

export interface Routes {
  href: string
  label: string
  active: boolean
}