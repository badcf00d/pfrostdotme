#!/usr/bin/python3
import markdown2
from pathlib import Path
from bs4 import BeautifulSoup

pathlist = Path("blog").rglob('*.md')

for path in pathlist:
    with open("blog/skeleton.html") as html_file:
        soup = BeautifulSoup(html_file, 'html.parser')

    nice_name = path.stem.replace('-', ' ').replace('_', ' ').title()
    soup.find('div', {'class': 'style-jumbotron'})['title'] = nice_name

    blogpost = markdown2.markdown(path.read_text(),
                                  extras=['fenced-code-blocks'])

    soup.find('main').append(BeautifulSoup(blogpost, 'html.parser'))

    with path.with_suffix(".html").open(mode="w") as f:
        f.write(str(soup))
