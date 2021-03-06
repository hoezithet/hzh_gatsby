#!/bin/sh

srcdir="/tmp/Quicksand"
pkgdir="/usr/share/fonts/truetype/Quicksand"

mkdir $srcdir
cd $srcdir
echo "Cloning Quicksand Git repository..."
git clone https://github.com/andrew-paglinawan/QuicksandFamily

echo "Installing Quicksand..."
sudo mkdir -p $pkgdir
sudo find $srcdir -type f -name "*.ttf" -exec install -Dm644 {} $pkgdir \;

echo "Updating font-cache..."
sudo fc-cache -f > /dev/null

echo "Done!"