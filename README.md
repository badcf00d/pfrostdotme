# pfrostdotme

## Blog files

These are generate by the `gen_blog.py` script using a python package called Markdown2 to convert markdown to HTML. This is then merged into a skeleton HTML document using BeautifulSoup to generate a complete web page.

Dependencies:
```bash
apt install python3-markdown2 python3-pygments python3-bs4
```

CSS files are generated with
```bash
pygmentize -S monokai -f html -a .codehilite > css/pygments.css
```
Then deleting the first line `pre { line-height: 125%; }` since this seems to just make all lines in code blocks clip with eachother.

## React

To build the discord timestamps app:
```bash
sudo apt install npm
npm install
npm run build
```

Then add this to the nginx config:
```
    location /dstamp {
        index index.html;
        rewrite ^/dstamp(.*)$ /react/discord-timestamp/build/$1 break;
        try_files $uri $uri/ =404;
        limit_req zone=lr_zone burst=5 nodelay;
    }
```