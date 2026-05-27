<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'telegram' => [
        'bot_token' => env('TELEGRAM_BOT_TOKEN'),
        'bot_username' => env('TELEGRAM_BOT_USERNAME'),
        'default_chat_id' => env('TELEGRAM_DEFAULT_CHAT_ID'),
        'parse_mode' => env('TELEGRAM_PARSE_MODE', 'HTML'),
    ],

    'influxdb' => [
        'url' => env('INFLUXDB_URL'),
        'org' => env('INFLUXDB_ORG'),
        'bucket' => env('INFLUXDB_BUCKET'),
        'token' => env('INFLUXDB_TOKEN'),
        'measurement' => env('INFLUXDB_MEASUREMENT', 'lecturas'),
        'precision' => env('INFLUXDB_PRECISION', 'ms'),
        'timeout' => env('INFLUXDB_TIMEOUT', 10),
    ],

];
