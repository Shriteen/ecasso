// @ts-check

/**
 * @template T
 */
export default class Grid<T> {
  rows: number;
  cols: number;
  data: (T|null)[][];
  
  /**
   * @param {number} rows
   * @param {number} cols
   * @param {(row: number, col: number) => T} [create]
   */
  constructor(
    rows: number,
    cols: number,
    create: (row: number, col: number) => (T|null) = () => (null))
  {
    this.rows = rows;
    this.cols = cols;

    /** @type {T[][]} */
    this.data = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => create(r, c))
    );
  }

  /** @param {number} value @param {number} max */
  wrapIndex(value: number, max: number) {
    return (value % max + max) % max;
  }

  /** @param {number} r @param {number} c @returns {[number, number]} */
  wrap(r: number, c: number) {
    return [
      this.wrapIndex(r, this.rows),
      this.wrapIndex(c, this.cols)
    ];
  }

  /** @param {number} r @param {number} c @returns {T} */
  get(r: number, c: number) {
    const [rr, cc] = this.wrap(r, c);
    return this.data[rr][cc];
  }

  /** @param {number} r @param {number} c @param {T} value */
  set(r: number, c: number, value: T) {
    const [rr, cc] = this.wrap(r, c);
    this.data[rr][cc] = value;
  }

  getTop(r: number, c: number): T | null { return this.get(r - 1, c); }

  getBottom(r: number, c: number): T | null { return this.get(r + 1, c); }

  getLeft(r: number, c: number): T | null { return this.get(r, c - 1); }

  getRight(r: number, c: number): T | null { return this.get(r, c + 1); }

  getTopLeft(r: number, c: number): T | null { return this.get(r - 1, c - 1); }

  getTopRight(r: number, c: number): T | null { return this.get(r - 1, c + 1); }

  getBottomLeft(r: number, c: number): T | null { return this.get(r + 1, c - 1); }

  getBottomRight(r: number, c: number): T | null { return this.get(r + 1, c + 1); }

  getAdjacent4(r: number, c: number): (T | null)[] {
    return [
      this.getTop(r, c),
      this.getBottom(r, c),
      this.getLeft(r, c),
      this.getRight(r, c)
    ];
  }

  getDiagonal4(r: number, c: number): (T | null)[] {
    return [
      this.getTopLeft(r, c),
      this.getTopRight(r, c),
      this.getBottomLeft(r, c),
      this.getBottomRight(r, c)
    ];
  }

  getAll8(r: number, c: number): (T | null)[] {
    return [
      ...this.getAdjacent4(r, c),
      ...this.getDiagonal4(r, c)
    ];
  }


  forEach(fn: (value: T | null, row: number, col: number, grid: Grid<T>) => void ) : void
  {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
	fn(this.data[r][c], r, c, this);
      }
    }
  }

  map<U>(fn: (value: T | null, row: number, col: number, grid: Grid<T>) => U ) : Grid<U>
  {
    const newGrid = new Grid<U>(this.rows, this.cols, () => null);
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
	newGrid.data[r][c] = fn(this.data[r][c], r, c, this);
      }
    }
    return newGrid;
  }

  mapInPlace(fn: (value: T | null, row: number, col: number, grid: Grid<T>) => T | null ) : void
  {
    this.forEach((val, r, c) => {
      this.data[r][c] = fn(val, r, c, this);
    });
  }


}
