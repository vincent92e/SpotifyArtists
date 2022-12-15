Requirements
- latest version of node
- spotify developer account with client_id & secret_key


Installation steps


1. Download & enable module dependencies using composer & drush

2. Run "npm install" command to download node packages

3. Run "composer install" if the configs or the artist content type is not showing or available

3. Go to /js/components/Artists.jsx and update the values for the client_id & client_secret
    Note: This is not the right way to add these keys. Best way would be to create an admin from
    to store keys & id but because of not having enough time I decided to leave it this way.

4. Make sure the 'Artist View Display' block is enabled.

5. Clear your drupal cache.

6. Go to /admin/config/spotify/artists to fetch data from spotify.