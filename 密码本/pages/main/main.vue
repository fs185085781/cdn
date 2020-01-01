<template>
    <view class="uni-container">
		<view>
			<text>尊敬的{{username}}，{{welcomeName}}！以下是您保存的账号信息，如想更换账号请点击
			<a style="color:blue;text-decoration:underline;" @tap="toLogout()">退出</a>
			如想添加账号请点击
			<a style="color:blue;text-decoration:underline;" @tap="addPwd()">添加</a>
			。</text>
		</view>
		<view v-if="!list || !list.length || list.length==0">
			<view class="uni-panel">
			    <view class="uni-panel-h">
			        <text class="uni-panel-text">暂无密码,请添加</text>
			    </view>
			</view>
		</view>
		<view v-else>
			<view v-if="list && list.length && list.length>0">
				<view class="uni-panel" v-for="item in list" :key="item.name">
				    <view class="uni-panel-h" :class="{'uni-panel-h-on':item.open}" @tap="triggerCollapse(item)">
				        <text class="uni-panel-text">{{item.name}}</text>
				        <text class="uni-panel-icon uni-icon" :class="{'uni-panel-icon-on':item.open}">&#xe581;</text>
				    </view>
				    <view class="uni-panel-c" v-if="item.open">
				        <view class="uni-navigate-item" v-for="item2 in item.children" :key="item2.id" @tap="editPwd(item2)">
				            <text class="uni-navigate-text">{{item2.account}}</text>
							<button type="primary" size="mini" style="margin-left:5rpx;" @tap.stop="copyText(item2,1)">账号</button>
							<button type="primary" size="mini" style="margin-left:5rpx;" @tap.stop="copyText(item2,2)">密码</button>
							<button type="primary" size="mini" style="margin-left:5rpx;" @tap.stop="showText(item2)">显示备注</button>
				            <text class="uni-navigate-icon uni-icon">&#xe470;</text>
				        </view>
				    </view>
				</view>
			</view>
		</view>
    </view>
</template>

<script>
	import modelPwd from '../../model/pwd.js';
    export default {
		data() {
		    return {
				username:(uni.utils.getUserData()).username,
				welcomeName:'',
		        list: [],
				}
		},
        onLoad() {
			if(!uni.utils.isLogin()){
				uni.reLaunch({
				    url: '../login/login'
				});
			}
			this.initData();
        },
		methods: {
			initData(){
				var hours = new Date().getHours();
				var welcomeName = "晚上好";
				if(hours>=18){
					welcomeName = "傍晚好";
				}else if(hours>=13){
					welcomeName = "下午好";
				}else if(hours>=11){
					welcomeName = "中午好";
				}else if(hours>=4){
					welcomeName = "早上好";
				}
				var that = this;
				that.welcomeName = welcomeName;
				uni.model.pwd.list(function(list){
					that.list = list;
				});
			},
			toLogout(){
				uni.utils.logout();
				uni.reLaunch({
				    url: '../login/login'
				});
			},
		    triggerCollapse(item) {
				item.open = !item.open;
		    },
			editPwd(item){
				uni.setStorageSync("model.edit.pwd",item);
				uni.navigateTo({
				    url: './edit'
				});
			},
			copyText(item,type){
				var val = "";
				if(type == 1){
					val = item.account;
				}else if(type == 2){
					val = item.pwd;
				}else{
					return;
				}
				uni.setClipboardData({
				    data: val,
				    success: function () {
				        uni.utils.infoMsg("复制成功");
				    },
					fail:function(){
						uni.utils.infoMsg("复制失败");
					}
				});
			},
			addPwd(){
				uni.removeStorageSync("model.edit.pwd");
				uni.navigateTo({
				    url: './edit'
				});
			},
			showText(item){
				var remark = "暂无备注信息";
				if(item.remark){
					remark = item.remark;
				}
				uni.utils.infoMsg(remark);
			}
		}
    }
</script>
