<?php

namespace Drupal\diffy_try\Controller;

use Diffy\Diffy;
use Diffy\Screenshot;
use Drupal\Core\Controller\ControllerBase;
use Drupal\diffy_try\Entity\Project;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Defines a controller for the Diffy Try module.
 */
class DiffyTryController extends ControllerBase {

  /**
   * Render the page.
   */
  public function page($uuid) {
    $result = $this->entityTypeManager()->getStorage('project')->loadByProperties(['uuid' => $uuid]);
    if (empty($result)) {
      $build['text'] = [
        '#markup' => t('Something went wrong. We can not find a job you are requesting.'),
        '#cache' => ['max-age' => 0],
      ];
      return $build;
    }

    $project = reset($result);

    $results = $this->loadResultsRaw($uuid);

    $completed_text = t('Screenshots of the page <a href="@page" target="_blank">@page</a> completed.', ['@page' => $project->get('prod_url')->value]);

    if (count($results) != 3) {
      $build['text'] = [
        '#markup' => '<div id="diffy-try-text" class="mt-5"><p class="progress-text">' . t('Our workers are taking screenshots from your page <a href="@page" target="_blank">@page</a>. We are checking status every 5 seconds and display results below.', ['@page' => $project->get('prod_url')->value])
          . '</p><p class="completed-text hidden">' . $completed_text . '</p></div><div class="container"><div id="diffy-try-results" class="row">' . implode('', $results) . '</div></div>',
        '#cache' => ['max-age' => 0],
      ];
      $build['#attached']['library'][] = 'diffy_try/load_wait';
    }
    else {
      $build['text'] = [
        '#markup' => '<div id="diffy-try-text" class="mt-5 pt-5"><p>' . $completed_text . '</p></div><div class="container"><div id="diffy-try-results" class="row">' . implode('', $results) . '</div></div>',
        '#cache' => ['max-age' => 0],
      ];
    }

    return $build;
  }

  /**
   * Retrieve screenshot results and pass them back to javascript.
   */
  public function loadResults($uuid) {
    $data = $this->loadResultsRaw($uuid);
    return new JsonResponse($data);
  }

  protected function loadResultsRaw($uuid) {
    $result = $this->entityTypeManager()->getStorage('project')->loadByProperties(['uuid' => $uuid]);
    if (empty($result)) {
      return [];
    }

    $project = reset($result);

    $diffyApiKey = $this->config('diffy_try.settings')->get('api_key');
    Diffy::setApiKey($diffyApiKey);

    $screenshot = Screenshot::retrieve($project->get('screenshot_id')->value);
    if (isset($screenshot->data['screenshots']) && is_array($screenshot->data['screenshots'])) {
      $rendered = [];
      $screenshots = reset($screenshot->data['screenshots']);
      if (is_array($screenshots)) {
        foreach ($screenshots as $breakpoint => $screenshot_image) {
          $rendered[] = '<div class="col-4 mb-4 screenshot-preview">' . $breakpoint . 'px<br/><a href="' . $screenshot_image['full'] . '" target="_blank"><img src="' . $screenshot_image['thumbnail'] . '"/></a></div>';
        }
      }

      return $rendered;
    }

    return [];
  }

}
