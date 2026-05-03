import { api } from './client';
import type { ApiNote, CreateNoteDto, UpdateNoteDto } from './types';

export const notesApi = {
  getAll:  (petId: string)                               => api.get<ApiNote[]>(`/pets/${petId}/notes`),
  getById: (petId: string, id: string)                   => api.get<ApiNote>(`/pets/${petId}/notes/${id}`),
  create:  (petId: string, dto: CreateNoteDto)           => api.post<ApiNote>(`/pets/${petId}/notes`, dto),
  update:  (petId: string, id: string, dto: UpdateNoteDto) => api.patch<ApiNote>(`/pets/${petId}/notes/${id}`, dto),
  delete:  (petId: string, id: string)                   => api.delete<void>(`/pets/${petId}/notes/${id}`),
};
