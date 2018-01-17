#!/usr/local/bin/fish

# SIMPLE SITEMAP BUILD SCRIPT

true > sitemap.txt

echo "Building sitemap…"

for file in *.html */*.html
  echo " adding $file"
  echo "https://elementqueries.com/$file" >> sitemap.txt
end

echo "Sitemap built!"