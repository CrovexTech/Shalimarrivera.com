#!/usr/bin/env python3
"""Refresh the public YouTube thumbnail feed without third-party packages."""

from __future__ import annotations

import json
import os
import re
import sys
import tempfile
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo


CHANNEL_ID = "UC7Y4eYyORrCvsqdAdICUGSw"
FEED_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
VIDEO_ID = re.compile(r"^[A-Za-z0-9_-]{11}$")
NAMESPACES = {
    "atom": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
}


def download_feed() -> bytes:
    request = urllib.request.Request(
        FEED_URL,
        headers={"User-Agent": "ShalimarRivera.com social feed updater/1.0"},
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return response.read()


def parse_videos(feed: bytes) -> list[dict[str, str]]:
    root = ET.fromstring(feed)
    videos: list[dict[str, str]] = []

    for entry in root.findall("atom:entry", NAMESPACES):
        video_id = (entry.findtext("yt:videoId", default="", namespaces=NAMESPACES)).strip()
        if not VIDEO_ID.fullmatch(video_id):
            continue

        videos.append(
            {
                "id": video_id,
                "title": (entry.findtext("atom:title", default="", namespaces=NAMESPACES)).strip(),
                "published": (entry.findtext("atom:published", default="", namespaces=NAMESPACES)).strip(),
                "thumbnail": f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
            }
        )
        if len(videos) == 5:
            break

    if not videos:
        raise RuntimeError("The YouTube feed contained no usable videos.")
    return videos


def publish(videos: list[dict[str, str]]) -> None:
    target = Path(__file__).resolve().parent.parent / "assets" / "data" / "social-feed.json"
    output = {
        "updatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
        "timeZone": "America/New_York",
        "videos": videos,
    }

    temporary_name = ""
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            dir=target.parent,
            prefix="social-feed-",
            suffix=".tmp",
            delete=False,
        ) as temporary:
            temporary_name = temporary.name
            json.dump(output, temporary, ensure_ascii=False, indent=2)
            temporary.write("\n")
            temporary.flush()
            os.fsync(temporary.fileno())
        os.chmod(temporary_name, 0o644)
        os.replace(temporary_name, target)
    finally:
        if temporary_name and os.path.exists(temporary_name):
            os.unlink(temporary_name)


def main() -> int:
    try:
        videos = parse_videos(download_feed())
        publish(videos)
        miami_now = datetime.now(ZoneInfo("America/New_York")).isoformat(timespec="seconds")
        print(f"Updated {len(videos)} YouTube thumbnails at {miami_now} Miami time.")
        return 0
    except Exception as error:
        print(str(error), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
