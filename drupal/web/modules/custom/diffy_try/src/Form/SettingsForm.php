<?php

namespace Drupal\diffy_try\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\devel\DevelDumperPluginManagerInterface;
use Drupal\diffy_try\Entity\Project;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Defines a form that configures Diffy settings.
 */
class SettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'diffy_try_admin_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'diffy_try.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, Request $request = NULL) {
    $config = $this->config('diffy_try.settings');
    $form['api_key'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Diffy API Key'),
      '#default_value' => $config->get('api_key'),
    ];

    $query = \Drupal::entityTypeManager()->getStorage('project')->getQuery();
    $query->sort('created', 'DESC');
    $query->range(0, 10);
    $result = $query->execute();

    $formatter =\Drupal::getContainer()->get('date.formatter');

    $header = ['Created', 'URL'];
    $rows = [];
    foreach (Project::loadMultiple($result) as $project) {
      $rows[] = [
        $formatter->format($project->get('created')->value),
        $project->get('prod_url')->value,
      ];
    }

    $form['table'] = [
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $rows,
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();
    $this->config('diffy_try.settings')
      ->set('api_key', $values['api_key'])
      ->save();

    parent::submitForm($form, $form_state);
  }

}
