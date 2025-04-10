<!--
SPDX-FileCopyrightText: Signalskey Project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<Transition :name="defaultStore.state.animation ? '_transition_zoom' : ''" appear>
	<div :class="$style.root">
		<img :src="DEFAULT_SPACE_IMAGE_URL" :class="$style.img"/>
		<p :class="$style.description">{{ i18n.ts.spaceCommunity.description }}</p>
		<hr>
		<div :class="$style.flex">
			<MkButton :primary="true" @click="openSpaceJoinDialog">{{ i18n.ts.spaceCommunity.makeSpace }}</MkButton>
			<p>{{ i18n.ts.spaceCommunity.makeSpaceDescription }}</p>
		</div>
		<hr>
		<div :class="$style.space_list">
			<h2>{{ i18n.ts.spaceCommunity.openSpaces }}</h2>
			<p v-if="!loading">{{ i18n.ts.spaceCommunity.loadingSpaces }}</p>
			<p v-else-if="openSpaces.length > 0">{{ i18n.ts.spaceCommunity.openSpacesDescription }}</p>
			<p v-else>{{ i18n.ts.spaceCommunity.noOpenSpaces }}</p>

			<MkSpaceList v-for="space in openSpaces" :key="space.id" v-if="openSpaces.length > 0" :space="space">
			</MkSpaceList>
			<MkLoading v-if="!loading" />
		</div>
		
	</div>
</Transition>
</template>

<script lang="ts" setup>
import { ref, computed, useTemplateRef, onMounted } from 'vue';
import * as Misskey from 'misskey-js';
import MkLink from '@/components/MkLink.vue';
import MkSpaceJoin from '@/components/space-community/MkSpaceJoin.vue';
import MkButton from '@/components/MkButton.vue';
import MkDialog from '@/components/MkDialog.vue';
import MkSpaceList from '@/components/space-community/MkSpaceList.vue';
import { version } from '@@/js/config.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { unisonReload } from '@/scripts/unison-reload.js';
import { i18n } from '@/i18n.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import { miLocalStorage } from '@/local-storage.js';
import { defaultStore } from '@/store.js';
import { serverErrorImageUrl } from '@/instance.js';
import { DEFAULT_SPACE_IMAGE_URL } from '@@/js/const.js';
import { popup } from '@/os.js';

const props = withDefaults(defineProps<{
	error?: Error;
}>(), {
});

// スペース参加ダイアログを開いたかどうかチェックするために参照
const spaceJoin = useTemplateRef("spaceJoin");
// 開催スペースの読み込みフラグ
const loading = ref(false);

// スペースに参加するボタンが押されたら、ダイアログを開く
function openSpaceJoinDialog() {

	return new Promise(resolve => {
		const { dispose } = popup(MkSpaceJoin, props, {
			done: () => {
				resolve();
			},
			closed: () => dispose(),
		});
		console.log("A");
	});
}

const loaded = ref(false);
const serverIsDead = ref(false);
const meta = ref<Misskey.entities.MetaResponse | null>(null);
// スペースの開催リストを保持する
const openSpaces = ref([]);

function reload() {
	unisonReload();
}

const headerActions = computed(() => []);

const headerTabs = computed(() => []);

definePageMetadata(() => ({
	title: i18n.ts.spaceCommunity.name,
	icon: 'ti ti-alert-triangle',
}));

