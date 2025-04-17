document.addEventListener('DOMContentLoaded', function () {
  const { createApp } = Vue;

  // utility functions
  function clamp(value, lo, hi) {
    return value < lo ? lo : value > hi ? hi : value;
  }
  // constants for setting drag boundaries
  const svgXmin = 0,
    svgXmax = 400,
    svgYmin = 0,
    svgYmax = 200;

  let xScale = d3.scaleLinear().domain([0, 60]).range([30, 700]);
  let yScale = d3.scaleLinear().domain([0, 20]).range([370, 10]);
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);

  const slrSquaresComponent = {
    data() {
      return {
        width: 750,
        height: 410,
        pointRadius: 8,
        points: [
          { circleID: 1, x: 50, y: 18 },
          { circleID: 2, x: 20, y: 4 },
          { circleID: 3, x: 3, y: 3 },
          { circleID: 4, x: 25, y: 12 },
          { circleID: 5, x: 15, y: 11 },
          { circleID: 6, x: 42, y: 12 },
        ],
        regression: { b0: 0, b1: 0 },
        squaredResidual: [],
      };
    },
    methods: {
      // Scale X & Y coordinates from d3 -> SVG
      getXY(point) {
        return { cx: xScale(point.x), cy: yScale(point.y) };
      },
      // Get current circle function
      getCircle(circleId) {
        let vm = this;
        let retVal = vm.points.find(({ circleID }) => circleID === circleId);
        return retVal;
      },
      // Set new value for current circle's X
      setNewX(eX, new_X) {
        let vm = this;
        let circleID = parseInt(eX.dataset.circleId);
        if (!circleID || isNaN(circleID)) {
          console.warn('circleID is missing from dataset', eX);
          return;
        }
        let existingCircle = vm.getCircle(circleID);
        if (existingCircle) {
          //Check that we found a matching circle
          existingCircle.x = clamp(
            new_X,
            svgXmin + existingCircle.r,
            svgXmax - existingCircle.r
          );
        }
      },
      // Set new value for current circle's Y
      setNewY(eY, new_Y) {
        let vm = this;
        let circleID = parseInt(eY.dataset.circleId);
        if (!circleID || isNaN(circleID)) {
          console.warn('circleID is missing from dataset', eY);
          return;
        }
        let existingCircle = vm.getCircle(circleID);
        if (existingCircle) {
          //Check that we found a matching circle
          existingCircle.y = clamp(
            new_Y,
            svgYmin + existingCircle.r,
            svgYmax - existingCircle.r
          );
        }
      },
      // Controls all dragging functions
      createDrag() {
        // capture vue component context `this`
        let vm = this;

        return d3
          .drag()
          .on('start', function (e, d) {
            // d3.select(this).attr('stroke', 'black');
          })
          .on('drag', function (e, d) {
            // `this` inside the call back is the circle element
            // const pt = new DOMPoint(e.clientX, e.clientY); // gives the same coordinates as pt
            // let { x, y } = pt.matrixTransform(
            //   vm.$refs.coordBox.getScreenCTM().inverse()
            // );

            vm.setNewX(this, xScale.invert(e.x));
            vm.setNewY(this, yScale.invert(e.y));

            // Update display of slope and intercept
            vm.updateRegression();
            // Update residual lines
            vm.updateResiduals();
          })
          .on('end', function (e, d) {
            //d3.select(this).attr('stroke', 'none');
          });
      },
      // Draw Graph axes
      drawAxes() {
        d3.select(this.$el)
          .append('g')
          .call(xAxis)
          .attr('transform', 'translate(0, 370)')
          .attr('text-anchor', 'end');

        d3.select(this.$el)
          .append('g')
          .call(yAxis)
          .attr('transform', 'translate(30, 0)')
          .attr('text-anchor', 'end');
      },
      addPoint(event) {
        let vm = this;
        const [x, y] = d3.pointer(event);
        let pointsLength = vm.points.length + 1;
        let found = vm.points.some((el) => el.circleID === pointsLength);
        while (found !== false) {
          pointsLength = pointsLength + 1;
          found = vm.points.some((el) => el.circleID === pointsLength);
        }

        const newPoint = {
          circleID: pointsLength,
          x: xScale.invert(x),
          y: yScale.invert(y),
        };

        // Vue's reactivity ensures this update gets reflected in the UI
        vm.points = [...vm.points, newPoint];
        // Update display of slope and intercept
        vm.updateRegression();
        // Update residual lines
        vm.updateResiduals();
        vm.makeDraggable();
      },
      removePoint(e) {
        let vm = this;
        let cID = parseInt(e.currentTarget.dataset.circleId);
        if (isNaN(cID)) {
          console.warn('Could not find circleID on click event', e);
          return;
        }
        let newPoints = vm.points.filter(({ circleID }) => circleID !== cID);
        vm.points = newPoints.map((d) => ({ ...d }));
        // Update display of slope and intercept
        vm.updateRegression();
        // Update residual lines
        vm.updateResiduals();
      },
      makeDraggable() {
        let vm = this;
        vm.$nextTick(() => {
          d3.select(this.$refs.coordBox)
            .selectAll('circle')
            .classed('draggable', true)
            .call(this.createDrag());
        });
      },
      // Caclculate the slope and intercept of the regression line
      calcSLR() {
        let vm = this;
        switch (vm.points.length) {
          case 0: {
            const b1 = 0;
            const b0 = 0;

            return { b0, b1 };
          }
          case 1: {
            const Y = vm.points.map((p) => p.y);
            const Ybar = Y.reduce((a, b) => a + b, 0) / Y.length;

            const b1 = 0;
            const b0 = Ybar;

            return { b0, b1 };
          }
          default: {
            const X = vm.points.map((p) => p.x);
            const Y = vm.points.map((p) => p.y);
            const Xbar = X.reduce((a, b) => a + b, 0) / X.length;
            const Ybar = Y.reduce((a, b) => a + b, 0) / Y.length;
            const SXY = X.map((x, i) => (x - Xbar) * (Y[i] - Ybar)).reduce(
              (a, b) => a + b,
              0
            );
            const SXX = X.map((x, i) => (x - Xbar) * (x - Xbar)).reduce(
              (a, b) => a + b,
              0
            );
            const b1 = SXY / SXX;
            const b0 = Ybar - b1 * Xbar;

            return { b0, b1 };
          }
        }
      },
      // Wrapper to update regression values
      updateRegression() {
        let vm = this;
        vm.regression = vm.calcSLR(); // Update state with calculated values
      },
      // Add the initial residuals
      addResiduals(point) {
        let vm = this;
        const predictedY = vm.regression.b0 + vm.regression.b1 * point.x;
        const computedSides = Math.abs(yScale(predictedY) - yScale(point.y));
        const check = yScale(predictedY) - yScale(point.y) < 0;
        const deg = check ? -90 : 90;
        vm.squaredResidual.push({
          residualID: point.circleID,
          width: computedSides,
          height: computedSides,
          x: xScale(point.x),
          y: yScale(point.y),
          transform:
            'rotate(' +
            deg +
            ',' +
            xScale(point.x) +
            ',' +
            yScale(point.y) +
            ')',
        });
        return {
          residualID: point.circleID,
          width: computedSides,
          height: computedSides,
          x: xScale(point.x),
          y: yScale(point.y),
          transform:
            'rotate(' +
            deg +
            ',' +
            xScale(point.x) +
            ',' +
            yScale(point.y) +
            ')',
        };
      },
      // Update the entire array of residuals
      updateResiduals() {
        let vm = this;
        vm.squaredResidual = vm.points.map((point) => {
          const predictedY = vm.regression.b0 + vm.regression.b1 * point.x;
          const computedSides = Math.abs(yScale(predictedY) - yScale(point.y));
          const check = yScale(predictedY) - yScale(point.y) < 0;
          const deg = check ? -90 : 90;
          return {
            residualID: point.circleID,
            width: computedSides,
            height: computedSides,
            x: xScale(point.x),
            y: yScale(point.y),
            transform:
              'rotate(' +
              deg +
              ',' +
              xScale(point.x) +
              ',' +
              yScale(point.y) +
              ')',
          };
        });
      },
    },
    computed: {
      // return the coordinates for the Regression Line
      getLine() {
        const { b0, b1 } = this.calcSLR();
        return {
          x1: xScale(0),
          y1: yScale(b0),
          x2: xScale(750), // currently runs through axes
          y2: yScale(b0 + b1 * 750),
        };
      },
    },
    mounted() {
      this.drawAxes(); // Initial axes draw
      this.makeDraggable();
      this.updateRegression(); // Initial dispaly of slope and intercept
    },
    // this is the color pallete: https://coolors.co/palette/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
    template: `
    <svg class="svgBox" :width="width" :height="height" ref="coordBox" xmlns:xlink="http://www.w3.org/1999/xlink" @click="addPoint">>
      <text x="165" y="20" fill="#afb0b1" font-size="1.15rem" dominant-baseline="hanging" text-anchor="end" font-family="Source Sans Pro">
        Y = {{ regression.b1.toFixed(2) }} X + {{regression.b0.toFixed(2)}}
      </text>

      <text x="114" y="40" fill="#afb0b1" font-size="1.15rem" dominant-baseline="hanging" text-anchor="end" font-family="Source Sans Pro">
        β_1: {{ regression.b1.toFixed(2) }}
      </text>
      <text x="114" y="60" fill="#afb0b1" font-size="1.15rem" dominant-baseline="hanging" text-anchor="end" font-family="Source Sans Pro">
        β_0: {{ regression.b0.toFixed(2) }}
      </text>

      <!-- Regression Line -->
      <line v-bind="getLine" stroke="#CA6702" stroke-width="3" clip-path="url(#cut-bottom)" />

      <!-- Residual Lines -->
      <rect
        v-for="point in points"
        v-bind="addResiduals(point)"
        stroke="#E9D8A6"
        stroke-dasharray="5,5"
        fill="#E9D8A6"
        fill-opacity="60%"
      />

      <!-- pulse -->
      <circle
        ref="draggableCircles"
        v-for="point in points"
        v-bind="getXY(point)"
        :data-circle-id="point.circleID"
        :r="pointRadius"
        fill="#94D2BD"
        @click.stop="removePoint"
      >
        <animate attributeName="r" from="6" to="14" dur="1.5s" begin="0s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/>
      </circle>

      <!-- Draggable Points -->
      <circle
        ref="draggableCircles"
        v-for="point in points"
        v-bind="getXY(point)"
        :data-circle-id="point.circleID"
        :r="pointRadius"
        fill="#94D2BD"
        stroke-width="20"
        stroke="transparent"
        @click.stop="removePoint"
      />



    </svg>
    `,
  };
  // Mount Vue to the empty #app div
  // app.mount('#slrSquares');
  createApp(slrSquaresComponent).mount('#slrSquares');
});
