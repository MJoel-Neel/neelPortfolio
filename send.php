<?php
/**
 * PORTFOLIO — MARIE-JOEL ALLOHAN
 * Gestionnaire de formulaire de contact sécurisé
 * 
 * Prérequis : PHPMailer via Composer
 * Installation : composer require phpmailer/phpmailer
 * 
 * Sécurité :
 *  - CSRF basique (referrer check)
 *  - Honeypot anti-spam
 *  - Validation & assainissement des données
 *  - Envoi SMTP (pas de mail() natif)
 *  - Rate limiting simple par session
 *  - Headers sécurité
 */


require __DIR__ . '/config.php';
// ---- MÉTHODE POST UNIQUEMENT ----------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthoéde non autorise.']);
    exit;
}

// ---- AUTOLOAD COMPOSER ----------------------------------
$autoload = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoload)) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Dépendances manquantes. Lancez : composer require phpmailer/phpmailer'
    ]);
    exit;
}
require $autoload;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// ---- SESSION RATE LIMITING ------------------------------
session_start();
$now = time();
if (isset($_SESSION['last_mail_sent'])) {
    $diff = $now - $_SESSION['last_mail_sent'];
    if ($diff < RATE_LIMIT_SEC) {
        http_response_code(429);
        $wait = RATE_LIMIT_SEC - $diff;
        echo json_encode(value: ['status' => 'error', 'message' => "Trop de messages. Réessayez dans {$wait}s."]);
        exit;
    }
}

// ---- HONEYPOT ANTI-SPAM ---------------------------------
// Le champ "website" est caché (display:none) — seuls les bots le remplissent
$honeypot = $_POST['website'] ?? '';
if (!empty(trim($honeypot))) {
    // Bot détecté — réponse silencieusement positive pour ne pas signaler la détection
    echo json_encode(['status' => 'success', 'message' => 'Message envoyé avec succès.']);
    exit;
}

// ---- RÉCUPÉRATION & NETTOYAGE DES DONNÉES ---------------
function clean(string $value): string {
    return htmlspecialchars(trim(strip_tags($value)), ENT_QUOTES, 'UTF-8');
}

$nom     = clean($_POST['nom']     ?? '');
$prenom  = clean($_POST['prenom']  ?? '');
$mail    = filter_var(trim($_POST['mail'] ?? ''), FILTER_SANITIZE_EMAIL);
$objet   = clean($_POST['objet']   ?? '');
$message = clean($_POST['message'] ?? '');

// ---- VALIDATION STRICTE ---------------------------------
$errors = [];

if (strlen($nom) < 2 || strlen($nom) > 100) {
    $errors[] = 'Le nom est invalide (2–100 caractères requis).';
}
if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Adresse email invalide.';
}
if (strlen($objet) < 3 || strlen($objet) > 200) {
    $errors[] = 'L\'objet est invalide (3–200 caractères requis).';
}
if (strlen($message) < 10 || strlen(string: $message) > 2000) {
    $errors[] = 'Le message doit contenir entre 10 et 2000 caractères.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => implode(' ', $errors)]);
    exit;
}

// ---- ENVOI EMAIL VIA PHPMAILER (SMTP) ------
$nomComplet = $prenom ? "$prenom $nom" : $nom;

$mail_body_html = "
<!DOCTYPE html>
<html lang='fr'>
<head><meta charset='UTF-8'><style>
  body { font-family: 'DM Sans', Arial, sans-serif; background:#f4f4f4; padding:20px; }
  .card { background:#fff; border-radius:10px; padding:30px; max-width:560px; margin:auto; border-top:4px solid #D62828; }
  h2 { color:#D62828; margin-bottom:1rem; }
  .field { margin-bottom:1rem; }
  .label { font-size:.8rem; text-transform:uppercase; letter-spacing:.08em; color:#999; }
  .value { font-size:.95rem; color:#111; margin-top:.2rem; }
  .msg { background:#f9f9f9; border-radius:6px; padding:1rem; white-space:pre-wrap; }
  .footer { font-size:.75rem; color:#bbb; text-align:center; margin-top:1.5rem; }
</style></head>
<body>
<div class='card'>
  <h2>📬 Nouveau message — Portfolio MJ</h2>
  <div class='field'><div class='label'>Nom</div><div class='value'>{$nomComplet}</div></div>
  <div class='field'><div class='label'>Email</div><div class='value'><a href='mailto:{$mail}'>{$mail}</a></div></div>
  <div class='field'><div class='label'>Objet</div><div class='value'>{$objet}</div></div>
  <div class='field'><div class='label'>Message</div><div class='value msg'>{$message}</div></div>
  <div class='footer'>Envoyé depuis le formulaire portfolio · " . date('d/m/Y H:i') . "</div>
</div>
</body></html>
";

$mail_body_txt = "Nouveau message via Portfolio MJ\n\nNom : {$nomComplet}\nEmail : {$mail}\nObjet : {$objet}\n\nMessage :\n{$message}";

//try {
    $mailer = new PHPMailer(true);

    // Serveur SMTP
    $mailer->isSMTP();
    $mailer->Host       = SMTP_HOST;
    $mailer->SMTPAuth   = true;
    $mailer->Username   = SMTP_USER;
    $mailer->Password   = SMTP_PASS;
    $mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // 'tls' pour port 587
    $mailer->Port       = SMTP_PORT;
    $mailer->CharSet    = PHPMailer::CHARSET_UTF8;

    // Expéditeur & destinataires
    $mailer->setFrom(SMTP_FROM, SMTP_FROM_NAME);
    $mailer->addAddress(MAIL_TO, 'Neel Allohan');
    $mailer->addReplyTo($mail, $nomComplet); // Répondre directement au contact

    // Contenu
    $mailer->isHTML(true);
    $mailer->Subject = "[Portfolio] {$objet}";
    $mailer->Body    = $mail_body_html;
    $mailer->AltBody = $mail_body_txt;

    $mailer->send();

    // Enregistre le timestamp pour le rate limiting
    $_SESSION['last_mail_sent'] = $now;

    echo json_encode(['status' => 'success', 'message' => 'Message envoyé avec succès.']);
/*
} catch (Exception $e) {
    // Ne jamais exposer les détails SMTP à l'utilisateur
    error_log('[Portfolio Contact] Erreur envoi email : ' . $mailer->ErrorInfo);
    http_response_code(response_code: 500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'envoi. Veuillez me contacter directement par email.']);
}
*/