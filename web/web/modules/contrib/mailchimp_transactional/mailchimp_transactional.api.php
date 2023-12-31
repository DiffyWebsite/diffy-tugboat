<?php

/**
 * @file
 * This file contains no working PHP code.
 *
 * It exists to provide additional documentation for doxygen as well as to
 * document hooks in the standard Drupal manner.
 */

declare(strict_types=1);

/**
 * Allows other modules to alter the allowed attachment file types.
 *
 * @array $types
 *   An array of file types indexed numerically.
 */
function hook_mailchimp_transactional_valid_attachment_types_alter(&$types) {
  // Example, allow word docs:
  $types[] = 'application/msword';
  // Allow openoffice docs:
  $types[] = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
}

/**
 * Allow other modules to respond to the result of sending an email.
 *
 * @param array $result
 *   Associative array containing the send result, including the status.
 * @param array $message
 *   Associative array containing the message information sent to
 *   Mailchimp Transactional.
 */
function hook_mailchimp_transactional_mailsend_result(array $result, array $message) {
  if ($result['status'] == 'rejected') {
    // Delete user.
    $user = user_load_by_mail($result['email']);
    $user->uid->delete();
  }
}
