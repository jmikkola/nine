(function() {
    "use strict";


    function fillCells(size) {
        var grid = [];
        for (var i = 0; i < size; i++) {
            var row = [];
            for (var j = 0; j < size; j++) {
                row.push(1);
            }
            grid.push(row);
        }
        return grid;
    }

    function gatherArea(grid, center_i, center_j) {
        var area = fillCells(3);

        for (var i = 0; i < 3; i++) {
            var grid_i = center_i + i - 1;
            if (grid_i < 0 || grid_i >= grid.length) {
                continue;
            }

            for (var j = 0; j < 3; j++) {
                var grid_j = center_j + j - 1;
                if (grid_j < 0 || grid_j >= grid.length) {
                    continue;
                }

                area[i][j] = grid[grid_i][grid_j];
            }
        }

        return area;
    }

    function reverse(val) {
        return val ? 0 : 1;
    }

    function computeNext(area) {
        if (!area[1][1]) {
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    if (i !== 1 || j !== 1) {
                        area[i][j] = reverse(area[i][j]);
                    }
                }
            }
        }
        return area;
    }

    function nextGrid(grid) {
        var gridSize = 3 * grid.length;
        var newGrid = fillCells(gridSize);

        for (var oi = 0; oi < grid.length; oi++) {
            var oldRow = grid[oi];

            for (var oj = 0; oj < oldRow.length; oj++) {
                var area = gatherArea(grid, oi, oj);
                var newArea = computeNext(area);

                for (var i = 0; i < 3; i++) {
                    var ni = (oi * 3) + i;
                    var row = newArea[i];

                    for (var j = 0; j < 3; j++) {
                        var nj = (oj * 3) + j;
                        newGrid[ni][nj] = row[j];
                    }
                }
            }
        }

        return newGrid;
    }

    function renderGrid(element, totalSize, grid) {
        var canvas = $("<canvas>");
        canvas.attr('height', totalSize);
        canvas.attr('width', totalSize);
        canvas.css({
            display: 'inline-block',
            margin: '30px'
        });

        var ctx = canvas[0].getContext('2d');
        ctx.fillStyle = 'black';

        var cellSize = totalSize / grid.length;

        for (var i in grid) {
            var row = grid[i];
            for (var j in row) {
                if (row[j] === 0) {
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                }
            }
        }

        element.append(canvas);

        return canvas;
    }

    function renderIterations(containingEl, totalSize, grid, nIterations) {
        console.log('renderIterations', totalSize, nIterations, grid);
        containingEl.empty();

        for (var i = 1; i < nIterations; i++) {
            grid = nextGrid(grid);
            renderGrid(containingEl, totalSize, grid);
        }
    }

    function bindClick(cell, i, j, onClick) {
        cell.click(function(e) {
            e.preventDefault();
            onClick(cell, i, j);
        });
    }

    function renderStartingGrid(containingEl, totalSize, startingGrid, updateFn) {
        var numCells = startingGrid.length;
        var cellSize = totalSize / numCells;

        var table = $("<table>", {
            cellpadding: 0,
            cellspacing: 0
        });

        function getColor(i, j) {
            return startingGrid[i][j] === 1 ? 'white' : 'black';
        }

        for (var i = 0; i < numCells; i++) {
            var row = $("<tr>");
            for (var j = 0; j < numCells; j++) {
                var cell = $("<td>", {
                    width: cellSize,
                    height: cellSize
                });
                cell.css({'background-color': getColor(i, j)});

                bindClick(cell, i, j, function(cell, i, j) {
                    startingGrid[i][j] = reverse(startingGrid[i][j]);
                    cell.css({'background-color': getColor(i, j)});
                    updateFn(startingGrid);
                });

                row.append(cell);
            }
            table.append(row);
        }

        containingEl.empty();
        containingEl.append($("<span>Click on the squares:</span>"));
        containingEl.append(table);
    }

    function start(rootElement) {
        rootElement.empty();

        var startingGridContainer = $("<div>");
        var iterationContainer = $("<div>");

        rootElement.append(startingGridContainer);
        rootElement.append(iterationContainer);

        var startingGrid = [
            [0, 1, 0],
            [1, 0, 1],
            [0, 1, 0],
        ];
        var nIterations = 5;
        var minCellSize = 1;
        var totalSize = minCellSize * startingGrid.length * Math.pow(3, nIterations);

        renderStartingGrid(startingGridContainer, totalSize, startingGrid, function(newGrid) {
            renderIterations(iterationContainer, totalSize, newGrid, nIterations);
        });

        renderIterations(iterationContainer, totalSize, startingGrid, nIterations);
    }

    $(document).ready(function() {
        start($('[data-nine]'));
    });
}());
