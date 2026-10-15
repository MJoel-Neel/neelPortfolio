# Portfolio — Neel Allohan

Portfolio personnel de **Neel Allohan**, étudiant en BTS SIO option SLAM et développeur web Fullstack & Mobile. Le site présente mon parcours, mes compétences, mes projets, ma veille technologique et propose un formulaire de contact sécurisé.

## Aperçu

Sections du site :

1. **Accueil** : présentation et accès rapide aux projets / contact
2. **À propos** : informations personnelles et CV
3. **Parcours** : formations et expériences (timeline)
4. **Compétences** : stack technique, outils et soft skills
5. **Projets** : galerie de réalisations avec fenêtre modale de détails
6. **Veille** : veille technologique (IA, frameworks, cybersécurité, cloud, mobile...)
7. **Contact** : coordonnées et formulaire d'envoi d'e-mail

Fonctionnalités :

- Thème clair / sombre
- Design responsive avec menu burger mobile
- Animations au scroll
- Formulaire de contact avec envoi SMTP

## Technologies
- **Front-end** : HTML5, CSS3, JavaScript (vanilla)
- **Back-end** : PHP 8+
- **E-mail** : [PHPMailer](https://github.com/PHPMailer/PHPMailer) (SMTP)
- **Configuration** : [vlucas/phpdotenv](https://github.com/vlucas/phpdotenv)
- **Polices** : Syne et DM Sans (Google Fonts)

## Structure du projet

```
├── index.html          # Page principale
├── send.php            # Traitement du formulaire de contact
├── config.php          # Chargement de la configuration (.env) et headers de sécurité
├── .env                # Variables d'environnement (NON versionné)
├── composer.json
├── vendor/             # Dépendances Composer (NON versionné)
└── assets/
    ├── style.css
    ├── script.js
    ├── cv/             # CV au format PDF
    └── image/          # Images et captures des projets
```

## Installation

### Prérequis

- PHP 8.0 ou supérieur
- [Composer](https://getcomposer.org/)
- Un serveur local (WAMP, XAMPP, MAMP) ou le serveur intégré de PHP
- Un compte SMTP (ex. Gmail avec un mot de passe d'application)

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/MJoel-Neel/<nom-du-depot>.git
cd <nom-du-depot>

# 2. Installer les dépendances
composer require phpmailer/phpmailer vlucas/phpdotenv

# 3. Créer le fichier d'environnement
cp .env.example .env

# 4. Lancer le serveur de développement
php -S localhost:8000
```

Le site est ensuite accessible sur `http://localhost:8000`.

## Configuration

Créer un fichier `.env` à la racine du projet :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre.adresse@gmail.com
SMTP_PASS="votre mot de passe d'application"
SMTP_FROM=votre.adresse@gmail.com
SMTP_FROM_NAME="Portfolio"
MAIL_TO=adresse.de.reception@exemple.com
RATE_LIMIT_SEC=60
```

| Variable         | Description                                         |
| ---------------- | --------------------------------------------------- |
| `SMTP_HOST`      | Serveur SMTP                                        |
| `SMTP_PORT`      | Port SMTP (587 pour STARTTLS)                       |
| `SMTP_USER`      | Identifiant SMTP                                    |
| `SMTP_PASS`      | Mot de passe SMTP / mot de passe d'application      |
| `SMTP_FROM`      | Adresse de l'expéditeur technique                   |
| `SMTP_FROM_NAME` | Nom affiché de l'expéditeur                         |
| `MAIL_TO`        | Adresse qui reçoit les messages                     |
| `RATE_LIMIT_SEC` | Délai minimum entre deux messages (en secondes)     |

> ⚠️ Ne jamais versionner le fichier `.env`. Il doit figurer dans le `.gitignore`.

## Sécurité du formulaire de contact

- Méthode POST uniquement
- Honeypot anti-spam (champ caché)
- Limitation de débit par session (rate limiting)
- Nettoyage et validation stricte des données côté serveur
- Envoi via SMTP avec PHPMailer (pas de `mail()` natif)
- Headers de sécurité (`X-Content-Type-Options`, `X-Frame-Options`)
- Variables sensibles externalisées dans `.env`

## Déploiement

Le site nécessite un hébergement avec **PHP** pour le formulaire de contact (OVH, IONOS, etc.). Pensez à :

1. Uploader les fichiers, y compris le dossier `vendor/` (ou lancer `composer install` sur le serveur)
2. Créer le fichier `.env` directement sur le serveur
3. Vérifier que `.env` n'est pas accessible publiquement

## Contact

- **Email** : Allohanjoel1@gmail.com
- **LinkedIn** : [joel-allohan](https://linkedin.com/in/joel-allohan)
- **GitHub** : [MJoel-Neel](https://github.com/MJoel-Neel)

## Licence

© Neel Allohan — Tous droits réservés.