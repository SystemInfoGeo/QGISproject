from waitress import serve
from app import app  # Assurez-vous que 'app' est le nom correct de votre instance Flask

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=8000)
