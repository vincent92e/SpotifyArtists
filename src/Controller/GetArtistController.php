<?php

namespace Drupal\cyber_duck_spotify_artists\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class GetArtistController.
 */
class GetArtistController extends ControllerBase {

  /**
   * Fetch.
   *
   * @return string
   *   Return Hello string.
   */
  public function fetch() {
    return [
      '#type' => 'markup',
      '#markup' => '<div id="spotify-artists"></div>'
    ];
  }

}
