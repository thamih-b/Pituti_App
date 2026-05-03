# PITUTI API — Pruebas Manuales (Tarea 11)

**Fecha:** 2026-05-03  
**Entorno:** Desarrollo local — `http://localhost:3001`  
**Herramienta:** PowerShell (`Invoke-WebRequest` / `Invoke-RestMethod`)

---

## ✅ GET /api/health

**Comando:**
```powershell
curl http://localhost:3001/api/health
```

**Resultado:** `200 OK`

```
StatusCode        : 200
StatusDescription : OK
Content           : {"status":"ok","service":"PITUTI API","version":"1.0.0",
                    "timestamp":"2026-05-03T18:45:56.482Z","endpoints":[...]}
Headers:
  Access-Control-Allow-Origin : *
  Content-Type                : application/json; charset=utf-8
  Content-Length              : 710
```

**Observación:** El aviso de seguridad de PowerShell es esperado — `curl` es un alias de
`Invoke-WebRequest`. No representa ningún riesgo ya que la respuesta es JSON puro de un
servidor local. Se recomienda usar `Invoke-RestMethod` para las siguientes pruebas.

---

## ✅ GET /api/pets

**Comando:**
```powershell
Invoke-RestMethod http://localhost:3001/api/pets
```

**Resultado:** `200 OK`

```
data
----
{@{id=pet-demo-001; name=Luna; species=cat; breed=Siamés;
   birthDate=2020-03-12; photoUrl=; ownerId=user-demo-001;
   createdAt=2024-01-15T10:0...}
```

**Datos de seed verificados:**
| Campo | Valor |
|---|---|
| `id` | `pet-demo-001` |
| `name` | Luna |
| `species` | cat |
| `breed` | Siamés |
| `birthDate` | 2020-03-12 |
| `ownerId` | user-demo-001 |

---

## ✅ GET /api/vets

**Comando:**
```powershell
Invoke-RestMethod http://localhost:3001/api/vets
```

**Resultado:** `200 OK`

```
data
----
{@{id=vet-demo-001; name=Dra. Ana Martínez; clinic=Clínica VetSalud;
   type=primary; phone=+34 612 345 678;
   address=Calle Mayor 12, Madrid...}
```

**Datos de seed verificados:**
| Campo | Valor |
|---|---|
| `id` | `vet-demo-001` |
| `name` | Dra. Ana Martínez |
| `clinic` | Clínica VetSalud |
| `type` | primary |
| `phone` | +34 612 345 678 |

---

## ✅ GET /api/pets/:petId/vaccines

**Comando:**
```powershell
Invoke-RestMethod http://localhost:3001/api/pets/pet-demo-001/vaccines
```

**Resultado:** `200 OK`

```
data
----
{@{id=vacc-demo-001; petId=pet-demo-001; name=Triple felina;
   date=2024-06-01; nextDueDate=2025-06-01;
   veterinary=Dra. Martínez; notes=Sin reacciones adversas...}
```

**Datos de seed verificados:**
| Campo | Valor |
|---|---|
| `id` | `vacc-demo-001` |
| `petId` | `pet-demo-001` |
| `name` | Triple felina |
| `date` | 2024-06-01 |
| `nextDueDate` | 2025-06-01 |
| `veterinary` | Dra. Martínez |
| `notes` | Sin reacciones adversas |

---

## Resumen

| Endpoint | Método | Estado | Resultado |
|---|---|---|---|
| `/api/health` | GET | ✅ | 200 OK — servidor activo, CORS habilitado |
| `/api/pets` | GET | ✅ | 200 OK — seed data: Luna y Rocky |
| `/api/vets` | GET | ✅ | 200 OK — seed data: Dra. Ana Martínez |
| `/api/pets/pet-demo-001/vaccines` | GET | ✅ | 200 OK — seed data: Triple felina |

**CORS verificado:** `Access-Control-Allow-Origin: *` presente en todas las respuestas.  
**Tarea 11 completada** ✅
