<template>
  <div class="position-relative network-graph">
    <div :id="id" class="w-100 vh-100 svg" />

    <div v-if="!finished" class="progress-wrapper">
      <div class="progress">
        <div
          :id="id + `-progress`"
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          style="width: 60%"
          aria-valuenow="60"
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  </div>

  <div v-if="controls" class="card d3-toolbar">
    <div class="card-body">
      <div class="columns">
        <div class="col">
          <label for="customRange1" class="label">Line distance</label>
          <input
            id="customRange1"
            v-model="distance"
            type="range"
            class="form-range"
            min="0"
            max="100"
            @input="changeDraw"
          />
        </div>
        <div class="col">
          <label for="customRange1" class="label">Circle distance</label>
          <input
            id="customRange1"
            v-model="iterations"
            type="range"
            class="form-range"
            min="1"
            max="100"
            @input="changeDraw"
          />
        </div>
        <div class="col">
          <label class="label d-block" for="flexSwitchCheckDefault">Show text</label>
          <div class="form-check form-switch">
            <input
              id="flexSwitchCheckDefault"
              v-model="texts"
              class="form-check-input"
              type="checkbox"
              value="true"
              @change="changeDraw"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { forceManyBodyReuse } from 'd3-force-reuse'
import { mapGetters } from 'vuex'

