//Set to false to turn off helper text.
var helperText = true;

//Returns a cloned array
cloneArr = function(originArr) {
	var clonedArr = originArr.map(function(ar) {
		return ar.slice();
	});
	return clonedArr;
};

//General constructor for matrices. Requires the number of rows, columns and the raw values when creating a matrix.
function Matrix(row, col, items) {
	this.rowNum = row;
	this.colNum = col;
	this.raw = items;

	this.valid;
	this.square;
	this.verify();
	this.genMat();

	if (this.square) this.determinant = this.det();
}

//Calculates certain properties of the Matrix and stores them as properties.
Matrix.prototype.verify = function() {
	this.square = (this.rowNum === this.colNum);
	this.valid = !!((this.raw.length === (this.rowNum * this.colNum)) * !this.raw.some(isNaN));
	if (!this.valid) console.error('Warning: Invalid matrix');
};

//Takes the raw array passed to the constructor, and converts it into a structured matrix.
Matrix.prototype.genMat = function() {
	this.mat = [];
	for (incr = 0; incr < this.rowNum; incr++) {
		this.mat.push([]);
		for (incr2 = 0; incr2 < this.colNum; incr2++) {
			this.mat[incr].push(this.raw[(incr * this.colNum) + incr2]);
		}
	}
};

Matrix.prototype.add = function(mt) {
	if (this.rowNum !== mt.rowNum || this.colNum !== mt.colNum) { console.error('Matrices not additively comfortable'); return null}
	return this.mat.map(function(el, a) {
		return el.map(function(x, b) {
			return x + mt.mat[a][b];
		});
	});
};

//Takes in a second matrix as a parameter, and returns the product of the two matrices as a new matrix.
Matrix.prototype.multiply = function(mt) {
	if (typeof(mt) === "number") return new Matrix(this.rowNum, this.colNum, this.raw.map(x => x * mt));
	if (this.colNum !== mt.rowNum) { console.error('Invalid multiplication'); return null}
	var rawArr = Array(this.rowNum * mt.colNum).fill(0);
	for (p = 0; p < this.rowNum; p++) {
		for (q = 0; q < mt.colNum; q++) {
			for (r = 0; r < mt.rowNum; r++) {
				rawArr[(p * this.rowNum) + q] += (this.mat[p][r] * mt.mat[r][q]);
			}
		}
	}
	return new Matrix(this.rowNum, mt.colNum, rawArr);
};

//Returns a new matrix, which has been raised to the power of ind.
Matrix.prototype.exp = function(ind) {
	if (!(this.square)) { console.error('Invalid operation'); return null}
	var count = 1;
	m = this;
	while (count < ind) {
		m = this.multiply(m);
		count++;
	}
	return m;
};


//Recursively calculates the determinant of a square matrix - takes a matrix in and outputs an integer.
Matrix.prototype.det = function(mt = this.mat) {
	var res = 0;
	var rn = mt.length;
	//Exit case for 2x2 matrix.
	if (rn === 1) return mt[0][0];
	if (rn === 2) return (mt[0][0] * mt[1][1]) - (mt[0][1] * mt[1][0]);


	//Generates the matrices of minors for each element on the top row of mt.
	for (var f = 0; f < rn; f++) {
		var newArr = cloneArr(mt);
		newArr.shift();
		newArr.map(function(el) {
			el.splice(f, 1);
			return el;
		});
		//Recursively calculates the determinant of each minor matrix, adding the result to res each time.
		res += ((f % 2 === 0) ? 1 : -1) * mt[0][f] * this.det(newArr);
	}
	return res;
};

//Returns the cofactor of a matrix.
Matrix.prototype.cfact = function() {
	cfactArr = [];
	for (rs = 0; rs < this.rowNum; rs++) {
		for (cs = 0; cs < this.colNum; cs++) {
			var minorArr = cloneArr(this.mat);
			minorArr.splice(rs, 1);
			minorArr.map(function(elem){
				elem.splice(cs, 1);
				return elem;
			});
			cfactArr.push((Math.pow(-1, cs + rs)) * this.det(minorArr));
		}
	}
	return new Matrix(this.rowNum, this.colNum, cfactArr);
};

//Returns the transpose of a matrix.
Matrix.prototype.trn = function() {
	var trnArr = [];
	for (cls = 0; cls < this.mat[0].length; cls++) {
		for (rws = 0; rws < this.mat.length; rws++) {
			trnArr.push(this.mat[rws][cls]);
		}
	}
	return new Matrix(this.colNum, this.rowNum, trnArr);
};

//Returns the inverse of a matrix - multiplies the transpose of the cofactor matrix by the determinant.
Matrix.prototype.inv = function() {
	if (!this.square) { console.error('Cannot invert a non-square matrix.'); return null;}
	this.det();
	return ((this.cfact()).trn()).multiply(this.determinant);
};

//Constructor for Identity matrices.
function IdenMatrix(row) {
	this.colNum = this.rowNum;
	this.mat = [];
	this.raw = [];
	for (i = 0; i < row; i++) {
		this.mat.push([]);
		for (j = 0; j < row; j++) {
			if (i === j) {
				this.mat[i].push(1);
				this.raw.push(1);
			}
			else {
				this.mat[i].push(0);
				this.raw.push(0);
			}
		}
	}
	Matrix.call(this, row, row, this.raw);
}

IdenMatrix.prototype = Object.create(Matrix.prototype);
IdenMatrix.prototype.constructor = IdenMatrix;


//Constructor for Zero matrices.
function ZeroMatrix(row, col) {
	this.raw = [];
	this.mat = [];
	for (i = 0; i < row; i++) {
		this.mat.push([]);
		for (j = 0; j < col; j++) {
			this.mat[i].push(0);
			this.raw.push(0);
		}
	}
	Matrix.call(this, row, col, this.raw);
}

ZeroMatrix.prototype = Object.create(Matrix.prototype);
ZeroMatrix.prototype.constructor = ZeroMatrix;


if(helperText) {
	console.log('%cWelcome to this Matrix library!', 'color: #f44336; font-size: 200%; text-outline: 2px solid #2196F3; font-weight: 800pt; text-decoration: underline');
	console.log(' ');
	console.log('%cTo create a matrix, type "new Matrix({# of rows}, {# of columns}, {[values]})', 'font-size: 120%');
	console.log('%cFor example, var myMat = new Matrix(3, 2, [4, 3, 7, 6, 1, 1]) produces the following object, with the matrix stored in .mat:', 'font-size: 120%');
	var myMat = new Matrix(3, 3, [4, 3, 7, 6, 1, 1, 2, 9, 5]);
	console.log(' ');
	console.log(myMat);
	console.log(' ');
	console.log('%cTo multiply a matrix by another, call the method multiply() of the first matrix, and pass the second matrix as a parameter', 'font-size: 120%');
	console.log('%cFor example, myMat.multiply(myMat2)', 'font-size: 120%');
	console.log(' ');
	console.log('%cTo turn these instructions off, change the helperText global variable in the source code to "False".', 'font-size: 120%');
}