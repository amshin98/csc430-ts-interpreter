#lang racket

;; ExprC
(define-type ExprC (U NumC BoolC StringC BinOpC TernC))
(struct NumC ([num : Real]) #:transparent)
(struct BoolC ([bool : Boolean]))
(struct StringC ([str : String]) #:transparent)
(struct OpC ([op : Symbol] [args : (Listof ExprC)]) #:transparent)
(struct TernC ([test : ExprC] [then : ExprC] [else : ExprC]))

;; Types of binop
(define-type arith-op (U '+ '- '* '/ '% '++ '-- '& '\| '^ '<< '>> '>>>))
(define-type unary-op (U '++ '-- '! '~))

;; Value
(define-type Value (U NumV BoolV StringV))
(struct NumV ([num : Real]) #:transparent)
(struct BoolV ([bool : Boolean]) #:transparent)
(struct StringV ([str : String]) #:transparent)

;; Increments the given number by 1
(: incr (Real Real))
(define (incr x)
  (+ x 1))

;; Decrements the given number by 1
(: decr (Real Real))
(define (decr x)
  (- x 1))

;; 

;; Binop table
(define op-table
  (make-immutable-hash (list (cons '+ +)
                             (cons '- -)
                             (cons '* *)
                             (cons '/ /)
                             (cons '% modulo)
                             (cons '++ incr)
                             (cons '-- decr)
                             (cons '&& and)
                             (cons '|| or)
                             (cons '! not))))