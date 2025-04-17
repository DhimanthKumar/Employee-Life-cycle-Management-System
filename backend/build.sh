#!/bin/bash

set -e  # Exit on error

# # Path to the folder with your Pipfile
# ENV_DIR="../env"

# echo "Installing dependencies using Pipenv from $ENV_DIR..."
# pipenv --pipfile "$ENV_DIR/Pipfile" install --dev

# echo "Running Django system checks..."
# pipenv --pipfile "$ENV_DIR/Pipfile" run python manage.py check

# echo "Applying database migrations..."
# pipenv --pipfile "$ENV_DIR/Pipfile" run python manage.py migrate
pip install -r requirements.txt
python manage.py migrate
