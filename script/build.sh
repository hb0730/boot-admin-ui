#!/bin/bash
pnpm run build
cd dist
tar -zcvf dist.tar.gz *
