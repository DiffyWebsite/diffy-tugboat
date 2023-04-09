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
      return [
        '#markup' => $this->t('Something went wrong. We can not find a job you are requesting.'),
        '#cache' => ['max-age' => 0],
      ];
    }

    $project = reset($result);
    $results = $this->loadResultsRaw($uuid);
    $prod_url = $project->get('prod_url')->value;

    $carousel_items =
      '<div class="carousel-item tab-pane active" id="carousel-item-640">' . $results[640] . '</div>'
      . '<div class="carousel-item tab-pane" id="carousel-item-1024">' . $results[1024] . '</div>'
      . '<div class="carousel-item tab-pane" id="carousel-item-1200">' . $results[1200] . '</div>';

    $header_text = "
      <header class='try-page--title'>
        <h1 class='page--tilte'>" . $this->t('How we take screenshots') . "</h1>
        <p class='page--subtitle'>" . $this->t('Your page <a href="@page" target="_blank">@page</a></p>', ['@page' => $prod_url])
      . "</header>";

    $build['text'] = [
      '#markup' => $header_text .
        "<div class='container'>
           <div id='diffy-try-results' class='results--wrap'>
             <div id='diffy-try--carousel' class='carousel slide'>
               <ol class='carousel-indicators'>
                 <li data-target='#diffy-try--carousel' data-slide-to='0' class='active'>
                   <a href='carousel-item-640' class='carousel-item-640' data-toggle='tab'>640px</a>
                 </li>
                 <li data-target='#diffy-try--carousel' data-slide-to='1'>
                   <a href='carousel-item-1024' class='carousel-item-1024' data-toggle='tab'>1024px</a>
                 </li>
                 <li data-target='#diffy-try--carousel' data-slide-to='2'>
                   <a href='carousel-item-1200' class='carousel-item-1200' data-toggle='tab'>1200px</a>
                 </li>
               </ol>
               <div class='carousel-inner'>"
                  . $carousel_items .
               "</div>
               <a class='carousel-control-prev' href='#diffy-try--carousel' role='button' data-slide='prev'>
                 <span class='carousel-control-prev-icon' aria-hidden='true'></span>
                 <span class='sr-only'>Previous</span>
               </a>
               <a class='carousel-control-next' href='#diffy-try--carousel' role='button' data-slide='next'>
                 <span class='carousel-control-next-icon' aria-hidden='true'></span>
                 <span class='sr-only'>Next</span>
               </a>
             </div>
           </div>
         </div>"
      ,
      '#cache' => ['max-age' => 0],
    ];

    $build['#attached']['library'][] = 'diffy_try/load_wait';

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

//      unset($screenshots[1024]);

      foreach ([640, 1024, 1200] as $breakpoint) {
        if (is_array($screenshots) && isset($screenshots[$breakpoint])) {
          $screenshot_image = $screenshots[$breakpoint];

          $rendered[$breakpoint] = '
            <a href="'
              . $screenshot_image['full']
              . '" target="_blank"><img src="'
              . $screenshot_image['thumbnail']
              . '"/>
            </a>';
        }
        else {
          $breakpoint_name = 'mobile';
          if ($breakpoint > 1000) {
            $breakpoint_name = 'tablet';
          }
          if ($breakpoint > 1100) {
            $breakpoint_name = 'desktop';
          }
          $rendered[$breakpoint] = '
            <div class="progress-text">
              <div class="top-progress-text">
                <p class="top--text">' . $this->t('Screenshot for @breakpoint_name is preparing.', [
                  '@breakpoint_name' => $breakpoint_name
                ]) . '</p>
              </div>
              <p class="subtitle">' . $this->t('It takes under a minute...') . '</p>
           </div>';
        }
      }


      return $rendered;
    }

    return [];
  }

}
