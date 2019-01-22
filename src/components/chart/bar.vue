<template>
	<div class="bar">
		<div class="barChart" :style="{ height: height + 'px' }" :id="elId"></div>
	</div>
</template>

<script>
	// 引入基本模板
	let echarts = require('echarts/lib/echarts')
	// 引入折线图组件
	require('echarts/lib/chart/bar')
	// 引入提示框和title组件
	require('echarts/lib/component/tooltip')
	require('echarts/lib/component/title')
	//引入uuid文件
	import uuidv1 from 'uuid/v1'
	export default {
		props: ['options','height'],
		data() {
			return {
				elId: ''
			};
		},
		mounted() {
			this.drawBar()
		},
		created() {
			this.elId = uuidv1()
		},
		methods: {
			drawBar() {
				let myChart = echarts.init(document.getElementById(this.elId));
				if (this.options && typeof this.options === "object") {
					myChart.setOption(this.options, true);
				}
			}
		},
		watch: {
			'options': {
				handler(newVal, oldVal) {
					this.drawBar()
				},
				deep: true
			}
		}
	};
</script>

<style lang="stylus" scoped>

</style>