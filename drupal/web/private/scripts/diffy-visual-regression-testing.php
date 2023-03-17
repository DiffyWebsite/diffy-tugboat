<?php

// Get the environment; we will trigger visual testing
// for test environment comparing it with production
$env = $_ENV['PANTHEON_ENVIRONMENT'];
print_r('Starting Diffy job ' . $env);
// Run testing on test environment only.
if ($env != 'test') {
  exit(0);
}

$secrets = _get_secrets(array('diffy_token', 'diffy_project_id'), []);
$diffy_token = $secrets['diffy_token'];
$diffy_project_id = $secrets['diffy_project_id'];

if (empty($diffy_token) || empty($diffy_project_id)) {
    die('No Diffy token or project id found in secrets file. Aborting!');
}

print_r('All secrets in place. Running the job.');

// Run actual commands: authenticate and compare.
$output = null;
exec('ls /code/drupal/vendor/bin', $output);
print_r($output);

$output = null;
exec('php /code/drupal/vendor/bin/diffy auth:login ' . $diffy_token, $output);
print_r($output);

$output = null;
exec('php /code/drupal/vendor/bin/diffy compare ' . $diffy_project_id . ' production staging', $output);
print_r($output);

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
