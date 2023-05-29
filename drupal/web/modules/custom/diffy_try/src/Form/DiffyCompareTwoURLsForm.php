<?php

namespace Drupal\diffy_try\Form;

use Diffy\Diffy;
use Diffy\Screenshot;
use Drupal\Component\Utility\Html;
use Drupal\Component\Utility\UrlHelper;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element\Email;
use Drupal\diffy_try\Entity\Project;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Defines a Diffy compare two URLs form.
 *
 * @internal
 */
class DiffyCompareTwoURLsForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'diffy_compare_two_urls_form';
  }

  protected $diffyApiKey;

  /**
   * DiffyCollectUrlForm constructor.
   * @param ConfigFactoryInterface $config_factory
   */
  public function __construct(ConfigFactoryInterface $config_factory) {
    $this->diffyApiKey = $config_factory->get('diffy_try.settings')->get('api_key');
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $wrapper_id = Html::getUniqueId('compare-two-urls-wrapper-');

    $form['#prefix'] = '<div id="' . $wrapper_id . '">';
    $form['#suffix'] = '</div>';

    $form['status_messages'] = [
      '#type' => 'status_messages',
      '#weight' => -1000,
    ];

    $step = (int) $form_state->get('step');

    switch ($step) {
      case 0:
        $form['production'] = [
          '#type' => 'url',
          '#required' => TRUE,
          '#size' => 40,
          '#attributes' => ['placeholder' => t('Production URL')],
        ];

        $form['staging'] = [
          '#type' => 'url',
          '#required' => TRUE,
          '#size' => 40,
          '#attributes' => ['placeholder' => t('Staging URL')],
        ];

        $form['submit'] = [
          '#type' => 'submit',
          '#value' => $this->t('Compare'),
          '#ajax' => [
            'callback' => [static::class, 'rebuildForm'],
            'wrapper' => $wrapper_id,
            'effect' => 'fade',
          ]
        ];
        break;

      case 1:
        $form['name'] = [
          '#type' => 'textfield',
          '#required' => TRUE,
          '#size' => 40,
          '#attributes' => ['placeholder' => t('First Name')],
        ];

        $form['email'] = [
          '#type' => 'textfield',
          '#required' => TRUE,
          '#size' => 40,
          '#attributes' => ['placeholder' => t('Email')],
        ];

        $form['submit'] = [
          '#type' => 'submit',
          '#value' => $this->t('Get report'),
          '#ajax' => [
            'callback' => [static::class, 'rebuildForm'],
            'wrapper' => $wrapper_id,
            'effect' => 'fade',
            'disable-refocus' => true,
          ]
        ];
        break;

      case 2:
        $form['thank_you'] = [
          '#markup' => '',
        ];
    }

    $form['#theme'] = 'diffy_compare_two_urls';

    return $form;
  }

  public function rebuildForm($form, FormStateInterface $form_state) {
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    if ($form_state->getValue('email')) {
      Email::validateEmail($form['email'], $form_state, $form);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $mailManager = \Drupal::service('plugin.manager.mail');

    if ($form_state->getValue('production')) {
      $production = $form_state->getValue('production');
      $staging = $form_state->getValue('staging');

      $form_state->set('production', $production);
      $form_state->set('staging', $staging);

      $form_state->set('step', 1);
    }
    elseif ($form_state->getValue('name')) {
      $name = $form_state->getValue('name');
      $email = $form_state->getValue('email');

      $production = $form_state->get('production');
      $staging = $form_state->get('staging');

      $form_state->set('step', 2);

      // Email.
      $message = sprintf('%s %s %s %s', $name, $email, $production, $staging);
      $mailManager->mail('diffy_try', 'compare_sites', 'info@diffy.website', 'en', ['email' => $email, 'message' => $message], NULL, TRUE);
    }

    $form_state->setRebuild();
  }

}
