#!/bin/bash

# Script de teste da integração Frontend-Backend
# Usage: ./test-integration.sh

set -e

echo "🧪 Pituti - Teste de Integração Frontend-Backend"
echo "=================================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuração
API_URL="${API_URL:-http://localhost:3000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:5173}"

# Função de teste
test_endpoint() {
  local name=$1
  local url=$2
  local method=${3:-GET}
  local data=$4
  local token=$5

  echo -n "Testing $name... "
  
  if [ -n "$token" ]; then
    if [ -n "$data" ]; then
      response=$(curl -s -w "\n%{http_code}" -X $method "$url" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "$data")
    else
      response=$(curl -s -w "\n%{http_code}" -X $method "$url" \
        -H "Authorization: Bearer $token")
    fi
  else
    if [ -n "$data" ]; then
      response=$(curl -s -w "\n%{http_code}" -X $method "$url" \
        -H "Content-Type: application/json" \
        -d "$data")
    else
      response=$(curl -s -w "\n%{http_code}" "$url")
    fi
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo -e "${GREEN}✓ OK${NC} (HTTP $http_code)"
    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (HTTP $http_code)"
    echo "Response: $body"
    return 1
  fi
}

# Verificar se backend está rodando
echo "1️⃣  Verificando Backend..."
if ! curl -s "$API_URL/api/health" > /dev/null; then
  echo -e "${RED}✗ Backend não está rodando em $API_URL${NC}"
  echo "Por favor, inicie o backend: cd pituti-api && npm run dev"
  exit 1
fi
echo -e "${GREEN}✓ Backend está rodando${NC}"
echo ""

# Testar health check
echo "2️⃣  Testando Health Check..."
test_endpoint "Health Check" "$API_URL/api/health"
echo ""

# Registar utilizador de teste
echo "3️⃣  Testando Autenticação..."
TEST_EMAIL="test_$(date +%s)@pituti.app"
TEST_PASSWORD="senha123456"
TEST_NAME="Teste User"

register_data="{\"name\":\"$TEST_NAME\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}"
register_response=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "$register_data")

if echo "$register_response" | grep -q "token"; then
  echo -e "${GREEN}✓ Register OK${NC}"
  TOKEN=$(echo "$register_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo "Token: ${TOKEN:0:20}..."
else
  echo -e "${RED}✗ Register FAIL${NC}"
  echo "Response: $register_response"
  exit 1
fi

# Testar login
login_data="{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}"
test_endpoint "Login" "$API_URL/api/auth/login" "POST" "$login_data"
echo ""

# Testar endpoints protegidos
echo "4️⃣  Testando Endpoints Protegidos..."

# Listar pets (vazio)
test_endpoint "GET /pets" "$API_URL/api/pets" "GET" "" "$TOKEN"

# Criar pet
pet_data="{\"name\":\"Luna\",\"species\":\"cat\",\"breed\":\"Siamês\"}"
create_pet_response=$(curl -s -X POST "$API_URL/api/pets" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$pet_data")

if echo "$create_pet_response" | grep -q "Luna"; then
  echo -e "${GREEN}✓ CREATE Pet OK${NC}"
  PET_ID=$(echo "$create_pet_response" | grep -o '"id":"[^"]*' | cut -d'"' -f4 | head -1)
  echo "Pet ID: $PET_ID"
else
  echo -e "${RED}✗ CREATE Pet FAIL${NC}"
  echo "Response: $create_pet_response"
  exit 1
fi

# Listar pets (deve ter 1)
test_endpoint "GET /pets (with data)" "$API_URL/api/pets" "GET" "" "$TOKEN"

# Criar vacina
vaccine_data="{\"name\":\"Antirrábica\",\"vaccine_date\":\"2024-01-15\",\"next_dose_date\":\"2025-01-15\"}"
test_endpoint "CREATE Vaccine" "$API_URL/api/pets/$PET_ID/vaccines" "POST" "$vaccine_data" "$TOKEN"

# Listar vacinas
test_endpoint "GET Vaccines" "$API_URL/api/pets/$PET_ID/vaccines" "GET" "" "$TOKEN"

# Criar medicamento
med_data="{\"name\":\"Antibiótico\",\"dosage\":\"10mg\",\"frequency\":\"2x/dia\",\"start_date\":\"2024-01-01\"}"
test_endpoint "CREATE Medication" "$API_URL/api/pets/$PET_ID/medications" "POST" "$med_data" "$TOKEN"

# Criar sintoma
symptom_data="{\"symptom\":\"Tosse\",\"severity\":\"mild\",\"observed_date\":\"2024-01-10T10:00:00Z\"}"
test_endpoint "CREATE Symptom" "$API_URL/api/pets/$PET_ID/symptoms" "POST" "$symptom_data" "$TOKEN"

# Criar cuidado
care_data="{\"name\":\"Alimentação\",\"type\":\"food\",\"frequency\":\"2\",\"period_type\":\"daily\"}"
test_endpoint "CREATE Care" "$API_URL/api/pets/$PET_ID/cares" "POST" "$care_data" "$TOKEN"

# Criar nota
note_data="{\"title\":\"Consulta\",\"content\":\"Tudo OK na consulta\"}"
test_endpoint "CREATE Note" "$API_URL/api/pets/$PET_ID/notes" "POST" "$note_data" "$TOKEN"

echo ""

# Verificar frontend (opcional)
echo "5️⃣  Verificando Frontend..."
if curl -s "$FRONTEND_URL" > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Frontend está rodando em $FRONTEND_URL${NC}"
else
  echo -e "${YELLOW}⚠ Frontend não está rodando em $FRONTEND_URL${NC}"
  echo "Para iniciar: npm run dev"
fi
echo ""

# Resumo
echo "=================================================="
echo -e "${GREEN}✅ Testes Completados com Sucesso!${NC}"
echo ""
echo "📋 Informações de Teste:"
echo "  Email: $TEST_EMAIL"
echo "  Password: $TEST_PASSWORD"
echo "  Token: ${TOKEN:0:30}..."
echo "  Pet ID: $PET_ID"
echo ""
echo "🎯 Próximos Passos:"
echo "  1. Abrir $FRONTEND_URL no navegador"
echo "  2. Fazer login com as credenciais acima"
echo "  3. Verificar que o pet 'Luna' aparece"
echo "  4. Testar criar/editar/deletar pets"
echo ""
echo "🧹 Para limpar dados de teste:"
echo "  DELETE FROM users WHERE email = '$TEST_EMAIL';"
echo ""
