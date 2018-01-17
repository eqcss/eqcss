#!/usr/local/bin/fish

# SIMPLE SITEMAP BUILD SCRIPT

true > sitemap.txt

for file in *.html */*.html
  echo (echo "https://elementqueries.com/$file" | sed '$s/\.\.\///') >> sitemap.txt
end