<template>
  <div v-if="data">
    <div ref="svgContainer">
      <svg
        ref="svgImage"
        width="100%"
        height="700"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Organization
          :x="organizationX"
          y="0"
          :workspace="workspace"
          :score="score"
          :issues="issues"
        />

        <g v-for="line in lines" :key="line.key">
          <polyline
            :points="line.points.map((p) => `${p.x},${p.y}`).join(' ')"
            fill="none"
            stroke="#b7c4ff"
          />
        </g>

        <g v-if="data.length">
          <g v-for="(vendor, vendorIndex) in data" :key="vendor.id">
            <Vendor :x="getVendorX(vendorIndex)" :vendor="vendor" y="300" />

            <g v-for="(asset, assetIndex) in vendor.assets" :key="assetIndex">
              <Asset
                :x="getAssetX(vendorIndex, assetIndex)"
                :vendor="vendor"
                :asset="asset"
                y="425"
                class="asset"
              ></Asset>

              <g v-for="(issue, issueIndex) in asset.issues" :key="issue.id">
                <Issue
                  :vendor="vendor"
                  :asset="asset"
                  :issue="issue"
                  :index="issueIndex"
                  :x="getIssueX(vendorIndex, assetIndex, issueIndex)"
                  :y="getIssueY(assetIndex, issueIndex)"
                  class="issue"
                ></Issue>
              </g>
            </g>
          </g>
        </g>
        <g v-else>
          <NoData :x="organizationX + 20" y="250" :meta="meta" />
        </g>
      </svg>
    </div>
  </div>
  <div v-else class="app-init-wrapper">
    <VLoader :active="true">
      <div />
    </VLoader>
  </div>
</template>

<script>
import Organization from '/@src/components/vendors/supplychain/components/Organization.vue'
import Asset from '/@src/components/vendors/supplychain/components/Asset.vue'
import Vendor from '/@src/components/vendors/supplychain/components/Vendor.vue'
import Issue from '/@src/components/vendors/supplychain/components/Issue.vue'
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import NoData from '/@src/components/vendors/supplychain/components/NoData.vue'

