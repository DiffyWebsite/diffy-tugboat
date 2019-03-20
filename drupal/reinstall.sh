#!/usr/bin/env bash

drush cr
drush sql-drop
drush sql-cli < ../db/diffy.sql