// 読み込み用
function loadSpaces() {
	// 現在ダミーレスポンスを返す
	return new Promise(resolve => {
		setTimeout(() => {
			loading.value = true;
			resolve({
				spaces: [
					{
						name: "ダミースペース",
						description: "これはスペースの説明文ですよ",
						host: {"id":"a5op2s62g8rk0003","name":"テストユーザー001","username":"signalskey","host":null,"avatarUrl":"http://192.168.40.16:3000/proxy/avatar.webp?url=http%3A%2F%2F192.168.40.16%3A3000%2Ffiles%2Ffdd7623a-e72b-4116-9f7d-ef6649cfe211&avatar=1","avatarBlurhash":"eFEol7s-00NIIU0PR+}moJjG3CkCrDs9$%~Vn%RPofIV8woLt,R*x]","avatarDecorations":[],"isBot":false,"isCat":false,"emojis":{},"onlineStatus":"online","badgeRoles":[],"url":null,"uri":null,"movedTo":null,"alsoKnownAs":null,"createdAt":"2025-03-23T04:21:01.082Z","updatedAt":null,"lastFetchedAt":null,"bannerUrl":null,"bannerBlurhash":null,"isLocked":false,"isSilenced":false,"isSuspended":false,"description":null,"location":null,"birthday":null,"lang":null,"fields":[],"verifiedLinks":[],"followersCount":0,"followingCount":0,"notesCount":0,"pinnedNoteIds":[],"pinnedNotes":[],"pinnedPageId":null,"pinnedPage":null,"publicReactions":true,"followersVisibility":"public","followingVisibility":"public","roles":[],"memo":null,"moderationNote":"","twoFactorEnabled":false,"usePasswordLessLogin":false,"securityKeys":false,"avatarId":"a5p82ifdj9ud0001","bannerId":null,"followedMessage":null,"isModerator":true,"isAdmin":true,"injectFeaturedNote":true,"receiveAnnouncementEmail":true,"alwaysMarkNsfw":false,"autoSensitive":false,"carefulBot":false,"autoAcceptFollowed":true,"noCrawle":false,"preventAiLearning":true,"isExplorable":true,"isDeleted":false,"twoFactorBackupCodesStock":"none","hideOnlineStatus":false,"hasUnreadSpecifiedNotes":false,"hasUnreadMentions":false,"hasUnreadAnnouncement":false,"unreadAnnouncements":[],"hasUnreadAntenna":false,"hasUnreadChannel":false,"hasUnreadNotification":false,"hasPendingReceivedFollowRequest":false,"unreadNotificationsCount":0,"mutedWords":[],"hardMutedWords":[],"mutedInstances":[],"mutingNotificationTypes":[],"notificationRecieveConfig":{},"emailNotificationTypes":["follow","receiveFollowRequest"],"achievements":[{"name":"client30min","unlockedAt":1742724975848},{"name":"client60min","unlockedAt":1742726775794},{"name":"profileFilled","unlockedAt":1742734506591}],"loggedInDays":1,"policies":{"gtlAvailable":true,"ltlAvailable":true,"canPublicNote":true,"mentionLimit":20,"canInvite":false,"inviteLimit":0,"inviteLimitCycle":10080,"inviteExpirationTime":0,"canManageCustomEmojis":false,"canManageAvatarDecorations":false,"canSearchNotes":false,"canUseTranslator":true,"canHideAds":false,"driveCapacityMb":100,"alwaysMarkNsfw":false,"canUpdateBioMedia":true,"pinLimit":5,"antennaLimit":5,"wordMuteLimit":200,"webhookLimit":3,"clipLimit":10,"noteEachClipsLimit":200,"userListLimit":10,"userEachUserListsLimit":50,"rateLimitFactor":1,"avatarDecorationLimit":1,"canImportAntennas":true,"canImportBlocking":true,"canImportFollowing":true,"canImportMuting":true,"canImportUserLists":true},"email":null,"emailVerified":false,"securityKeysList":[],"token":"g7i1K5P4Ej9RWwGa"},
						uri: "https://signal-st.com/spaces/testtesttest",
						member: [
							{"id":"a5op2s62g8rk0003","name":"テストユーザー001","username":"signalskey","host":null,"avatarUrl":"http://192.168.40.16:3000/proxy/avatar.webp?url=http%3A%2F%2F192.168.40.16%3A3000%2Ffiles%2Ffdd7623a-e72b-4116-9f7d-ef6649cfe211&avatar=1","avatarBlurhash":"eFEol7s-00NIIU0PR+}moJjG3CkCrDs9$%~Vn%RPofIV8woLt,R*x]","avatarDecorations":[],"isBot":false,"isCat":false,"emojis":{},"onlineStatus":"online","badgeRoles":[],"url":null,"uri":null,"movedTo":null,"alsoKnownAs":null,"createdAt":"2025-03-23T04:21:01.082Z","updatedAt":null,"lastFetchedAt":null,"bannerUrl":null,"bannerBlurhash":null,"isLocked":false,"isSilenced":false,"isSuspended":false,"description":null,"location":null,"birthday":null,"lang":null,"fields":[],"verifiedLinks":[],"followersCount":0,"followingCount":0,"notesCount":0,"pinnedNoteIds":[],"pinnedNotes":[],"pinnedPageId":null,"pinnedPage":null,"publicReactions":true,"followersVisibility":"public","followingVisibility":"public","roles":[],"memo":null,"moderationNote":"","twoFactorEnabled":false,"usePasswordLessLogin":false,"securityKeys":false,"avatarId":"a5p82ifdj9ud0001","bannerId":null,"followedMessage":null,"isModerator":true,"isAdmin":true,"injectFeaturedNote":true,"receiveAnnouncementEmail":true,"alwaysMarkNsfw":false,"autoSensitive":false,"carefulBot":false,"autoAcceptFollowed":true,"noCrawle":false,"preventAiLearning":true,"isExplorable":true,"isDeleted":false,"twoFactorBackupCodesStock":"none","hideOnlineStatus":false,"hasUnreadSpecifiedNotes":false,"hasUnreadMentions":false,"hasUnreadAnnouncement":false,"unreadAnnouncements":[],"hasUnreadAntenna":false,"hasUnreadChannel":false,"hasUnreadNotification":false,"hasPendingReceivedFollowRequest":false,"unreadNotificationsCount":0,"mutedWords":[],"hardMutedWords":[],"mutedInstances":[],"mutingNotificationTypes":[],"notificationRecieveConfig":{},"emailNotificationTypes":["follow","receiveFollowRequest"],"achievements":[{"name":"client30min","unlockedAt":1742724975848},{"name":"client60min","unlockedAt":1742726775794},{"name":"profileFilled","unlockedAt":1742734506591}],"loggedInDays":1,"policies":{"gtlAvailable":true,"ltlAvailable":true,"canPublicNote":true,"mentionLimit":20,"canInvite":false,"inviteLimit":0,"inviteLimitCycle":10080,"inviteExpirationTime":0,"canManageCustomEmojis":false,"canManageAvatarDecorations":false,"canSearchNotes":false,"canUseTranslator":true,"canHideAds":false,"driveCapacityMb":100,"alwaysMarkNsfw":false,"canUpdateBioMedia":true,"pinLimit":5,"antennaLimit":5,"wordMuteLimit":200,"webhookLimit":3,"clipLimit":10,"noteEachClipsLimit":200,"userListLimit":10,"userEachUserListsLimit":50,"rateLimitFactor":1,"avatarDecorationLimit":1,"canImportAntennas":true,"canImportBlocking":true,"canImportFollowing":true,"canImportMuting":true,"canImportUserLists":true},"email":null,"emailVerified":false,"securityKeysList":[],"token":"g7i1K5P4Ej9RWwGa"},
							{"id":"a5op2s62g8rk0003","name":"テストユーザー001","username":"signalskey","host":null,"avatarUrl":"http://192.168.40.16:3000/proxy/avatar.webp?url=http%3A%2F%2F192.168.40.16%3A3000%2Ffiles%2Ffdd7623a-e72b-4116-9f7d-ef6649cfe211&avatar=1","avatarBlurhash":"eFEol7s-00NIIU0PR+}moJjG3CkCrDs9$%~Vn%RPofIV8woLt,R*x]","avatarDecorations":[],"isBot":false,"isCat":false,"emojis":{},"onlineStatus":"online","badgeRoles":[],"url":null,"uri":null,"movedTo":null,"alsoKnownAs":null,"createdAt":"2025-03-23T04:21:01.082Z","updatedAt":null,"lastFetchedAt":null,"bannerUrl":null,"bannerBlurhash":null,"isLocked":false,"isSilenced":false,"isSuspended":false,"description":null,"location":null,"birthday":null,"lang":null,"fields":[],"verifiedLinks":[],"followersCount":0,"followingCount":0,"notesCount":0,"pinnedNoteIds":[],"pinnedNotes":[],"pinnedPageId":null,"pinnedPage":null,"publicReactions":true,"followersVisibility":"public","followingVisibility":"public","roles":[],"memo":null,"moderationNote":"","twoFactorEnabled":false,"usePasswordLessLogin":false,"securityKeys":false,"avatarId":"a5p82ifdj9ud0001","bannerId":null,"followedMessage":null,"isModerator":true,"isAdmin":true,"injectFeaturedNote":true,"receiveAnnouncementEmail":true,"alwaysMarkNsfw":false,"autoSensitive":false,"carefulBot":false,"autoAcceptFollowed":true,"noCrawle":false,"preventAiLearning":true,"isExplorable":true,"isDeleted":false,"twoFactorBackupCodesStock":"none","hideOnlineStatus":false,"hasUnreadSpecifiedNotes":false,"hasUnreadMentions":false,"hasUnreadAnnouncement":false,"unreadAnnouncements":[],"hasUnreadAntenna":false,"hasUnreadChannel":false,"hasUnreadNotification":false,"hasPendingReceivedFollowRequest":false,"unreadNotificationsCount":0,"mutedWords":[],"hardMutedWords":[],"mutedInstances":[],"mutingNotificationTypes":[],"notificationRecieveConfig":{},"emailNotificationTypes":["follow","receiveFollowRequest"],"achievements":[{"name":"client30min","unlockedAt":1742724975848},{"name":"client60min","unlockedAt":1742726775794},{"name":"profileFilled","unlockedAt":1742734506591}],"loggedInDays":1,"policies":{"gtlAvailable":true,"ltlAvailable":true,"canPublicNote":true,"mentionLimit":20,"canInvite":false,"inviteLimit":0,"inviteLimitCycle":10080,"inviteExpirationTime":0,"canManageCustomEmojis":false,"canManageAvatarDecorations":false,"canSearchNotes":false,"canUseTranslator":true,"canHideAds":false,"driveCapacityMb":100,"alwaysMarkNsfw":false,"canUpdateBioMedia":true,"pinLimit":5,"antennaLimit":5,"wordMuteLimit":200,"webhookLimit":3,"clipLimit":10,"noteEachClipsLimit":200,"userListLimit":10,"userEachUserListsLimit":50,"rateLimitFactor":1,"avatarDecorationLimit":1,"canImportAntennas":true,"canImportBlocking":true,"canImportFollowing":true,"canImportMuting":true,"canImportUserLists":true},"email":null,"emailVerified":false,"securityKeysList":[],"token":"g7i1K5P4Ej9RWwGa"},
							{"id":"a5op2s62g8rk0003","name":"テストユーザー001","username":"signalskey","host":null,"avatarUrl":"http://192.168.40.16:3000/proxy/avatar.webp?url=http%3A%2F%2F192.168.40.16%3A3000%2Ffiles%2Ffdd7623a-e72b-4116-9f7d-ef6649cfe211&avatar=1","avatarBlurhash":"eFEol7s-00NIIU0PR+}moJjG3CkCrDs9$%~Vn%RPofIV8woLt,R*x]","avatarDecorations":[],"isBot":false,"isCat":false,"emojis":{},"onlineStatus":"online","badgeRoles":[],"url":null,"uri":null,"movedTo":null,"alsoKnownAs":null,"createdAt":"2025-03-23T04:21:01.082Z","updatedAt":null,"lastFetchedAt":null,"bannerUrl":null,"bannerBlurhash":null,"isLocked":false,"isSilenced":false,"isSuspended":false,"description":null,"location":null,"birthday":null,"lang":null,"fields":[],"verifiedLinks":[],"followersCount":0,"followingCount":0,"notesCount":0,"pinnedNoteIds":[],"pinnedNotes":[],"pinnedPageId":null,"pinnedPage":null,"publicReactions":true,"followersVisibility":"public","followingVisibility":"public","roles":[],"memo":null,"moderationNote":"","twoFactorEnabled":false,"usePasswordLessLogin":false,"securityKeys":false,"avatarId":"a5p82ifdj9ud0001","bannerId":null,"followedMessage":null,"isModerator":true,"isAdmin":true,"injectFeaturedNote":true,"receiveAnnouncementEmail":true,"alwaysMarkNsfw":false,"autoSensitive":false,"carefulBot":false,"autoAcceptFollowed":true,"noCrawle":false,"preventAiLearning":true,"isExplorable":true,"isDeleted":false,"twoFactorBackupCodesStock":"none","hideOnlineStatus":false,"hasUnreadSpecifiedNotes":false,"hasUnreadMentions":false,"hasUnreadAnnouncement":false,"unreadAnnouncements":[],"hasUnreadAntenna":false,"hasUnreadChannel":false,"hasUnreadNotification":false,"hasPendingReceivedFollowRequest":false,"unreadNotificationsCount":0,"mutedWords":[],"hardMutedWords":[],"mutedInstances":[],"mutingNotificationTypes":[],"notificationRecieveConfig":{},"emailNotificationTypes":["follow","receiveFollowRequest"],"achievements":[{"name":"client30min","unlockedAt":1742724975848},{"name":"client60min","unlockedAt":1742726775794},{"name":"profileFilled","unlockedAt":1742734506591}],"loggedInDays":1,"policies":{"gtlAvailable":true,"ltlAvailable":true,"canPublicNote":true,"mentionLimit":20,"canInvite":false,"inviteLimit":0,"inviteLimitCycle":10080,"inviteExpirationTime":0,"canManageCustomEmojis":false,"canManageAvatarDecorations":false,"canSearchNotes":false,"canUseTranslator":true,"canHideAds":false,"driveCapacityMb":100,"alwaysMarkNsfw":false,"canUpdateBioMedia":true,"pinLimit":5,"antennaLimit":5,"wordMuteLimit":200,"webhookLimit":3,"clipLimit":10,"noteEachClipsLimit":200,"userListLimit":10,"userEachUserListsLimit":50,"rateLimitFactor":1,"avatarDecorationLimit":1,"canImportAntennas":true,"canImportBlocking":true,"canImportFollowing":true,"canImportMuting":true,"canImportUserLists":true},"email":null,"emailVerified":false,"securityKeysList":[],"token":"g7i1K5P4Ej9RWwGa"},
						],
						startTime: "2025-03-23T04:21:01.082Z",
						endTime: null,
					}
				]
			});
		}, 500);
	}).then(data => {
		// レスポンスを保存
		openSpaces.value = data.spaces;
	})
}
loadSpaces();

</script>

<style lang="scss" module>
.root {
	padding: 32px;
	text-align: center;
}

.img {
	width: 100%;
	height: auto;
}

.description {
	text-align: left;
}

.flex {
	display: flex;
	justify-content: space-around;
}

.flex p {
	text-align: left;
	margin: auto;
}
</style>
