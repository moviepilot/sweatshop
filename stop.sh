#!/bin/bash
cd /home/rails/sweatshop
. ./.rvmrc
thin -C sweatshop.yml stop
