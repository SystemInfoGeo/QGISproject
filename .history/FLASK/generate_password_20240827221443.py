from werkzeug.security import generate_password_hash

# Générer le hachage du mot de passe
hashed_password = generate_password_hash('sabrina2345')

print(hashed_password)
