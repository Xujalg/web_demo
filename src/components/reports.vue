<template>
  <div>
    <div id="main" ref="main" style="width: 800px;height:500px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  mounted () {
    var ec = echarts.init(this.$refs.main)
    var option = {
      title: {
        text: '用户来源'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {},
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [],
      yAxis: [],
      series: []
    }

    ec.setOption(option)
    this.http({
      url: '/reports/type/1',
      method: 'get'
    }).then(back => {
      back.data.data.xAxis[0].boundaryGap = false
      ec.setOption(back.data.data)
      console.log(back.data.data)
    })
  }
}
</script>

<style>
</style>
