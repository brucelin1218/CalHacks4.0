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
		return False
	print(href)
	return href

def summarize(url):
	result = ""
	if __name__ == "__main__":
	    parser = HtmlParser.from_url(url, Tokenizer(LANGUAGE))
	    # or for plain text files
	    # parser = PlaintextParser.from_file("document.txt", Tokenizer(LANGUAGE))
	    stemmer = Stemmer(LANGUAGE)

	    summarizer = Summarizer(stemmer)
	    summarizer.stop_words = get_stop_words(LANGUAGE)

	    for sentence in summarizer(parser.document, SENTENCES_COUNT):
	        result += str(sentence) + " "
	return result

def main(search_phrase):
	# search_phrase = input("What would you like to news about? ")
	url = search(search_phrase)
	summary = summarize(url)
	# print(summary)
	return summary

while True:
	search_phrase = input("What would you like to news about? ")
	if (search_phrase == "exit"):
		exit()
	main(search_phrase)