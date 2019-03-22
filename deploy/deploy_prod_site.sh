#!/usr/bin/env bash

#echo "==================================================="
#echo "============= Dump database ======================="
#echo "==================================================="
#cd /root
#bash deploy_backup.sh

echo "==================================================="
echo "============= Pull code from github ==============="
echo "==================================================="
cd /var/www/diffy-marketing
git pull

echo "==================================================="
echo "============= Update schema and clear cache ======="
echo "==================================================="
cd /var/www/diffy-marketing/drupal
drush cr
drush cim
drush cr