export default {
  components: { NoData, VLoader, Vendor, Asset, Issue, Organization },
  data() {
    return {
      data: null,
      meta: null,
      score: null,
      issues: null,
    }
  },
  computed: {
    ...mapGetters(['workspace']),
    organizationX() {
      if (!this.x) return 0

      const lastItem = this.x[this.x.length - 1]

      if (!lastItem) {
        return 0
      }

      return lastItem.end / 2 - 120
    },
    x() {
      const lines = []

      if (!this.data) return lines

      this.data.forEach((vendor, vendorIndex) => {
        const width = 250

        const assetsCount = vendor.assets.length || 1

        let end = width * assetsCount

        if (vendorIndex === 0) {
          lines[vendorIndex] = {
            start: 0,
            end: end,
            assets: assetsCount,
            middle: end / 2 - 125,
          }
        } else {
          const prev = lines[vendorIndex - 1]

          lines[vendorIndex] = {
            start: prev.end,
            end: prev.end + end,
            assets: assetsCount,
            middle: prev.end + (prev.end + end - prev.end) / 2 - 125,
          }
        }
      })

      return lines
    },
    lines() {
      const lines = []

      if (!this.data) return lines

      const organizationX = this.organizationX + 120
      const organizationY = 204

      this.data.forEach((vendor, vendorIndex) => {
        const vendorX = this.getVendorX(vendorIndex) + 100
        const vendorY = 300

        // Line from Organization to Vendor with intermediate point
        lines.push({
          key: `org-to-vendor-${vendor.id}`,
          points: [
            { x: organizationX, y: organizationY },
            { x: organizationX, y: vendorY - 42 },
            { x: vendorX, y: vendorY - 42 },
            { x: vendorX, y: vendorY },
          ],
        })

        vendor.assets.forEach((asset, assetIndex) => {
          const assetX = this.getAssetX(vendorIndex, assetIndex) + 100
          const assetY = 425

          // Line from Vendor to Asset with intermediate point and offset
          lines.push({
            key: `vendor-to-asset-${vendor.id}-${assetIndex}`,
            points: [
              { x: vendorX, y: vendorY + 59 },
              { x: vendorX, y: vendorY + 59 + 35 },
              { x: assetX, y: vendorY + 59 + 35 },
              { x: assetX, y: assetY },
            ],
          })

          asset.issues.forEach((issue, issueIndex) => {
            const issueX = this.getIssueX(vendorIndex, assetIndex, issueIndex) + 100
            const issueY = this.getIssueY(assetIndex, issueIndex)

            // Line from Asset to Issue with intermediate point
            lines.push({
              key: `asset-to-issue-${vendor.id}-${assetIndex}-${issue.id}`,
              points: [
                { x: assetX, y: assetY + 59 },
                { x: assetX, y: issueY },
                { x: issueX, y: issueY },
              ],
            })
          })
        })
      })

      return lines
    },
  },
  async mounted() {
    await this.getData()

    const svgImage = this.$refs.svgImage
    const svgContainer = this.$refs.svgContainer

    // Calculate the bounding box of the SVG content
    const svgBBox = svgImage.getBBox()
    const svgContentWidth = svgBBox.width
    const svgContentHeight = svgBBox.height

    // Calculate the dimensions of the SVG container
    const svgContainerWidth = svgContainer.clientWidth
    const svgContainerHeight = svgContainer.clientHeight

    // Calculate the initial viewBox values to center the SVG content
    const viewBoxX = svgBBox.x - (svgContainerWidth - svgContentWidth) / 2
    const viewBoxY = svgBBox.y - (svgContainerHeight - svgContentHeight) / 2
    const viewBoxWidth = svgContainerWidth
    const viewBoxHeight = svgContainerHeight

    // Set the initial viewBox to center the SVG content
    svgImage.setAttribute(
      'viewBox',
      `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`
    )

    // Define variables for panning and zooming
    let viewBox = { x: viewBoxX, y: viewBoxY, w: viewBoxWidth, h: viewBoxHeight }
    const svgSize = { w: svgContainerWidth, h: svgContainerHeight }
    let isPanning = false
    let startPoint = { x: 0, y: 0 }
    let endPoint = { x: 0, y: 0 }
    let scale = 1

    svgContainer.onmousewheel = (e) => {
      e.preventDefault()
      const w = viewBox.w
      const h = viewBox.h
      const mx = e.offsetX //mouse x
      const my = e.offsetY
      const dw = w * Math.sign(e.deltaY) * 0.05
      const dh = h * Math.sign(e.deltaY) * 0.05
      const dx = (dw * mx) / svgSize.w
      const dy = (dh * my) / svgSize.h
      viewBox = {
        x: viewBox.x + dx,
        y: viewBox.y + dy,
        w: viewBox.w - dw,
        h: viewBox.h - dh,
      }
      scale = svgSize.w / viewBox.w
      svgImage.setAttribute(
        'viewBox',
        `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`
      )
    }

    svgContainer.onmousedown = function (e) {
      isPanning = true
      startPoint = { x: e.x, y: e.y }
    }

    svgContainer.onmousemove = function (e) {
      if (isPanning) {
        endPoint = { x: e.x, y: e.y }
        const dx = (startPoint.x - endPoint.x) / scale
        const dy = (startPoint.y - endPoint.y) / scale
        const movedViewBox = {
          x: viewBox.x + dx,
          y: viewBox.y + dy,
          w: viewBox.w,
          h: viewBox.h,
        }
        svgImage.setAttribute(
          'viewBox',
          `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`
        )
      }
    }

    svgContainer.onmouseup = function (e) {
      if (isPanning) {
        endPoint = { x: e.x, y: e.y }
        const dx = (startPoint.x - endPoint.x) / scale
        const dy = (startPoint.y - endPoint.y) / scale
        viewBox = { x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h }
        svgImage.setAttribute(
          'viewBox',
          `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`
        )
        isPanning = false
      }
    }

    svgContainer.onmouseleave = function (e) {
      isPanning = false
    }
  },
  methods: {
    getData() {
      return Promise.all([
        this.getSupplyChain(),
        this.getExposureScore(),
        this.getIssues(),
      ])
        .then(() => {})
        .finally(() => {})
    },
    getSupplyChain() {
      return axios
        .get('/supply-chain/' + this.workspace.id)
        .then((res) => {
          this.data = res.data.data
          this.meta = res.data.meta
        })
        .catch(() => {})
    },
    getExposureScore() {
      return axios
        .get('/widget/vendor-assets-exposure', {
          params: {
            workspace_collection_id: this.workspace.id,
          },
        })
        .then((res) => {
          this.score = res.data.data.custom.grade
        })
        .catch(() => {})
    },
    getIssues() {
      return axios
        .get('/widget/issues-summary', {
          params: {
            workspace_collection_id: this.workspace.id,
          },
        })
        .then((res) => {
          this.issues = res.data.data.opened
        })
        .catch(() => {})
    },
    getVendorX(vendorIndex) {
      return this.x[vendorIndex].middle
    },
    getAssetX(vendorIndex, assetIndex) {
      return this.x[vendorIndex].start + assetIndex * 250
    },
    getIssueX(vendorIndex, assetIndex, issueIndex) {
      return this.x[vendorIndex].start + assetIndex * 250
    },
    getIssueY(assetIndex, issueIndex) {
      return 550 + issueIndex * 100
    },
  },
}
</script>

<style>
.organization {
  font-size: 20px;
  font-weight: bold;
  text-anchor: middle;
}

.vendor {
  font-size: 16px;
  font-weight: bold;
  text-anchor: middle;
}

.asset {
  font-size: 14px;
  text-anchor: middle;
}

.issue {
  font-size: 12px;
  text-anchor: middle;
}
</style>