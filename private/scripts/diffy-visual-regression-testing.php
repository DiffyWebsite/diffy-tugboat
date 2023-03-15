<?php

// Get the environment; we will post a new comment to Asana each time
// a commit appears on a new branch on Pantheon.
$env = $_ENV['PANTHEON_ENVIRONMENT'];

// Do not watch test or live, though.
if (($env == 'live') || ($env == 'test')) {
  exit(0);
}

$diffy_token = _get_secrets(array('diffy_token'), '');
$diffy_project_id = _get_secrets(array('diffy_project_id'), '');

if (empty($diffy_token) || empty($diffy_project_id)) {
    die('No Diffy token or project id found in secrets file. Aborting!');
}

// Run actual commands: authenticate and compare.
passthru('./drupal/vendor/bin/diffy auth:login ' . $diffy_token);
passthru('./drupal/vendor/bin/diffy compare ' . $diffy_project_id . ' production staging');

/**
 * Get secrets from secrets file.
 *
 * @param array $requiredKeys  List of keys in secrets file that must exist.
 */
function _get_secrets($requiredKeys, $defaults)
{
    $secretsFile = $_SERVER['HOME'] . '/files/private/secrets.json';
    if (!file_exists($secretsFile)) {
        die('No secrets file ['.$secretsFile.'] found. Aborting!');
    }
    $secretsContents = file_get_contents($secretsFile);
    $secrets = json_decode($secretsContents, 1);
    if ($secrets == false) {
        die('Could not parse json in secrets file. Aborting!');
    }
    $secrets += $defaults;
    $missing = array_diff($requiredKeys, array_keys($secrets));
    if (!empty($missing)) {
        die('Missing required keys in json secrets file: ' . implode(',', $missing) . '. Aborting!');
    }
    return $secrets;
}