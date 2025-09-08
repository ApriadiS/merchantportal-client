<script lang="ts">
	export let customClass: string = '';
</script>

<div class={`bg-white rounded-xl shadow-2xl p-6 sm:p-8 ${customClass}`}>
	<slot />
</div>
