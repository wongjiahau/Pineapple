```smalltalk
"
There are 4 declarations only in Pineapple:
1) def (which is functions)
2) template (which is struct in C)
3) trait (aka interface)
4) implement (aka instance in Haskell)
"

def sort xs T[] -> T[] where T implements Comparable
  pass

def reshape: xs Int[] as: dimension Int[] -> Int[]
	pass
	
def replace: old String|Regex with: new String in: target String -> String
	pass 
  
trait Equatable T
	def left T (==) right T -> Bool
		pass 
		
	def left T (!=) right T -> Bool 
		return not left == right 
	
trait Comparable T extends Equatable T
	def left T (>)  right T -> Bool
		pass 
	
	def left T (>=) right T -> Bool 
		return left > right or left == right 
	
	def left T (<) right T  -> Bool
		return not left > right and not left == right
	
	def left T (<=) right T -> Bool 
		return left < right or left == right
		

trait Stringifiable T
	def target T toString: -> String
		pass 

implement Comparable Fruit 
	def left Fruit (==) right Fruit -> Bool
		return \
			left.name     == right.name and  \
			left.price    == right.price and \
			left.siblings == right.siblings
	
	def left Fruit (>) right Fruit -> Bool 
      pass
      
template Fruit
	.name      String
	.price     Decimal  
	.siblings  Fruit[]?

def main:
	let myFruit =  Fruit 
		.name     =  'Pineapple'
		.price    = 99.99
		.siblings = 
			o Fruit
				.name     = 'Durian' 
				.price    = 88
				.siblings = nil
			o Fruit 
				.name     = 'Apple'
				.price    = 33.23
				.siblings = nil
	


```
