MEDIA FOLDERS
=============
Folders are organised the same way as the mind-map:

    <Node> / <Category> / <Project> / <MediaType>

e.g.  Videography/Brands/Fabia/Videos
      Photography/Concerts/RevengeOnTheWorld Tour/Photos
      VFX/Music/2 Nights Music Video/Gifs

MEDIA TYPE SUBFOLDERS
  Videos   -> .mp4   (final delivered videos; an audio toggle appears beside them)
  Photos   -> .jpg / .jpeg / .png   (shown as a carousel with a random hero first)
  Gifs     -> .gif   (process steps; shown as a carousel with a description each)
  Models   -> .glb / .gltf   (3D — wired up in a later stage)

NAMING  (important)
  Name files in order, two digits:  01, 02, 03 ...
    01.mp4, 02.mp4
    01.jpg, 02.jpg, 03.jpg ...
    01.gif, 02.gif ...
  The app shows as many as exist (it counts up until a file is missing),
  so you don't need to touch any code — just drop the files in.

TIP: keep videos compressed (1080p H.264, a few MB each) so the repo stays light.

To (re)generate empty folders after editing the project list:
  node scripts/make-media-folders.mjs
