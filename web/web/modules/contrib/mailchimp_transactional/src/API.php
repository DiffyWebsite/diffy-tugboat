<?php

declare(strict_types=1);
namespace Drupal\mailchimp_transactional;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Client;

/**
 * Service class to integrate with Mailchimp Transactional.
 */
class API implements APIInterface {
  use StringTranslationTrait;

  /**
   * The Config Factory service.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $config;

  /**
   * The Logger Factory service.
   *
   * @var \Drupal\Core\Logger\LoggerChannelFactoryInterface
   */
  protected $log;

  /**
   * The http client.
   *
   * @var \GuzzleHttp\ClientInterface
   */
  protected $httpClient;

  /**
   * The messenger.
   *
   * @var \Drupal\Core\Messenger\MessengerInterface
   */
  protected $messenger;

  /**
   * Constructs the service.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The configuration factory service.
   * @param \Drupal\Core\Logger\LoggerChannelFactoryInterface $logger_factory
   *   The logger channel factory service.
   * @param \GuzzleHttp\Client $http_client
   *   The http client.
   * @param \Drupal\Core\Messenger\MessengerInterface $messenger
   *   The messenger.
   */
  public function __construct(ConfigFactoryInterface $config_factory, LoggerChannelFactoryInterface $logger_factory, Client $http_client, MessengerInterface $messenger) {
    $this->config = $config_factory->get('mailchimp_transactional.settings');
    $this->log = $logger_factory->get('mailchimp_transactional');
    $this->httpClient = $http_client;
    $this->messenger = $messenger;
  }

  /**
   * {@inheritdoc}
   */
  public function isLibraryInstalled(): bool {
    return class_exists('\MailchimpTransactional\ApiClient');
  }

  /**
   * {@inheritdoc}
   */
  public function getMessages($email): array {
    $messages = [];
    try {
      if ($mailchimp_transactional = $this->getApiObject()) {
        $messages = $mailchimp_transactional->messages->search(['query' => 'email:' . $email]);
      }
    }
    catch (RequestException $e) {
      $this->messenger->addError(
        $this->t('Mailchimp Transactional: %message', ['%message' => $e->getMessage()])
      );
      $this->log->error($e->getMessage());
    }
    return $messages;
  }

  /**
   * {@inheritdoc}
   */
  public function getTemplates(): array {
    $templates = NULL;
    try {
      if ($mailchimp_transactional = $this->getApiObject()) {
        $templates = $mailchimp_transactional->templates->list();
      }
    }
    catch (RequestException $e) {
      $this->messenger->addError($this->t('Mailchimp Transactional: %message', ['%message' => $e->getMessage()]));
      $this->log->error($e->getMessage());
    }
    return $templates;
  }

  /**
   * {@inheritdoc}
   */
  public function getSubAccounts(): array {
    $accounts = [];
    try {
      if ($mailchimp_transactional = $this->getApiObject()) {
        $accounts = $mailchimp_transactional->subaccounts->list();
      }
    }
    catch (\Exception $e) {
      $this->messenger->addError($this->t('Mailchimp Transactional: %message', ['%message' => $e->getMessage()]));
      $this->log->error($e->getMessage());
    }
    return $accounts;
  }

  /**
   * {@inheritdoc}
   */
  public function getUser(): object {
    $user = NULL;
    try {
      if ($mailchimp_transactional = $this->getApiObject()) {
        $user = $mailchimp_transactional->users->info();
      }
    }
    catch (RequestException $e) {
      $this->messenger->addError($this->t('Mailchimp Transactional: %message', ['%message' => $e->getMessage()]));
      $this->log->error($e->getMessage());
    }
    return $user;
  }

