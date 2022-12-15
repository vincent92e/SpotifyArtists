<?php

namespace Drupal\cyber_duck_spotify_artists\Controller;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Component\Serialization\Json;

/**
 * This Class is used for reading Artist node entity.
 */
class GetArtistController extends ControllerBase {

  /**
   * Fetch.
   *
   * @return string
   *   Return Hello string.
   */
  public function fetch() {
    // Empty data array.
    $artists = [];
    $counter = 0;
    // Get current user roles.
    $roles = \Drupal::currentUser()->getRoles();

    // Fetch all Artist contents.
    $entities = \Drupal::entityTypeManager()->getStorage('node')->loadByProperties(['type' => 'artist']);

    // Check if $entities variable is empty.
    if (!empty($entities)) {
      // Loop through each entity.
      foreach ($entities as $entity) {
        // Check if $entity variable is an entity.
        if ($entity instanceof EntityInterface) {
          // Check if entity has field_spotify_id & title fields.
          if ($entity->get('field_spotify_id')->value && $entity->get('title')->value) {
            // Populate array with data.
            $artists['artists'][] = [
              'spotify_id' => (string) $entity->get('field_spotify_id')->value,
              'name' => (string) $entity->get('title')->value,
            ];
          }
        }
      }
      $counter = count($artists['artists']);
    }

    return [
      '#type' => 'html_tag',
      '#tag' => 'div',
      '#cache' => [
        'max-age' => 0,
      ],
      '#attributes' => [
        'id' => 'spotify-artists',
        'data-artists' => Json::encode($artists),
        'data-roles' => Json::encode($roles),
        'data-counter' => $counter,
      ],
      '#attached' => [
        'library' => ['cyber_duck_spotify_artists/spotify_artists'],
      ],
    ];
  }

}
