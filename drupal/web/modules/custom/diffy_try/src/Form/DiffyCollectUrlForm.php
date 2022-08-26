<?php

namespace Drupal\diffy_try\Form;

use Diffy\Diffy;
use Diffy\Screenshot;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\diffy_try\Entity\Project;
use Symfony\Component\DependencyInjection\ContainerInterface;

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
    $form['url'] = [
      '#attributes' => ['placeholder' => t('Enter URL of your site')],
      '#type' => 'url',
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Start'),
    ];

    $form['#theme'] = 'diffy_try_collect_url';

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
    $url = $form_state->getValue('url');

    try {
      Diffy::setApiKey($this->diffyApiKey);
      $project_id = \Diffy\Project::create($url, [$url]);

      $screenshot_id = Screenshot::create($project_id, 'production');

      $project = Project::create([
        'prod_url' => $url,
        'screenshot_id' => $screenshot_id,
      ]);
      $project->save();

      $form_state->setRedirect('diffy_try.project', [
        'uuid' => $project->get('uuid')->value,
      ]);
    }
    catch (\Exception $e) {
      \Drupal::messenger()->addError('Something went wrong. Please reach out to info@diffy.website');
    }


  }

}
