import {api} from './client'
import type { ApiNote, CreateNoteDto, UpdateNoteDto } from './types'
import { mapApiNote, toApiCreateNoteDto, toApiUpdateNoteDto } from './mappers'

export const notesApi = {
  async getAll(petId: string) {
    const res = await api.get<any[]>(`/pets/${petId}/notes`)
    return { ...res, data: res.data.map(mapApiNote) as ApiNote[] }
  },

  async getById(petId: string, id: string) {
    const res = await api.get<any>(`/pets/${petId}/notes/${id}`)
    return { ...res, data: mapApiNote(res.data) as ApiNote }
  },

  async create(petId: string, dto: CreateNoteDto) {
    const res = await api.post<any>(`/pets/${petId}/notes`, toApiCreateNoteDto(dto))
    return { ...res, data: mapApiNote(res.data) as ApiNote }
  },

  async update(petId: string, id: string, dto: UpdateNoteDto) {
    const res = await api.patch<any>(`/pets/${petId}/notes/${id}`, toApiUpdateNoteDto(dto))
    return { ...res, data: mapApiNote(res.data) as ApiNote }
  },

  delete(petId: string, id: string) {
    return api.delete<void>(`/pets/${petId}/notes/${id}`)
  },
}