#!/usr/bin/env bash
set -euo pipefail

IDENTITY="${1:-deployer}"

usage() {
  cat <<EOF
Usage: $(basename "$0") [IDENTITY]

Create and fund a Stellar testnet account using Friendbot.

Arguments:
  IDENTITY   Name for the stellar-cli identity (default: deployer)

Examples:
  ./scripts/fund-testnet.sh
  ./scripts/fund-testnet.sh alice
  ./scripts/fund-testnet.sh recipient-test
EOF
  exit 0
}

[[ "${1:-}" == "-h" || "${1:-}" == "--help" ]] && usage

if ! command -v stellar &>/dev/null; then
  echo "Error: stellar-cli not found. Install with: cargo install stellar-cli --locked"
  exit 1
fi

echo "==> Generating identity '$IDENTITY'..."
if stellar keys address "$IDENTITY" &>/dev/null; then
  echo "    Identity '$IDENTITY' already exists."
  ADDRESS=$(stellar keys address "$IDENTITY")
else
  stellar keys generate "$IDENTITY" --network testnet
  ADDRESS=$(stellar keys address "$IDENTITY")
  echo "    Created identity '$IDENTITY'"
fi

echo "    Address: $ADDRESS"

echo "==> Funding via Friendbot..."
stellar keys fund "$IDENTITY" --network testnet

echo ""
echo "==> Account '$IDENTITY' is funded on testnet!"
echo "    Address: $ADDRESS"
echo ""
echo "To use this identity for deployment:"
echo "  ./scripts/deploy.sh --source $IDENTITY"
