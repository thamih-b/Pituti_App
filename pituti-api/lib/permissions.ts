// lib/permissions.ts
export class PermissionError extends Error {
  status = 403;
  constructor(message = "Sem permissão") {
    super(message);
    this.name = "PermissionError";
  }
}

type ResourceWithOwner = {
  ownerId?: string | null;
  userId?: string | null;
  vetContactId?: string | null;
};

export function assertOwnership(
  resource: ResourceWithOwner | null | undefined,
  currentUserId: string,
  message = "Você não tem permissão para acessar este recurso"
) {
  if (!resource) {
    throw new PermissionError(message);
  }

  const ownerId =
    resource.ownerId ?? resource.userId ?? resource.vetContactId ?? null;

  if (!ownerId || ownerId !== currentUserId) {
    throw new PermissionError(message);
  }

  return true;
}