# linear-algebra
A JavaScript library for linear algebra functions.

Introduction
------------

This library allows for real matrices of m x n size (ie. square and non-square). To create a regular matrix, use the following syntax:

``var myMat1 = new Matrix(m, n, [el1, el2, ... ]);``

To create an Identity matrix, use the following syntax:

``var myIdentityMat1 = new IdenMatrix(m);``

To create a Zero matrix, use the following syntax:

``var myZeroMat1 = new ZeroMatrix(m, n);``

By specifying the number of rows and columns, and the corresponding elements to go in the matrix, a Matrix object will be set up.

If the matrix constructor is passed an incorrect number of elements, or the elements cannot be converted to integer type, 
the Matrix will still be created, but it will be assigned the property "invalid".'


Matrix objects have a ``.rowNum`` and ``.colNum`` property indicating row and column numbers respectively. The raw information 
passed to the Matrix constructor when creating an instance is stored in the property ``.raw``.

The matrix itself is stored in the ``.mat`` property, and is an array of arrays. To access an element in the mth row and the nth
column, you would use ``myMat1.mat[m][n]``.
<br>

Universal Methods
-----------------


A valid matrix will have the following methods:

**1.** ``Matrix.prototype.add(n) `` **Returns the sum of two matrices as a new matrix object.**

**2.** ``Matrix.prototype.multiply(n) ``**Can be passed a scalar or a matrix, will return the product as a new matrix object.**

**3.** ``Matrix.prototype.trn() `` **Returns the transpose of the matrix as a new matrix object.**
<br>

Square Matrix Methods
---------------------

There are several methods that work exclusively on square matrices:

**1.** ``Matrix.prototype.det(mt.mat)`` **Takes a matrix array and returns the determinant, storing it in the ``.determinant`` property.**

**2.** ``Matrix.prototype.fastDet(mt.mat)`` **Same as above but calculates the determinant more quickly.**

**3.** ``Matrix.prototype.exp(n)`` **Exponentiates the matrix to n, where n is a real number. Returns a new matrix object.**

**4.** ``Matrix.prototype.cfact()`` **Returns the cofactor matrix as a new object.**

**5.** ``Matrix.prototype.inv()`` **Returns the inverse of a matrix as new object.**
