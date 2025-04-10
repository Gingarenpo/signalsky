<template>
	<MkModal ref="modal" :preferType="'dialog'" @closed="emit('closed')" :manualShowing="manualShowing" @click="emit('closed')">
		<div :class="$style.root">
			<h2>{{ i18n.ts.midi_kakiko }}</h2>
			<MkInput type="text" v-model="value" :placeholder="i18n.ts.midi_kakiko_input" />
			<MkButton primary rounded @click="make">{{ i18n.ts.ok }}</MkButton>
		</div>
	</MkModal>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue';
import MkModal from '../MkModal.vue';
import MkInput from '../MkInput.vue';
import { i18n } from '@/i18n.js';
import MkButton from '../MkButton.vue';
import { misskeyApi } from '@/scripts/misskey-api';
import * as os from '@/os.js';

const emit = defineEmits(['done', 'closed']);

const modal = useTemplateRef("modal");

// カキコ内容
const value = ref('');

const props = defineProps({
	manualShowing: Boolean,
})

async function make() {
	console.log(value);
	// MIDIカキコ
	await misskeyApi('midi_kakiko', {
		mml: value.value
	}).then((data) => {
		// 成功した場合
		emit('done', data);
		emit('closed');
	}).catch((err) => {
		// ミスった場合
		os.alert({
			type: 'error',
			text: err.message,
		});
	})
}
</script>

<style module lang="scss">
.root {
	position: relative;
	margin: auto;
	padding: 32px;
	width: 50vw;
	box-sizing: border-box;
	text-align: center;
	background: var(--MI_THEME-panel);
	border-radius: 16px;
}
</style>