export default {
  props: ['data', 'id', 'controls', 'h', 'w', 'zoom'],
  emits: ['selected'],
  data: () => ({
    selected: null,
    activeElement: null,
    offCanvas: null,
    simulation: null,
    height: null,
    width: null,
    forceProperties: {
      center: {
        x: 0.5,
        y: 0.5,
      },
      charge: {
        enabled: true,
        strength: -200,
        distanceMin: 1,
        distanceMax: 2000,
      },
      collide: {
        enabled: true,
        strength: 0.7,
        iterations: 1,
        radius: 5,
      },
      forceX: {
        enabled: false,
        strength: 0.1,
        x: 0.5,
      },
      forceY: {
        enabled: false,
        strength: 0.1,
        y: 0.5,
      },
      link: {
        enabled: true,
        distance: 30,
        iterations: 1,
      },
    },
    texts: true,
    distance: 100,
    iterations: 1,
    started: false,
    finished: false,
  }),
  computed: {
    ...mapGetters(['isOpened']),
  },
  watch: {
    isOpened: function () {
      this.updateSize()
    },
  },
  async mounted() {
    this.draw()
  },
  methods: {
    changeDraw() {
      this.forceProperties.link.distance = this.distance
      this.forceProperties.link.iterations = this.iterations
      this.updateAll()
    },
    draw() {
      let h
      if (this.h) {
        h = this.h
      } else {
        h = document.getElementById(this.id).getBoundingClientRect().height - 220
      }

      if (this.w) {
        document.getElementById(this.id).style = 'width: ' + this.w + 'px !important'
      }

      document.getElementById(this.id).style =
        document.getElementById(this.id).style.cssText + 'height: ' + h + 'px !important'

      this.width = document.getElementById(this.id).getBoundingClientRect().width

      this.height = document.getElementById(this.id).getBoundingClientRect().height

      this.svg = d3
        .select('#' + this.id)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .call(
          d3.zoom().on(
            'zoom',
            function (event) {
              if (this.zoom) {
                this.container.attr('transform', event.transform)
              }
            }.bind(this)
          )
        )

      this.container = this.svg.append('g')

      this.simulation = d3.forceSimulation()

      this.initializeDisplay()

      this.initializeSimulation()

      d3.select(window).on(
        'resize',
        function () {
          this.updateSize()
          this.updateForces()
        }.bind(this)
      )
    },

    initializeSimulation() {
      this.simulation.nodes(this.data.nodes)

      this.initializeForces()

      this.simulation.on('tick', this.ticked)

      this.simulation.on('end', this.eneded)
    },

    initializeForces() {
      this.simulation
        .force('link', d3.forceLink())
        .force('charge', forceManyBodyReuse())
        .force('collide', d3.forceCollide())
        .force('center', d3.forceCenter())
        .force('forceX', d3.forceX())
        .force('forceY', d3.forceY())
      this.updateForces()
    },

    updateForces() {
      // get each force by name and update the properties
      this.simulation
        .force('center')
        .x(this.width * this.forceProperties.center.x)
        .y(this.height * this.forceProperties.center.y)

      this.simulation
        .force('charge')
        .strength(
          this.forceProperties.charge.strength * this.forceProperties.charge.enabled
        )
        .distanceMin(this.forceProperties.charge.distanceMin)
        .distanceMax(this.forceProperties.charge.distanceMax)

      this.simulation
        .force('collide')
        .strength(
          this.forceProperties.collide.strength * this.forceProperties.collide.enabled
        )
        .radius(this.forceProperties.collide.radius)
        .iterations(this.forceProperties.collide.iterations)

      // this.simulation.force("forceX")
      // .strength(this.forceProperties.forceX.strength * this.forceProperties.forceX.enabled)
      // .x(this.width * this.forceProperties.forceX.x);

      // this.simulation.force("forceY")
      // .strength(this.forceProperties.forceY.strength * this.forceProperties.forceY.enabled)
      // .y(this.height * this.forceProperties.forceY.y);

      this.simulation
        .force('link')
        .id(function (d) {
          return d.id
        })
        .distance(this.forceProperties.link.distance)
        .iterations(this.forceProperties.link.iterations)
        .links(this.forceProperties.link.enabled ? this.data.links : [])

      this.simulation.alpha(1).restart()
    },

    initializeDisplay() {
      var color = d3.scaleOrdinal(['#c0bb56', '#ef8a62', '#6cc'])

      this.linkElements = this.container
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(this.data.links)
        .enter()
        .append('line')
        .attr('stroke-width', 1)

      this.nodeElements = this.container
        .append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(this.data.nodes)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', function (d) {
          return color(d.group)
        })
        .call(
          d3
            .drag()
            .on('start', this.dragstarted)
            .on('drag', this.dragged)
            .on('end', this.dragended)
        )
        .on(
          'click',
          function (event, value) {
            this.$emit('selected', { event: event, value: value })
          }.bind(this)
        )

      this.textElements = this.container
        .append('g')
        .attr('class', 'texts')
        .selectAll('text')
        .data(this.data.nodes)
        .enter()
        .append('text')
        .text(
          function (node) {
            return node.id
          }.bind(this)
        )
        .attr('font-size', 7)
        .attr('dx', 12)
        .attr('dy', 2)

      this.updateDisplay()
    },

    updateDisplay() {
      if (this.texts) {
        this.textElements.attr('font-size', 7)
      } else {
        this.textElements.attr('font-size', 0)
      }
    },

    eneded() {
      this.finished = true

      this.linkElements
        .attr('x1', function (d) {
          return d.source.x
        })
        .attr('y1', function (d) {
          return d.source.y
        })
        .attr('x2', function (d) {
          return d.target.x
        })
        .attr('y2', function (d) {
          return d.target.y
        })

      this.nodeElements
        .attr('cx', function (d) {
          return d.x
        })
        .attr('cy', function (d) {
          return d.y
        })

      this.textElements
        .attr('x', function (d) {
          return d.x
        })
        .attr('y', function (d) {
          return d.y
        })
    },

    ticked() {
      d3.select(`#` + this.id + `-progress`).style(
        'width',
        Math.abs(this.simulation.alpha() * 100 - 100) + '%'
      )
    },

    updateSize() {
      let h
      if (this.h) {
        h = this.h
      } else {
        h = document.getElementById(this.id).getBoundingClientRect().height
      }

      document.getElementById(this.id).style = 'height: ' + h + 'px !important'

      this.width = document.getElementById(this.id).getBoundingClientRect().width

      this.height = document.getElementById(this.id).getBoundingClientRect().height

      this.svg = d3
        .select('#' + this.id)
        .select('svg')
        .attr('width', this.width)
        .attr('height', this.height)
    },

    dragstarted() {
      // if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
      // d.fx = d.x;
      // d.fy = d.y;
    },

    dragged() {
      // d.fx = d3.event.x;
      // d.fy = d3.event.y;
    },

    dragended() {
      // if (!d3.event.active) this.simulation.alphaTarget(0.0001);
      // d.fx = null;
      // d.fy = null;
    },

    updateAll() {
      this.updateSize()
      this.updateForces()
      this.updateDisplay()
    },
  },
}
</script>
