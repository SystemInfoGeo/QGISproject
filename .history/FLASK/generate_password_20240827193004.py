from werkzeug.security import generate_password_hash

# Générer le hachage du mot de passe
hashed_password = generate_password_hash('sabrina234')

print(hashed_password)
