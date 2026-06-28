This folder is no longer used to host the installer files.

GitHub blocks files over 100MB in regular commits, so the .dmg and .exe
are hosted on GitHub Releases instead, and the site links directly to
those release URLs.

To publish a new version:
1. Go to your repo on github.com -> Releases -> Create a new release
2. Tag it (e.g. v1.1.0) and attach your .dmg and .exe files
3. Publish the release
4. Copy the download URL for each file (right-click -> Copy Link on
   GitHub, or use the URL pattern:
   https://github.com/<user>/<repo>/releases/download/<tag>/<filename>)
5. Paste those two URLs into:
   - script.js   (MAC_DMG and WIN_EXE constants near the top)
   - index.html  (the two <a href="..."> links in the Download section)

You can leave this folder in the repo (it's tiny and harmless) or delete
it entirely - the site no longer references files inside it.
