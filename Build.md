# Build 

[Source](https://developer.palemoon.org/build/linux/)

## Building Pale Moon: GNU Linux

These instructions are for building Pale Moon 29.4.1 and newer and assumes you want to build the latest release.

### Prerequisites

Basic Dependencies:
    - GNU Compiler Collection (see below)
    - Python 2.7.x
    - Exactly Autoconf 2.13
    - Yasm 1.2.0 or higher
    - XZ
    - Plenty of free disk space
    - At least 6 GB RAM free depending on number of processor cores  (limit using the ```mk_add_options MOZ_MAKE_FLAGS="-jN"``` option)
    - Various distribution specific development packages
    - General system requirements for running the application itself

### Getting the source

These instructions assume you are going to create a directory in your home directory (~) called palemoon-source. You can, of course, put the source code anywhere you want as long as the path does not contain any spaces.

- Using the source archives

This requires downloading source archives from the Pale Moon Archive Server:
    - Navigate to the source directory on the Archive Server and download the desired version of the source tarball.
    - The archive filename is in the following format (where n.n.n is the Pale Moon version): ```palemoon-n.n.n-source.tar.xz```
    - Extract the source code to the desired location.
    - Proceed to the "Build instructions" below.

## Distribution specifics

### CentOS 7

The generic x86_64 GTK2 Linux package that we distribute is built on CentOS 7 with GCC 7.x.
Install the required build dependencies by executing the following commands:

```
yum install epel-release

yum install gtk2-devel dbus-glib-devel GConf2-devel autoconf213 yasm \
mesa-libGL-devel alsa-lib-devel libXt-devel zlib-devel openssl-devel \
sqlite-devel bzip2-devel pulseaudio-libs-devel

yum groupinstall 'Development Tools'

yum install centos-release-scl

yum install devtoolset-7-toolchain
```

Because the system compiler is too old we need to activate the GCC 7 Software Collection environment before we can build. To do so execute the following command:

```
scl enable devtoolset-7 bash
```

If you are building a GTK3 build then you will need the development package for it. To install it execute the following command:

```
yum install gtk3-devel
```

### Debian

Install the required build dependencies by executing the following command:

```
apt-get install build-essential libgtk2.0-dev libdbus-glib-1-dev autoconf2.13 \
yasm libegl1-mesa-dev libasound2-dev libxt-dev zlib1g-dev libssl-dev \
libsqlite3-dev libbz2-dev libpulse-dev libgconf2-dev libx11-xcb-dev \
zip python2.7 python-dbus
```

### Arch

Install the required build dependencies by executing the following command:

```
pacman -Syu gtk2 dbus-glib desktop-file-utils libxt mime-types \
alsa-lib startup-notification python2 autoconf2.13 unzip zip yasm \
libpulse gcc
```

### Gentoo

Install the required build dependencies by executing the following commands:

```
# GCC 7 unmask
(mkdir /etc/portage/package.unmask; \
echo "sys-devel/gcc:7.5.0" >> /etc/portage/package.unmask/gcc) || \
  echo "sys-devel/gcc:7.5.0" >> /etc/portage/package.unmask
# Compile time dependencies
emerge -n1 sys-devel/gcc:7.5.0 ~sys-devel/autoconf-2.13 \
dev-lang/python:2.7 dev-lang/perl dev-lang/yasm

# Runtime time dependencies
emerge -n x11-libs/libXt app-arch/zip media-libs/freetype media-libs/fontconfig \
sys-libs/glibc dev-libs/libffi sys-apps/dbus dev-libs/dbus-glib x11-libs/gtk+:2 \
media-sound/pulseaudio net-wireless/wireless-tools

# Set the "x264" USE flag for media-video/ffmpeg and emerge it
(mkdir /etc/portage/package.use; \
echo "media-video/ffmpeg x264" >> /etc/portage/package.use/ffmpeg) || \
  echo "media-video/ffmpeg x264" >> /etc/portage/package.use
emerge -nN ffmpeg
```

Add the following to the .mozconfig file you will create in Build Instructions:

```
export CC=gcc-7.5.0
export CXX=g++-7.5.0
mk_add_options PYTHON=/usr/bin/python2
mk_add_options AUTOCONF=/usr/bin/autoconf-2.13
```

## Build instructions

Create a file called .mozconfig in the source folder you cloned or unpacked the source to. Make sure it contains at least the following for a close-to-official build:

```.mozconfig file```:

```
# Clear this if not a 64bit build
_BUILD_64=1

# Set GTK Version to 2 or 3
_GTK_VERSION=2

# Standard build options for Pale Moon
ac_add_options --enable-application=palemoon
ac_add_options --enable-optimize="-O2 -w"
ac_add_options --enable-default-toolkit=cairo-gtk$_GTK_VERSION
ac_add_options --enable-jemalloc
ac_add_options --enable-strip
ac_add_options --enable-devtools
ac_add_options --enable-av1
ac_add_options --disable-eme
ac_add_options --disable-webrtc
ac_add_options --disable-gamepad
ac_add_options --disable-tests
ac_add_options --disable-debug
ac_add_options --disable-necko-wifi
ac_add_options --disable-updater
ac_add_options --with-pthreads

# Please see https://www.palemoon.org/redist.shtml for restrictions when using the official branding.
ac_add_options --enable-official-branding
export MOZILLA_OFFICIAL=1

# Processor architecture specific build options
if [ -n "$_BUILD_64" ]; then
  ac_add_options --x-libraries=/usr/lib64
else
  ac_add_options --x-libraries=/usr/lib
fi

export MOZ_PKG_SPECIAL=gtk$_GTK_VERSION
```
Note: LESS IS MORE! There are some pre-made build configs out there that have a lot of options listed, often with insane resulting build configurations. Do not use those and stick to the instructions here.

## Build

Start the build:

```
./mach build
```

Be patient. Building could take a long time. Your PC will be fully occupied compiling and linking the browser (you can expect 100% CPU usage throughout and lots of memory use - provide ample cooling) and you should not be using it for anything else that is resource-intensive at this time. Especially memory-intensive applications should be avoided because it can cause issues with the linker (memory fragmentation) resulting in a very unstable browser.

## Strip/package

After building is completed, you can take the resulting binaries for a test run in the object directory directly (see the on-screen instructions at the end of the build process) but it will not be complete yet. You need to strip and package the browser to integrate additional code, pack up the resource files, and have a ready-to-use browser. You do this by running: 

```
./mach package
```

This will create a properly packaged xz compressed tarball in your object folder under the Pale Moon source folder. e.g. for linux 64bit with GTK 2: 

```
~/palemoon-source/obj-x86_64-pc-linux-gnu/dist/palemoon-{version}.linux-x86_64-gtk2.tar.xz
```
