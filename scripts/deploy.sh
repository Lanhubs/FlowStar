#!/usr/bin/env bash
set -euo pipefail

NETWORK="testnet"
SOURCE="deployer"
UPDATE_ENV=false
CONTRACT_DIR="contracts/streaming"
WASM_PATH="contracts/target/wasm32v1-none/release/flowstar_streaming.wasm"

usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Deploy the FlowStar streaming contract to Stellar.

Options:
  --network <testnet|mainnet>   Target network (default: testnet)
  --source <identity>           Stellar CLI identity to sign with (default: deployer)
  --update-env                  Write the contract ID to .env.local
  -h, --help                    Show this help message

Examples:
  ./scripts/deploy.sh
  ./scripts/deploy.sh --network mainnet --source prod-deployer --update-env
EOF
  exit 0
}

while [[ $# -gt 0 ]]; do
  case $1 in
    --network)   NETWORK="$2"; shift 2 ;;
    --source)    SOURCE="$2"; shift 2 ;;
    --update-env) UPDATE_ENV=true; shift ;;
    -h|--help)   usage ;;
    *) echo "Unknown option: $1"; usage ;;
  esac
done

if [[ "$NETWORK" != "testnet" && "$NETWORK" != "mainnet" ]]; then
  echo "Error: --network must be 'testnet' or 'mainnet'"
  exit 1
fi

if ! command -v stellar &>/dev/null; then
  echo "Error: stellar-cli not found. Install with: cargo install stellar-cli --locked"
  exit 1
fi

echo "==> Building contract WASM..."
cd "$(git rev-parse --show-toplevel)"
(cd "$CONTRACT_DIR" && stellar contract build)

if [[ ! -f "$WASM_PATH" ]]; then
  echo "Error: WASM not found at $WASM_PATH"
  exit 1
fi

echo "==> Deploying to $NETWORK with source '$SOURCE'..."
CONTRACT_ID=$(stellar contract deploy \
  --wasm "$WASM_PATH" \
  --source "$SOURCE" \
  --network "$NETWORK")

echo ""
echo "==> Contract deployed successfully!"
echo "    Network:     $NETWORK"
echo "    Contract ID: $CONTRACT_ID"

if [[ "$UPDATE_ENV" == true ]]; then
  ENV_FILE=".env.local"
  if [[ -f "$ENV_FILE" ]]; then
    if grep -q "^NEXT_PUBLIC_STREAM_CONTRACT_ID=" "$ENV_FILE"; then
      sed -i "s|^NEXT_PUBLIC_STREAM_CONTRACT_ID=.*|NEXT_PUBLIC_STREAM_CONTRACT_ID=$CONTRACT_ID|" "$ENV_FILE"
    else
      echo "NEXT_PUBLIC_STREAM_CONTRACT_ID=$CONTRACT_ID" >> "$ENV_FILE"
    fi
  else
    echo "NEXT_PUBLIC_STREAM_CONTRACT_ID=$CONTRACT_ID" > "$ENV_FILE"
  fi
  echo "    Updated $ENV_FILE"
fi

echo ""
echo "To use this contract in the app, set:"
echo "  NEXT_PUBLIC_STREAM_CONTRACT_ID=$CONTRACT_ID"
