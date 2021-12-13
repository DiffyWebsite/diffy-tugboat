<?php

namespace Drupal\diffy_try\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Defines a controller for the Diffy Try module.
 */
class DiffyTryController extends ControllerBase {

  public function page() {
    $build['text'] = [
      '#markup' => 'hello',
    ];
    return $build;
  }

}
