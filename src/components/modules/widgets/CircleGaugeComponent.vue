<template>
  <div class="card">
    <div class="card-body h-100">
      <h5 class="title is-5">
        {{ title }}
      </h5>
      <div id="chart">
        <div
          :id="title.replaceAll(' ', '').toLowerCase()"
          style="width: 100%; height: 250px"
        />
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
import { DatasetComponent, PolarComponent, TooltipComponent } from 'echarts/components'
import { CustomChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  DatasetComponent,
  PolarComponent,
  TooltipComponent,
  CustomChart,
  CanvasRenderer,
])

export default {
  props: ['title', 'count', 'color'],

  mounted() {
    var chartDom = document.getElementById(this.title.replaceAll(' ', '').toLowerCase())
    var myChart = echarts.init(chartDom)
    var option

    var _panelImageURL
    var shadowColor

    if (this.count >= 66) {
      _panelImageURL = '/assets/reports/custom-gauge-high.png'
      shadowColor = '#ef4d56'
    } else if (this.count >= 33) {
      _panelImageURL = '/assets/reports/custom-gauge-medium.png'
      shadowColor = '#ff9f43'
    } else if (this.count >= 5) {
      _panelImageURL = '/assets/reports/custom-gauge-low.png'
      shadowColor = '#41cbd8'
    } else if (this.count >= 0) {
      _panelImageURL = '/assets/reports/custom-gauge-good.png'
      shadowColor = '#4ebf00'
    }

    window.addEventListener('resize', function () {
      myChart.resize()
    })

    var _animationDuration = 1000
    var _animationDurationUpdate = 1000
    var _animationEasingUpdate = 'quarticInOut'
    var _valOnRadianMax = 200
    var _outerRadius = 100 // Adjust the outer radius
    var _innerRadius = 85 // Adjust the inner radius
    var _pointerInnerRadius = 20 // Adjust the pointer inner radius
    var _insidePanelRadius = 70 // Adjust the inside panel radius
    function renderItem(params, api) {
      var valOnRadian = api.value(1)
      var coords = api.coord([api.value(0), valOnRadian])
      var polarEndRadian = coords[3]
      var imageStyle = {
        image: _panelImageURL,
        x: params.coordSys.cx - _outerRadius,
        y: params.coordSys.cy - _outerRadius,
        width: _outerRadius * 2,
        height: _outerRadius * 2,
      }
      return {
        type: 'group',
        children: [
          {
            type: 'image',
            style: imageStyle,
            clipPath: {
              type: 'sector',
              shape: {
                cx: params.coordSys.cx,
                cy: params.coordSys.cy,
                r: _outerRadius,
                r0: _innerRadius,
                startAngle: 0,
                endAngle: -polarEndRadian,
                transition: 'endAngle',
                enterFrom: { endAngle: 0 },
              },
            },
          },
          {
            type: 'image',
            style: imageStyle,
            clipPath: {
              type: 'polygon',
              shape: {
                points: makePionterPoints(params, polarEndRadian),
              },
              extra: {
                polarEndRadian: polarEndRadian,
                transition: 'polarEndRadian',
                enterFrom: { polarEndRadian: 0 },
              },
              during: function (apiDuring) {
                apiDuring.setShape(
                  'points',
                  makePionterPoints(params, apiDuring.getExtra('polarEndRadian'))
                )
              },
            },
          },
          {
            type: 'circle',
            shape: {
              cx: params.coordSys.cx,
              cy: params.coordSys.cy,
              r: _insidePanelRadius,
            },
            style: {
              fill: '#fff',
              shadowBlur: 15,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: shadowColor,
            },
          },
          {
            type: 'text',
            extra: {
              valOnRadian: valOnRadian,
              transition: 'valOnRadian',
              enterFrom: { valOnRadian: 0 },
            },
            style: {
              text: makeText(valOnRadian),
              fontSize: 22,
              fontWeight: 700,
              x: params.coordSys.cx,
              y: params.coordSys.cy,
              fill: 'black',
              align: 'center',
              verticalAlign: 'middle',
              enterFrom: { opacity: 0 },
            },
            during: function (apiDuring) {
              apiDuring.setStyle('text', makeText(apiDuring.getExtra('valOnRadian')))
            },
          },
        ],
      }
    }
    function convertToPolarPoint(renderItemParams, radius, radian) {
      return [
        Math.cos(radian) * radius + renderItemParams.coordSys.cx,
        -Math.sin(radian) * radius + renderItemParams.coordSys.cy,
      ]
    }
    function makePionterPoints(renderItemParams, polarEndRadian) {
      return [
        convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian),
        convertToPolarPoint(
          renderItemParams,
          _outerRadius,
          polarEndRadian + Math.PI * 0.03
        ),
        convertToPolarPoint(renderItemParams, _pointerInnerRadius, polarEndRadian),
      ]
    }
    function makeText(valOnRadian) {
      return ((valOnRadian / _valOnRadianMax) * 100).toFixed(2) + '%'
    }
    option = {
      animationEasing: _animationEasingUpdate,
      animationDuration: _animationDuration,
      animationDurationUpdate: _animationDurationUpdate,
      animationEasingUpdate: _animationEasingUpdate,
      dataset: {
        source: [[0, this.count * 2]],
      },
      angleAxis: {
        type: 'value',
        startAngle: 0,
        show: false,
        min: 0,
        max: _valOnRadianMax,
      },
      radiusAxis: {
        type: 'value',
        show: false,
      },
      polar: {},
      series: [
        {
          type: 'custom',
          coordinateSystem: 'polar',
          renderItem: renderItem,
        },
      ],
    }

    option && myChart.setOption(option)
  },
}
</script>
