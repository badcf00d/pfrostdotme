#!/usr/bin/python3
import markdown2
from pathlib import Path
from bs4.formatter import HTMLFormatter
from bs4.dammit import EntitySubstitution
from bs4 import BeautifulSoup

better_format = HTMLFormatter(    
    entity_substitution=EntitySubstitution.substitute_html,
    void_element_close_prefix=None,
    empty_attributes_are_booleans=True,
    indent=4)

def pretty_title(ugly_string: str) -> str:
    return ugly_string.replace('-', ' ').replace('_', ' ').title()


def generate_blog_pages():
    pathlist = Path("blog").rglob('*.md')

    for path in pathlist:
        with open("blog/skeleton.html") as html_file:
            soup = BeautifulSoup(html_file, 'html.parser')

        nice_name = pretty_title(path.stem)
        soup.find('div', {'class': 'style-jumbotron'})['title'] = nice_name

        blogpost = markdown2.markdown(path.read_text(),
                                    extras=['fenced-code-blocks'])

        soup.find('main').append(BeautifulSoup(blogpost, 'html.parser'))

        with path.with_suffix(".html").open(mode="w") as f:
            f.write(str(soup))

def generate_home_page():
    with open("home.html", "r+") as html_file:
        home_soup = BeautifulSoup(html_file, 'html.parser')

        home_soup.find('nav').clear()

        for blog_page in Path("blog").rglob('*.html'):
            if blog_page.stem == 'skeleton':
                continue
            blog_soup = BeautifulSoup(blog_page.read_text(), 'html.parser')

            new_heading = home_soup.new_tag('h1')
            new_heading.string = pretty_title(blog_page.stem)
            home_soup.find('nav').append(new_heading)

            new_link = home_soup.new_tag('a', href=str(blog_page))
            new_heading.wrap(new_link)
            new_link.wrap(home_soup.new_tag('div'))

            description = home_soup.new_tag('p')
            description.string = blog_soup.main.get_text(" ", strip=True)[:250]
            description.string += '...'
            new_link.append(description)
            

        html_file.seek(0)
        html_file.write(home_soup.prettify(formatter=better_format))
        html_file.truncate()

generate_blog_pages()
generate_home_page()