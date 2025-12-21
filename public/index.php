<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__ . '/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__ . '/../vendor/autoload.php';

// Ensure PHP has a writable temp dir for uploads (fixes UPLOAD_ERR_NO_TMP_DIR on Windows)
$projectTmp = __DIR__ . '/../storage/temp';
if (!is_dir($projectTmp)) {
    @mkdir($projectTmp, 0777, true);
}
@ini_set('upload_tmp_dir', $projectTmp);

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__ . '/../bootstrap/app.php';

$app->handleRequest(Request::capture());
