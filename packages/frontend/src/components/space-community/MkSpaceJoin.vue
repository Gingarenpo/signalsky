<template>
	<MkModal ref="modal" :preferType="'dialog'" :zPriority="'low'" @click="done(true)" @closed="emit('closed')" @esc="cancel()">
		<div :class="$style.root">
			<h2>{{ i18n.ts.spaceCommunity.joinTitle }}</h2>
		</div>
	</MkModal>
</template>

<script lang="ts" setup>
	import { ref, shallowRef, computed } from 'vue';
	import { i18n } from '@/i18n.js';
	import MkModal from '@/components/MkModal.vue';

	const emit = defineEmits<{
		(ev: 'done'): void;
		(ev: 'closed'): void;
	}>();

	// モーダルダイアログの情報の浅い参照
	const modal = ref<InstanceType<typeof MkModal>>();

	function done() {modal.value?.close();};
</script>

<style lang="scss" module>
.root {
	position: relative;
	margin: auto;
	padding: 32px;
	min-width: 50vw;
	max-width: 30vw;
	box-sizing: border-box;
	text-align: center;
	background: var(--MI_THEME-panel);
	border-radius: 16px;
}

.icon {
	font-size: 24px;

	& + .title {
		margin-top: 8px;
	}
}

.iconInner {
	display: block;
	margin: 0 auto;
}

.type_info {
	color: #55c4dd;
}

.type_success {
	color: var(--MI_THEME-success);
}

.type_error {
	color: var(--MI_THEME-error);
}

.type_warning {
	color: var(--MI_THEME-warn);
}

.title {
	margin: 0 0 8px 0;
	font-weight: bold;
	font-size: 1.1em;

	& + .text {
		margin-top: 8px;
	}
}

.text {
	margin: 16px 0 0 0;
}

.buttons {
	margin-top: 16px;
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	justify-content: center;
}
</style>