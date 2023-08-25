<?php

declare(strict_types=1);

namespace Drupal\mailchimp_transactional\Plugin\QueueWorker;

use Drupal\Core\Queue\QueueWorkerBase;

/**
 * Sends queued mail messages.
 *
 * @QueueWorker(
 *   id = "mailchimp_transactional_queue",
 *   title = @Translation("Sends queued mail messages"),
 *   cron = {"time" = 60}
 * )
 */
class QueueProcessor extends QueueWorkerBase {

  /**
   * Constructor.
   */
  public function __construct() {
    $config = \Drupal::service('config.factory')->get('mailchimp_transactional.settings');
    $this->cron['time'] = $config->get('mailchimp_transactional_queue_worker_timeout', 60);
  }

  /**
   * {@inheritdoc}
   */
  public function processItem($data) {
    /** @var \Drupal\mailchimp_transactional\Service $mailchimp_transactional */
    $mailchimp_transactional = \Drupal::service('mailchimp_transactional.service');

    $mailchimp_transactional->send($data['message']);
  }

}
