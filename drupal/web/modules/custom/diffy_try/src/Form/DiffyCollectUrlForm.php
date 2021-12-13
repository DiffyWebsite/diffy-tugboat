<?php

namespace Drupal\diffy_try\Form;

use Drupal\Component\Gettext\PoItem;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element;
use Drupal\locale\SourceString;

/**
 * Defines a Diffy try form.
 *
 * @internal
 */
class DiffyCollectUrlForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'diffy_collect_url_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['url'] = [
      '#type' => 'url',
    ];

    $form['actions'] = ['#type' => 'actions'];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Take Screenshot'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    // Run curl request to see if URL is reachable.
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Create project and start the job.
    $form_state->setRedirect('diffy_try.project', [
      'uuid' => '123',
    ]);
  }

}
