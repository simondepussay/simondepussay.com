#!/bin/zsh
# Met le site en ligne (pages + agent IA) sur https://simondepussay.com (Azure Static Web Apps)
# À lancer dans le terminal : ~/Desktop/developpement/kadai06/deployer.sh
set -e
cd "$(dirname "$0")"
# La prise de notes de l'agent reste hors du dépôt : on la copie dans l'API juste pour l'envoi
cp agent/profil.md api/profil.md
(cd api && npm install --omit=dev --silent)
TOKEN=$(az staticwebapp secrets list -n simondepussay -g SITEwf --query properties.apiKey -o tsv)
npx --yes @azure/static-web-apps-cli@2.0.2 deploy ./public --api-location ./api --api-language node --api-version 20 \
  --deployment-token "$TOKEN" --env production
