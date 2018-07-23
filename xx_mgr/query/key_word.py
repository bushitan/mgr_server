# -*- coding: utf-8 -*-
from lib.query_base import *
from xx_mgr.models import *
class QueryKeyWord(QueryBase):
	def __init__(self):
		super(QueryKeyWord,self).__init__(MGRKeyWord)

	#用于封面展示的数据
	def _PackDict(self,obj):
		return {
			"key_word":obj.key_word,
		}
	# def Cover(self):

if __name__ == "__main__":
	import os,django
	django.setup()
	q = QueryKeyWord()
	print q.Filter(	pid=11)
	# print query_user.GetDict(session = "12321321")