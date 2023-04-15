#!/bin/bash
echo "UPDATE STARTED"
rm -r elchiito.com
git clone https://github.com/matti377/elchiito.com.git
cp config.php elchiito.com/forms
echo "UPDATE FINISHED!"