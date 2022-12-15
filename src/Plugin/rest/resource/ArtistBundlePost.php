<?php

namespace Drupal\cyber_duck_spotify_artists\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Drupal\media\Entity\Media;
use Drupal\Core\File\FileSystemInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "artist_bundle_post",
 *   label = @Translation("Artist bundle post"),
 *   uri_paths = {
 *     "create" = "/api/post/node/{user_role}/create_artist"
 *   }
 * )
 */
class ArtistBundlePost extends ResourceBase {

  /**
   * A current user instance.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $currentUser;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    $instance = parent::create($container, $configuration, $plugin_id, $plugin_definition);
    $instance->logger = $container->get('logger.factory')->get('cyber_duck_spotify_artists');
    $instance->currentUser = $container->get('current_user');
    return $instance;
  }

  /**
   * Responds to POST requests.
   *
   * @param array $data
   *   The data array received after the api call from Javascript.
   * @param string $user_role
   *   Current user role.
   *
   * @return \Drupal\rest\ResourceResponse
   *   The HTTP response object.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post(array $data, string $user_role) {

    // You must to implement the logic of your REST Resource here.
    // Use current user after pass authentication to validate access.
    if (!$this->currentUser->hasPermission('access administration pages')) {
      throw new AccessDeniedHttpException();
    }

    // If data is empty throw an error.
    if (empty($data)) {
      return new ResourceResponse('Error! No data was provided.', 400);
    }

    $artist_name = (string) $data[0]['name'];
    $image_url = (string) $data[0]['image_url'][0]['url'];
    $genres = (string) implode(', ', $data[0]['genres']);
    $followers = (int) $data[0]['followers'];
    $spotify_id = (string) $data[0]['spotify_id'];

    $file_name = (string) strtolower($artist_name);
    $created_date = date('Y-m-dTH:i:s');

    $image_data = file_get_contents($image_url);
    $file_repository = \Drupal::service('file.repository');
    $image = $file_repository->writeData($image_data, "public://{$file_name}.png", FileSystemInterface::EXISTS_REPLACE);

    $image_media = Media::create([
      'name' => $file_name,
      'bundle' => 'image',
      'uid' => \Drupal::currentUser()->id(),
      'langcode' => \Drupal::languageManager()->getCurrentLanguage()->getId(),
    // 0 = unpublished, 1 = published
      'status' => 1,
      'field_media_image' => [
        'target_id' => $image->id(),
        'alt' => $artist_name,
        'title' => $artist_name,
      ],
      'field_author' => \Drupal::currentUser()->getAccountName(),
      'field_date' => $created_date,
      'field_location' => 'London',
    ]);
    $image_media->save();

    $node = \Drupal::entityTypeManager()->getStorage('node')->create([
      'type' => 'artist',
      'title' => $artist_name,
      'field_spotify_id' => $spotify_id,
      'field_artist_image' => [
        'target_id' => $image_media->id(),
      ],
      'field_followers' => $followers,
      'field_genres' => $genres,
    ]);
    $node->save();

    return new ResourceResponse($data, 200);
  }

}
