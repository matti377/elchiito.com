<?php
require '/phpmailer/src/PHPMailer.php';
require '/phpmailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve the form inputs
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    $mail = new PHPMailer(true);

try {
    // Configure SMTP settings
    $mail->isSMTP();
    $mail->Host = 'mail.elchiito.com'; // Replace with your SMTP server address
    $mail->SMTPAuth = true;
    $mail->Username = 'info@elchiito.com'; // Replace with your SMTP username or email address
    $mail->Password = $password; // Replace with your SMTP password
    $mail->SMTPSecure = false; // Disable SSL/TLS
    $mail->SMTPAutoTLS = false; // Disable TLS encryption
    $mail->Port = 25; // Replace with the appropriate SMTP port

    // Set sender and recipient
    $mail->setFrom('info@elchiito.com'); // Replace with your email address and name
    $mail->addAddress('matti@elchiito.com'); // Replace with recipient email address and name

    // Set email subject and body

    $mail->Subject = $subject;
    $mail->Body = $message . "\n\nEmail sent from " . $email;

    // Send the email
    $mail->send();

    echo 'Email sent successfully!';
} catch (Exception $e) {
    echo 'Email could not be sent. Error: ', $mail->ErrorInfo;
}
?>
