GIT v1.5.3.5 Release Notes
==========================

Fixes since v1.5.3.4
--------------------

 * Comes with git-gui 0.8.4.

 * "git-config" silently ignored options after --list; now it will
   error out with a usage message.

 * "git-config --file" failed if the argument used a relative path
   as it changed directories before opening the file.

 * "git-config --file" now displays a proper error message if it
   cannot read the file specified on the command line.

 * "git-config", "git-diff", "git-apply" failed if run from a
   subdirectory with relative GIT_DIR and GIT_WORK_TREE set.

 * "git-blame" crashed if run during a merge conflict.

 * "git-add -i" did not handle single line hunks correctly.

 * "git-rebase -i" and "git-stash apply" failed if external diff
   drivers were used for one or more files in a commit.  They now
   avoid calling the external diff drivers.

 * "git-log --follow" did not work unless diff generation (e.g. -p)
   was also requested.

 * "git-log --follow -B" did not w