  /**
   * {@inheritdoc}
   */
  public function getTagsAllTimeSeries(): array {
    $data = [];
    try {
      if ($mailchimp_transactional = $this->getApiObject()) {
        $data = $mailchimp_transactional->tags->allTimeSeries();
      }
    }
    catch (RequestException $e) {
      $this->messenger->addError($this->t('Mailchimp Transactional: %message', ['%message' => $e->getMessage()]));
      $this->log->error($e->getMessage());
    }
    return $data;
  }

  /**
   * Ping the API to validate an API key.
   *
   * @return bool
   *   True if API returns expected "PONG!" otherwise false
   */
  public function isApiKeyValid($api_key = NULL): bool {
    $response = FALSE;
    try {
      if ($mailchimp_transactional = $this->getNewApiObject($api_key)) {
        $response = ($mailchimp_transactional->users->ping() === 'PONG!');
      }
    }
    catch (\Exception $e) {
      $this->messenger->addError($this->t('Mailchimp Transactional: %message', ['%message' => $e->getMessage()]));
      $this->log->error($e->getMessage());
    }
    return $response;
  }

  /**
   * {@inheritdoc}
   */
  public function sendTemplate(array $message, $template_id, array $template_content): array {
    $result = NULL;
    try {
      if ($mailchimp_transactional = $this->getApiObject()) {
        $result = $mailchimp_transactional->messages->sendTemplate([
          'message' => $message,
          'template_name' => $template_id,
          'template_content' => $template_content,
        ]);
      }
    }
    catch (RequestException $e) {
      $this->messenger->addError($this->t('Mailchimp Transactional: %message', ['%message' => $e->getMessage()]));
      $this->log->error($e->getMessage());
    }
    return $result;
  }

  /**
   * {@inheritdoc}
   */
  public function send(array $message): array {
    $result = NULL;
    try {
      if ($mailer = $this->getApiObject()) {
        $result = $mailer->messages->send($message);
      }
    }
    catch (RequestException $e) {
      $this->messenger->addError($this->t('Could not load Mailchimp Transactional API: %message', ['%message' => $e->getMessage()]));
      $this->log->error($e->getMessage());
    }
    return $result;
  }

  /**
   * Return Mailchimp Transactional API object.
   *
   * Allows communication with the mailchimp_transactional server.
   *
   * @param bool $reset
   *   Pass in TRUE to reset the statically cached object.
   * @param string $api_key
   *   API key to authorize Mailchimp Transactional API.
   *
   * @return \MailchimpTransactional\ApiClient|bool
   *   Mailchimp Transactional Object upon success
   *   FALSE if 'mailchimp_transactional_api_key' is unset
   */
  private function getApiObject($reset = FALSE, $api_key = NULL) {
    $api =& drupal_static(__FUNCTION__, NULL);
    if ($api === NULL || $reset || $api_key) {
      $api = $this->getNewApiObject($api_key);
    }
    return $api;
  }

  /**
   * Return a new Mailchimp Transactional API object without looking in cache.
   *
   * @param string $api_key
   *   API key to authorize Mailchimp Transactional API.
   */
  private function getNewApiObject($api_key) {
    if (!$this->isLibraryInstalled()) {
      $msg = $this->t('Failed to load Mailchimp Transactional PHP library. Please refer to the installation requirements.');
      $this->log->error($msg);
      $this->messenger->addError($msg);
      return NULL;
    }

    $api_key ?? $api_key = $this->config->get('mailchimp_transactional_api_key');
    $api_timeout = $this->config->get('mailchimp_transactional_api_timeout');
    if (empty($api_key)) {
      $msg = $this->t('Failed to load Mailchimp Transactional API Key. Please check your Mailchimp Transactional settings.');
      $this->log->error($msg);
      $this->messenger->addError($msg);
      return FALSE;
    }
    // We allow the class name to be overridden, following the example of core's
    // mailsystem, in order to use alternate Mailchimp Transactional classes.
    $class_name = $this->config->get('mailchimp_transactional_api_classname');
    return new $class_name($this->httpClient, $api_key, $api_timeout);
  }

}
