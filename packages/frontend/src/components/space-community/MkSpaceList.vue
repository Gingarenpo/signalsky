<template>
	<div :class="$style.root">
		<div :class="$style.flex">
			<div style="width: auto;">
				<MkAvatar :user="space.host" :class="$style.host_avatar" />
				<p :class="$style.host_name">{{ i18n.t("spaceCommunity.hostDescription", { name: space.host.name }) }}</p>
			</div>
			<div style="width: 100%;">
				<h3>{{ space.name }}</h3>
				<p>{{ space.description }}</p>
			</div>
		</div>
		<hr>
		<div :class="$style.flex">
			<div style="width: auto;">
				<div :class="$style.flex"><MkAvatar v-for="member in space.member" :key="member.id" :user="member" :class="$style.member_avatar" /></div>
				<p>{{ i18n.t("spaceCommunity.memberDescription", { count: space.member.length }) }}</p>
			</div>
			<MkButton :class="$style.button" :primary="true" :href="space.uri">{{ i18n.ts.spaceCommunity.joinTitle }}</MkButton>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import MkAvatar from '../global/MkAvatar.vue';
	import MkButton from '../MkButton.vue';
	import { i18n } from '@/i18n.js';

	//TODO:レスポンス確定次第変える
	const props = withDefaults(defineProps<{
		space: {
			id: string;
			name: string;
			description: string;
			host: any;
			uri: string;
			members: any[];
			startTime: string;
			endTime: string;
		}
	}>(), {
		space: null,
	});
</script>

<style lang="scss" module>
.root {
	border: 1px solid var(--MI_THEME-divider);
	background-color: var(--MI_THEME-panel);
	border-radius: var(--MI-radius);
}

.flex {
	display: flex;
	justify-content: space-between;
	padding: 0.5rem;
}

.flex > div:not(.flex) {
	width: 100%;
}

.flex > div > p {
	margin: 0;
}

.flex > div > h3 {
	margin: 0.5rem;
}

.host_avatar {
	width: 64px;
	height: 64px;
	margin: auto;
}

.member_avatar {
	width: 32px;
	height: 32px;
	flex-grow: none;
}

.host_name {
	font-size: 0.75rem;
}

.button {
	margin: 0.5rem;
	flex-grow: 0;
}
</style>