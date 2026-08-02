#!/usr/bin/env bash

set -u

API_BASE_URL="${API_BASE_URL:-}"
ORIGIN="${ORIGIN:-}"

if [ -z "$API_BASE_URL" ]; then
  echo "ERROR: API_BASE_URL が未設定です。"
  echo "例:"
  echo "API_BASE_URL=https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com ORIGIN=https://xxxxxxxxxx.cloudfront.net bash scripts/test-contact-api-abnormal.sh"
  exit 1
fi

CONTACT_URL="${API_BASE_URL%/}/contact"
FAILURES=0

print_header() {
  echo ""
  echo "========================================"
  echo "$1"
  echo "========================================"
}

extract_error_code() {
  BODY="$1" python3 - <<'PY'
import json
import os

body = os.environ.get("BODY", "")

try:
    data = json.loads(body)
except Exception:
    print("")
    raise SystemExit(0)

error = data.get("error")
if isinstance(error, dict):
    print(error.get("code", ""))
else:
    print("")
PY
}

contains_expected_status() {
  actual="$1"
  expected_csv="$2"

  IFS=',' read -r -a expected_list <<< "$expected_csv"

  for expected in "${expected_list[@]}"; do
    if [ "$actual" = "$expected" ]; then
      return 0
    fi
  done

  return 1
}

run_case() {
  case_name="$1"
  method="$2"
  payload="$3"
  expected_status_csv="$4"
  expected_error_code="${5:-}"

  print_header "$case_name"

  curl_args=(
    -sS
    -X "$method"
    "$CONTACT_URL"
    -H "Content-Type: application/json"
    -w $'\n__HTTP_STATUS__:%{http_code}'
  )

  if [ -n "$ORIGIN" ]; then
    curl_args+=(-H "Origin: $ORIGIN")
  fi

  if [ "$payload" != "__NO_BODY__" ]; then
    curl_args+=(-d "$payload")
  fi

  response="$(curl "${curl_args[@]}")"
  http_status="${response##*__HTTP_STATUS__:}"
  body="${response%$'\n'__HTTP_STATUS__:*}"

  echo "HTTP Status: $http_status"
  echo "Response Body:"
  echo "$body"

  if contains_expected_status "$http_status" "$expected_status_csv"; then
    echo "Status Check: OK"
  else
    echo "Status Check: NG expected=$expected_status_csv actual=$http_status"
    FAILURES=$((FAILURES + 1))
  fi

  if [ -n "$expected_error_code" ]; then
    actual_error_code="$(extract_error_code "$body")"

    if [ "$actual_error_code" = "$expected_error_code" ]; then
      echo "Error Code Check: OK"
    else
      echo "Error Code Check: NG expected=$expected_error_code actual=$actual_error_code"
      FAILURES=$((FAILURES + 1))
    fi
  fi
}

long_message_payload="$(python3 - <<'PY'
import json

payload = {
    "name": "テスト太郎",
    "email": "test@example.com",
    "subject": "長文テスト",
    "message": "あ" * 2001,
    "sourcePage": "/contact",
    "honeypot": ""
}

print(json.dumps(payload, ensure_ascii=False))
PY
)"

echo "Target API: $CONTACT_URL"

if [ -n "$ORIGIN" ]; then
  echo "Origin: $ORIGIN"
else
  echo "Origin: 未指定"
fi

run_case \
  "TC-001 bodyなし" \
  "POST" \
  "__NO_BODY__" \
  "400" \
  ""

run_case \
  "TC-002 JSON形式不正" \
  "POST" \
  '{"name":"テスト太郎","email":"test@example.com",' \
  "400" \
  "INVALID_JSON"

run_case \
  "TC-003 name未入力" \
  "POST" \
  '{"name":"","email":"test@example.com","subject":"テスト","message":"本文","sourcePage":"/contact","honeypot":""}' \
  "400" \
  "VALIDATION_ERROR"

run_case \
  "TC-004 email未入力" \
  "POST" \
  '{"name":"テスト太郎","email":"","subject":"テスト","message":"本文","sourcePage":"/contact","honeypot":""}' \
  "400" \
  "VALIDATION_ERROR"

run_case \
  "TC-005 email形式不正" \
  "POST" \
  '{"name":"テスト太郎","email":"invalid-email","subject":"テスト","message":"本文","sourcePage":"/contact","honeypot":""}' \
  "400" \
  "VALIDATION_ERROR"

run_case \
  "TC-006 subject未入力" \
  "POST" \
  '{"name":"テスト太郎","email":"test@example.com","subject":"","message":"本文","sourcePage":"/contact","honeypot":""}' \
  "400" \
  "VALIDATION_ERROR"

run_case \
  "TC-007 message未入力" \
  "POST" \
  '{"name":"テスト太郎","email":"test@example.com","subject":"テスト","message":"","sourcePage":"/contact","honeypot":""}' \
  "400" \
  "VALIDATION_ERROR"

run_case \
  "TC-008 message 2,000文字超過" \
  "POST" \
  "$long_message_payload" \
  "400" \
  "VALIDATION_ERROR"

run_case \
  "TC-009 POST以外 GET /contact" \
  "GET" \
  "__NO_BODY__" \
  "405,404" \
  ""

echo ""
echo "========================================"
echo "Test Summary"
echo "========================================"

if [ "$FAILURES" -eq 0 ]; then
  echo "RESULT: OK"
  echo "P2-026 API異常系テストは成功です。"
  echo ""
  echo "補足:"
  echo "GET /contact が 405 の場合: Lambda側の METHOD_NOT_ALLOWED で拒否されています。"
  echo "GET /contact が 404 の場合: API Gateway側でLambdaに到達する前に拒否されています。"
  exit 0
fi

echo "RESULT: NG"
echo "失敗件数: $FAILURES"
echo "CloudWatch Logs と API Gateway Metrics を確認してください。"
exit 1