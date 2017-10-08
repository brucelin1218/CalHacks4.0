# For suny
from __future__ import absolute_import
from __future__ import division, print_function, unicode_literals

from bs4 import BeautifulSoup
import requests
import re

#For suny
from sumy.parsers.html import HtmlParser
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

LANGUAGE = "english"
SENTENCES_COUNT = 3

def search(search_phrase):
	page = requests.get("https://news.google.com/news/search/section/q/" + search_phrase)

	soup = BeautifulSoup(page.content, "lxml")

	link_start = 26
	"""
	for a in soup.find_all('a')[26:35]:
		print("Link #" + str(i) + "\n")
		print(str(a) + "\n")
		i += 1
	"""
	href = soup.find_all('a')[link_start].get('href')
	# TODO If href is redirected to google.com, end the program
	if href.startswith("https://www.google.com"):
		return None
	return href

def summarize(url):
	# soup = BeautifulSoup(urllib2.urlopen(url))
	page = requests.get(url + search_phrase)
	soup = BeautifulSoup(page.content, "lxml")
	title = soup.title
	result = ""
	# result = url + "\n"
	# if title != None and title.string != None:
	# 	result += title.string.upper() + "\n"
	if __name__ == "__main__":
	    parser = HtmlParser.from_url(url, Tokenizer(LANGUAGE))
	    # or for plain text files
	    # parser = PlaintextParser.from_file("document.txt", Tokenizer(LANGUAGE))
	    stemmer = Stemmer(LANGUAGE)

	    summarizer = Summarizer(stemmer)
	    summarizer.stop_words = get_stop_words(LANGUAGE)

	    for sentence in summarizer(parser.document, SENTENCES_COUNT):
	        result += unicode(sentence) + " "
	return result

def main(search_phrase):
	# search_phrase = input("What would you like to news about? ")
	url = search(search_phrase)
	if url == None:
		return "I couldn't find anything on {0}.".format(search_phrase)
	summary = summarize(url)
	return summary

while True:
	try:
		# search_phrase = raw_input("What would you like to summarize the latest news about? ")
		search_phrase = raw_input()
		if (search_phrase == exit):
			exit()
		summary = main(search_phrase)
		print(summary.encode('utf-8'))  # print
	except EOFError:
		exit()