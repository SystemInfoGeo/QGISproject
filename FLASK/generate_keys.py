# generate_keys.py
import secrets

# Générer une clé secrète pour Flask
secret_key = secrets.token_hex(32)  # Clé hexadécimale de 64 caractères
print("SECRET_KEY:", secret_key)

# Générer une clé secrète pour JWT
jwt_secret_key = secrets.token_hex(32)  # Clé hexadécimale de 64 caractères
print("JWT_SECRET_KEY:", jwt_secret_key)
