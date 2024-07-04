#!/usr/bin/python3
import os

query = os.environ['QUERY_STRING'].encode(encoding="ascii",errors="ignore")

if (len(query) > 0):
    print("HTTP/1.0 200 OK")
    print("Content-Type: text/html\r\n")
    print('<head>')
    print('     <meta property="og:image" content="https://i.kym-cdn.com/photos/images/newsfeed/002/297/368/17f.jpg">')
    print('     <meta property="og:type" content="video.other">')
    print('     <meta property="og:video:url" content="' + query.decode(encoding="ascii",errors="ignore") + '">')
    print('     <meta property="og:video:width" content="1920">')
    print('     <meta property="og:video:height" content="1080">')
    print('</head>')
else:
    print("HTTP/1.0 500 Missing query string\r\n")
