# Compiling VLC from source for Windows and Linux

## Prerequisites
By far the easiest way of compiling VLC is using the provided Docker containers, so install docker on your platform [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

## For Windows:

Clone VLC:
```bash
git clone -b 3.0.x https://code.videolan.org/videolan/vlc.git
```

Startup the container (this assumes you have cloned VLC to `~/vlc`):
```bash
docker run --user root --rm --volume ~/vlc:/vlc -it registry.videolan.org/vlc-debian-win64-3.0:20211008140026 bash
```

Once that's done you'll be in a bash terminal. At the moment .msi builds are very complicated to get working, so for simplicity we just do a git revert on the commit that added the .msi build, within docker:
```bash
cd /vlc
git revert --no-edit d723904cbd12600efbd3718db0896cabd4823db1
```

Compile VLC:
```bash
./extras/package/win32/build.sh -i n
```

---

## For Linux (Snap):

Clone VLC:
```bash
git clone -b 3.0.x https://code.videolan.org/videolan/vlc.git
```

Startup the container (this assumes you have cloned VLC to `~/vlc`):
```bash
docker run --user root --rm --volume ~/vlc:/vlc -it registry.videolan.org/vlc-ubuntu-bionic:20190627090437 bash
```

Once that's done you'll be in a bash terminal, simply enter the source tree and compile:
```bash
cd /vlc/extras/package/snap
make -f package.mak snap
```

---

## For Linux (Binaries):

This is probably the most likely to fail as it's very dependent on the versions of dependencies on your system, if possible use the snap binaries:

Clone VLC:
```bash
git clone -b 3.0.x https://code.videolan.org/videolan/vlc.git
```

Startup the container (this assumes you have cloned VLC to `~/vlc`):
```bash
docker run --user root --rm --volume ~/vlc:/vlc -it registry.videolan.org/vlc-debian-unstable:20210803114245 bash
```

Compile VLC:
```bash
cd /vlc && export NCPU=$(nproc) && export TRIPLET=x86_64-linux-gnu

cd extras/tools && ./bootstrap && make -j$NCPU --output-sync=recurse

export PATH="/vlc/extras/tools/build/bin:$PATH"

cd ../../ && mkdir -p contrib/contrib-$TRIPLET && cd contrib/contrib-$TRIPLET

../bootstrap && make -j$NCPU --output-sync=recurse fetch

make -j$NCPU --output-sync=recurse

make package

cd ../../ && ./bootstrap && ./configure --enable-debug --disable-asdcp && make -j$NCPU

exit
```

You'll now have VLC binaries in the source tree, to install them to your system:

```bash
sudo apt install gcc-10
sudo make -j$(nproc) install
```
