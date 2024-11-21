<template>
  <div
    v-if="data.links.length && data.nodes.length"
    class="position-relative network-graph"
  >
    <canvas :id="id" class="w-100 vh-100 svg" />
    <div :id="id + `-labels`" class="labels" />
  </div>
  <div
    v-if="!data.links.length || !data.nodes.length"
    class="position-relative network-graph"
  >
    <NoData :meta="{ total: 0 }"></NoData>
  </div>
</template>

<script>
import { Graph } from '@cosmograph/cosmos'
import { mapGetters } from 'vuex'
import { LabelRenderer } from '@interacta/css-labels'
import NoData from '/@src/components/NoData.vue'

export default {
  components: { NoData },
  props: ['data', 'id', 'controls', 'h', 'w', 'zoom'],
  emits: ['selected'],
  data: () => ({
    graph: null,
  }),
  computed: {
    ...mapGetters(['isOpened']),
  },
  watch: {
    isOpened: function () {
      this.graph.restart()
    },
  },
  async mounted() {
    let h
    if (this.h) {
      h = this.h
    } else {
      h = document.getElementById(this.id).getBoundingClientRect().height
    }

    if (document.getElementById(this.id)) {
      if (this.w) {
        document.getElementById(this.id).style = 'width: ' + this.w + 'px !important'
      }

      document.getElementById(this.id).style =
        document.getElementById(this.id).style.cssText +
        'height: ' +
        h +
        'px;line-height: ' +
        h +
        'px'
    }

    if (this.data.links.length && this.data.nodes.length) {
      this.draw()
    }
  },
  methods: {
    draw() {
      const canvas = document.getElementById(this.id)

      const config = {
        backgroundColor: '#313135',
        simulation: {
          gravity: 0,
          linkDistance: 2,
          linkSpring: 0.3,
          repulsion: 0.4,
          center: 1,
          onStart: () => this.start(graph),
          onTick: () => this.update(),
          onEnd: () => this.end(graph),
          decay: 0,
        },
        linkWidth: 1,
        linkArrows: false,
        linkColor: '#5F74C2',
        renderLinks: true,
        nodeSize: 0.5,
        nodeGreyoutOpacity: 0.1,
        nodeColor: function (node) {
          if (node.type === 'domain') {
            return '#c0bb56'
          }
          if (node.type === 'subdomain') {
            return '#6cc'
          }
          if (node.type === 'ip') {
            return '#ef8a62'
          }
        },
        events: {
          onClick: function (event) {
            if (event) {
              this.$emit('selected', event)
            }
          }.bind(this),
          onZoom: () => this.update(),
          onNodeMouseOver: () => null,
          onNodeMouseOut: () => null,
        },
      }

      const graph = new Graph(canvas, config)

      graph.setData(this.data.nodes, this.data.links)

      graph.zoom(20)

      const div = document.querySelector(`#` + this.id + `-labels`)

      this.labelRenderer = new LabelRenderer(div, { pointerEvents: 'none' })

      graph.trackNodePositionsByIds(['google.com'])

      graph.trackNodePositionsByIds(
        this.data.nodes.map(function (item) {
          return item.id
        })
      )

      this.graph = graph
    },
    start() {},
    end(graph) {
      let domainNode = this.data.nodes.filter(function (item) {
        return item.type === 'domain'
      })

      if (domainNode.length) {
        graph.zoomToNodeById(domainNode[0].id, 0, 20)
      } else {
        graph.zoomToNodeByIndex(0, 0, 20)
      }
    },
    update() {
      this.labels = []

      const graph = this.graph

      if (!graph) {
        return
      }

      const trackedNodesPositions = graph.getTrackedNodePositionsMap()

      let index = 0

      trackedNodesPositions.forEach((positions, node) => {
        const screenPosition = graph.spaceToScreenPosition([
          positions?.[0] ?? 0,
          positions?.[1] ?? 0,
        ])

        const radius = graph.spaceToScreenRadius(graph.getNodeRadiusById(node))

        this.labels[index] = {
          id: node,
          text: node,
          x: screenPosition[0],
          y: screenPosition[1] - (radius + 2),
          opacity: 1,
        }

        index += 1
      })

      this.labelRenderer.setLabels(this.labels)

      this.labelRenderer.draw(true)
    },
  },
}
</script>

<style lang="scss" scoped>
.search-results-body {
  height: 100%;
  display: flex;
}
</style>