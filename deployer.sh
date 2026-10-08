#!/bin/zsh
# Met le site en ligne (page + agent IA) sur https://simondepussay.com
# À lancer dans le terminal : ~/Desktop/developpement/kadai06/deployer.sh
cd "$(dirname "$0")"
rm -f /tmp/kadai06.zip
zip -rq /tmp/kadai06.zip server.js package.json public agent -x "*.DS_Store"
az webapp deploy -g SITEwf -n Depussay22 --src-path /tmp/kadai06.zip --type zip --clean true
