<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

date_default_timezone_set('America/New_York');

const CHANNEL_ID = 'UC7Y4eYyORrCvsqdAdICUGSw';
const FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=' . CHANNEL_ID;

function downloadFeed(string $url): string
{
    if (function_exists('curl_init')) {
        $handle = curl_init($url);
        curl_setopt_array($handle, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_USERAGENT => 'ShalimarRivera.com social feed updater/1.0',
        ]);
        $body = curl_exec($handle);
        $status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
        $error = curl_error($handle);
        curl_close($handle);
        if (is_string($body) && $status >= 200 && $status < 300) {
            return $body;
        }
        throw new RuntimeException('YouTube feed request failed: ' . ($error ?: 'HTTP ' . $status));
    }

    $context = stream_context_create(['http' => [
        'timeout' => 20,
        'user_agent' => 'ShalimarRivera.com social feed updater/1.0',
    ]]);
    $body = @file_get_contents($url, false, $context);
    if (!is_string($body) || $body === '') {
        throw new RuntimeException('YouTube feed request failed.');
    }
    return $body;
}

try {
    libxml_use_internal_errors(true);
    $xml = simplexml_load_string(downloadFeed(FEED_URL));
    if ($xml === false) {
        throw new RuntimeException('YouTube returned an invalid feed.');
    }

    $videos = [];
    foreach ($xml->entry as $entry) {
        $youtube = $entry->children('http://www.youtube.com/xml/schemas/2015');
        $videoId = (string) $youtube->videoId;
        if (!preg_match('/^[A-Za-z0-9_-]{11}$/', $videoId)) {
            continue;
        }
        $videos[] = [
            'id' => $videoId,
            'title' => trim((string) $entry->title),
            'published' => (string) $entry->published,
            'thumbnail' => 'https://i.ytimg.com/vi/' . $videoId . '/hqdefault.jpg',
        ];
        if (count($videos) === 5) {
            break;
        }
    }

    if ($videos === []) {
        throw new RuntimeException('The YouTube feed contained no usable videos.');
    }

    $output = [
        'updatedAt' => gmdate(DATE_ATOM),
        'timeZone' => 'America/New_York',
        'videos' => $videos,
    ];
    $target = dirname(__DIR__) . '/assets/data/social-feed.json';
    $temporary = $target . '.tmp';
    $json = json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false || file_put_contents($temporary, $json . PHP_EOL, LOCK_EX) === false || !rename($temporary, $target)) {
        throw new RuntimeException('Could not write the social feed file.');
    }

    fwrite(STDOUT, sprintf("Updated %d YouTube thumbnails at %s Miami time.\n", count($videos), date(DATE_ATOM)));
} catch (Throwable $error) {
    fwrite(STDERR, $error->getMessage() . PHP_EOL);
    exit(1);
}
