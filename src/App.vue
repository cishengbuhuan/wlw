<template>
	<div id="app">
		<dream-header v-if="$route.name != 'login' && $route.name != 'forget'"></dream-header>
		<dream-slide v-if="$route.name != 'login' && $route.name != 'forget'"></dream-slide>
		<router-view/>
	</div>
</template>

<script>
	import dreamHeader from './components/dreamHeader/dreamHeader.vue';
	import dreamSlide from './components/dreamSlide/dreamSlide.vue';
	export default {
		components: {
			dreamHeader,
			dreamSlide
		},
		name: 'App'
	}
</script>

<style>
	@import './assets/baseCss.css';
</style>