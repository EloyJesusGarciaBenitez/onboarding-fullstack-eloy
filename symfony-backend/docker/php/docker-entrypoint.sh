#!/usr/bin/env bash

# Nos aseguramos de estar en la carpeta correcta desde el inicio
cd /var/www/app

if [[ "$1" == apache2* ]] || [ "$1" = 'php-fpm' ]; then
    if [ ! -e /var/www/app/public/index.php ]; then
        echo "PROYECTO NO DETECTADO: Creando nuevo proyecto..."
        /usr/bin/symfony new /var/www/app ${SYMFONY_PARAMS:-$SYMFONY_PARAMS_STD}
    else
        if [ ! -d /var/www/app/vendor ]; then
            echo "INSTALANDO DEPENDENCIAS con composer install..."
            composer install
        fi    
    fi
fi

echo "STARTING DATABASE SYNC"

# --- BLOQUE DE AUTOMATIZACIÓN ---
# Intentar crear DB y actualizar esquema
php bin/console doctrine:database:create --if-not-exists --no-interaction || true
php bin/console doctrine:schema:update --force --no-interaction
php bin/console app:create-admin --no-interaction || true
# --------------------------------

exec "$@"