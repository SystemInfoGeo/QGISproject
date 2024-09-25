import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importez Bootstrap


export default function AdminDashboard() {
    // État pour stocker la liste des utilisateurs et les données du nouvel utilisateur
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        password: '',
    });
      // Fonction pour gérer la soumission du formulaire d'inscription d'un nouvel utilisateur
      const handleSubmit = (e) => {
        e.preventDefault(); // Empêche le rechargement de la page à la soumission du formulaire
        
        // Vérifiez les valeurs des champs
        console.log("Données envoyées :", newUser);
        
        axios.post('http://localhost:5000/admin', newUser, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Authentification avec JWT
            },
        })
        .then(response => {
            console.log(response.data.message); // Affiche un message de succès dans la console
            setUsers([...users, newUser]);
        })
        .catch(error => {
            console.error('Erreur lors de l\'inscription de l\'agent:', error);
        });
    };

    // useEffect pour récupérer la liste des utilisateurs à partir du serveur lors du chargement de la page
    useEffect(() => {
        // Faire une requête GET pour récupérer les données des utilisateurs
        axios.get('http://localhost:5000/admin/data', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Authentification avec JWT
            },
        })
        .then(response => {
            // Mettre à jour l'état avec les données des utilisateurs
            setUsers(response.data.users);
        })
        .catch(error => {
            // Gérer les erreurs de requête
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        });
    }, []); // [] signifie que ce code ne s'exécute qu'une fois après le premier rendu

    // Fonction pour mettre à jour l'état avec les valeurs du formulaire
    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    // Fonction pour gérer la soumission du formulaire d'inscription d'un nouvel utilisateur
    const handleSubmit = (e) => {
        e.preventDefault(); // Empêche le rechargement de la page à la soumission du formulaire
        // Faire une requête POST pour envoyer les données du nouvel utilisateur au serveur
        axios.post('http://localhost:5000/admin', newUser, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Authentification avec JWT
            },
        })
        .then(response => {
            console.log(response.data.message); // Affiche un message de succès dans la console
            // Mettre à jour la liste des utilisateurs avec le nouvel utilisateur ajouté
            setUsers([...users, newUser]);
        })
        .catch(error => {
            // Gérer les erreurs de requête
            console.error('Erreur lors de l\'inscription de l\'agent:', error);
        });
    };

    return (
        <div className="container">
            <h1>Tableau de Bord Administrateur</h1>
            {/* Formulaire pour inscrire un nouvel agent */}
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="text" name="first_name" placeholder="Prénom" onChange={handleChange} />
                <input type="text" name="last_name" placeholder="Nom" onChange={handleChange} />
                <input type="text" name="phone_number" placeholder="Téléphone" onChange={handleChange} />
                <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} />
                <button type="submit">Inscrire l'Agent</button>
            </form>

            {/* Liste des utilisateurs récupérés du serveur */}
            <h2>Liste des Utilisateurs</h2>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user.first_name} {user.last_name} - {user.email}</li>
                ))}
            </ul>
        </div>
    );
}
