from bs4 import BeautifulSoup
import requests
import re

def search(search_phrase):
	page = requests.get("https://news.google.com/news/search/section/q/" + search_phrase)

	soup = BeautifulSoup(page.content, "lxml")

	link_start = 26
	'''
	for a in soup.find_all('a')[26:35]:
		print("Link #" + str(i) + "\n")
		print(str(a) + "\n")
		i += 1
	'''
	href = soup.find_all('a')[link_start].get('href')
	# TODO If href is redirected to google.com, end the program
	if href.startswith("https://www.google.com"):
		return False
	print(href)

def main():
	search_phrase = input("What would you like to news about? ")
	search(search_phrase)
while True:
	main()