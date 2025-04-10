// ts-nocheck
import MkSpaceJoin from './MkSpaceJoin.vue';
import { computed } from '@vue/runtime-core';

// 4人くらいなんか参加しているとき
export const JOINED = {
	render(args) {
		return {
			components: { MkSpaceJoin },
			setup() {
				return { args };
			},
			computed: {
				props() {
					return {
						...this.args,
					};
				},
			},
			template: '<MkSpaceJoin v-bind="props" />',
		}
	},
	args: {
		test: "あああああ"
	},
	parameters: {
		layout: "centered",
	}
} satisfies StoryObj<typeof MkSpaceJoin>;