#!/bin/sh
if [ -z "$1" ]
then
  echo "Which folder do you want to deploy to GitHub Pages?"
  exit 1
fi
git remote set-url origin git@github.com:hsol/hsol.github.io.git
git subtree push --force --prefix $1 origin gh-pages
git reset HEAD~