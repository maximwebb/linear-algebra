//Set to false to turn off helper text.
var helperText = false;

//Returns a cloned array
cloneArr = function(originArr) {
	var clonedArr = originArr.map(function(ar) {
		return ar.slice();
	});
	return clonedArr;
};

//General constructor for matrices. Requires the number of rows, columns and the raw values when creating a matrix.
class Matrix extends Array {
	constructor(row, col, items) {
		super();
		if (typeof(row) !== 'number') {
			console.error('Row number must be an integer');
			return undefined;
		}
		if (typeof(col) !== 'number') {
			console.error('Column number must be an integer');
			return undefined;
		}
		if (!Array.isArray(items)) {
			console.error('Matrix element list must be an array');
			return undefined;
		}



		this.rowNum = row;
		this.colNum = col;
		this.raw = items;

		for (let i = 0; i < this.rowNum; i++) {
			this.push([]);
			for (let j = 0; j < this.colNum; j++) {
				this[i].push(items[i * this.colNum + j]);
			}
		}
	}

	static clone(m1) {
		let arr = [];
		for (let i = 0; i < m1.rowNum; i++) {
			for (let j = 0; j < m1.colNum; j++) {
				arr.push(m1[i][j]);
			}
		}
		return new Matrix(m1.rowNum, m1.colNum, arr);
	}

	static add(m1, m2) {
		if (m1.rowNum !== m2.rowNum || m1.colNum !== m2.colNum) {
			console.error('Incompatible matrices.');
		}
		let tmpArr = [];
		for (let i = 0; i < m1.rowNum; i++) {
			for (let j = 0; j < m1.colNum; j++) {
				tmpArr.push(m1[i][j] + m2[i][j]);
			}
		}

		return new Matrix(tmpArr, m1.rowNum, m1.colNum);

	}

	static multiply(m1, m2) {
		if (m1.colNum !== m2.rowNum) {
			console.error('Incompatible matrices.');
		}
		let tmpArr = [];
		for (let i = 0; i < m1.rowNum; i++) {
			for (let j = 0; j < m2.colNum; j++) {
				tmpArr.push(0);
				for (let k = 0; k < m1.colNum; k++) {
					tmpArr[i * m2.colNum + j] += m1[i][k] * m2[k][j];
				}
			}
		}
		return new Matrix(m1.rowNum, m2.colNum, tmpArr);
	}

	static scalarMultiply(m1, num) {
		let m2 = this.clone(m1);
		for (let i = 0; i < m1.rowNum; i++) {
			for (let j = 0; j < m1.colNum; j++) {
				m2[i][j] *= num;
			}
		}
		return m2;
	}

	static determinant(m) {
		if (m.rowNum !== m.colNum) {
			console.error('Non-square matrix.');
		}
		let m1 = this.clone(m);
		for (let i = 0; i < m1.colNum - 1; i++) {
			for (let j = i + 1; j < m1.rowNum; j++) {
				let multiplier = m1[j][i] / m1[i][i];
				m1[j][i] = 0;
				for (let k = i + 1; k < m1.colNum; k++) {
					m1[j][k] = m1[j][k] - multiplier * m1[i][k];
				}
			}

		}
		let res = 1;
		for (let i = 0; i < m1.rowNum; i++) {
			res *= m1[i][i];
		}
		res = Math.round(res * 10000) / 10000;
		return res;
	}

	static exp(m1, ind) {
		if (!(this.square)) { console.error('Invalid operation'); return null}
		var count = 1;
		while (count < ind) {
			m1 = this.multiply(m1);
			count++;
		}
		return m1;
	};

	static cofactor(m1) {
		let cfactArr = [];
		for (let rs = 0; rs < m1.rowNum; rs++) {
			for (let cs = 0; cs < m1.colNum; cs++) {
				let minorArr = this.clone(m1);
				minorArr.splice(rs, 1);
				minorArr.map(function(elem){
					elem.splice(cs, 1);
					return elem;
				});
				cfactArr.push((Math.pow(-1, cs + rs)) * m1.det(minorArr));
			}
		}
		return new Matrix(m1.rowNum, m1.colNum, cfactArr);
	};

	static transpose(m1) {
		let trnArr = [];
		for (let cls = 0; cls < m1[0].length; cls++) {
			for (let rws = 0; rws < m1.length; rws++) {
				trnArr.push(m1[rws][cls]);
			}
		}
		return new Matrix(m1.colNum, m1.rowNum, trnArr);
	};

	static invert(m1) {
		let det = this.determinant(m1);
		let m2 = this.cofactor(m1);
		m2 = this.transpose(m2);
		m2 = this.scalarMultiply(m2, 1/det);

		return m2;
	}

	static print(m1) {
		for (let i = 0; i < m1.rowNum; i++) {
			let str = "|";

			for (let j = 0; j < m1.colNum; j++) {
				str += m1[i][j];
				str += " ";
			}
			str += "|";
			console.log(str);
		}
	};
}

let mat1 = new Matrix(3, 3, [6, 4, 23, 7, 1, 0, 3, -2, 8]);

//Constructor for Identity matrices.
class IdentityMatrix extends Matrix {
	constructor(size) {
		if (typeof(size) !== 'number') {
			console.error('Matrix size must be an integer');
		}

		let arr = new Array(size * size).fill(0);
		for (let i = 0; i < size; i++) {
			arr[i * size + i] = 1;
		}

		super(size, size, arr);

	}
}

let mat2 = new IdentityMatrix(5);

class ZeroMatrix extends Matrix {
	constructor(row, col) {
		if (typeof(row) !== 'number') {
			console.error('Row number must be an integer');
		}
		if (typeof(col) !== 'number') {
			console.error('Column number must be an integer');
		}

		super(row, col, new Array(row * col).fill(0));
	}

}

let mat3 = new ZeroMatrix(4, 6);

class RandomIntegerMatrix extends Matrix {
	constructor(row, col) {
		if (typeof(row) !== 'number') {
			console.error('Row number must be an integer');
		}
		if (typeof(col) !== 'number') {
			console.error('Column number must be an integer');
		}
		let arr = [];
		for (let i = 0; i < row * col; i++) {
			arr.push(Math.floor(Math.random() * 100));
		}

		super(row, col, arr);
	}
}

let mat4 = new RandomIntegerMatrix(7, 22);



if(helperText) {
	console.log('%cWelcome to this Matrix library!', 'color: #f44336; font-size: 200%; text-outline: 2px solid #2196F3; font-weight: 800pt; text-decoration: underline');
	console.log(' ');
	console.log('%cTo create a matrix, type "new Matrix({# of rows}, {# of columns}, {[values]})"', 'font-size: 120%');
	console.log('%cFor example, var myMat = new Matrix(3, 3, [4, 3, 7, 6, 1, 1, 2, 9, 5]) produces the following object, with the matrix stored in .mat:', 'font-size: 120%');
	var myMat = new Matrix(3, 3, [4, 3, 7, 6, 1, 1, 2, 9, 5]);
	console.log(' ');
	console.log(myMat);
	console.log(' ');
	console.log('%cTo multiply a matrix by another, call the method multiply() of the first matrix, and pass the second matrix as a parameter', 'font-size: 120%');
	console.log('%cFor example, myMat.multiply(myMat2)', 'font-size: 120%');
	console.log(' ');
	console.log('%cTo turn these instructions off, change the helperText global variable in the source code to "False".', 'font-size: 120%');
}