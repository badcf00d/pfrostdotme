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