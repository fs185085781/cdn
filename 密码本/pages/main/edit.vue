<template>
    <view class="content">
        <view class="input-group">
			<view class="input-row border">
			    <text class="title">名称：</text>
			    <m-input type="text" focus clearable v-model="name" placeholder="请输入名称"></m-input>
			</view>
            <view class="input-row border">
                <text class="title">账号：</text>
                <m-input type="text" focus clearable v-model="account" placeholder="请输入账号"></m-input>
            </view>
            <view class="input-row border">
                <text class="title">密码：</text>
                <m-input type="text" focus clearable v-model="pwd" placeholder="请输入密码"></m-input>
            </view>
			<view class="input-row border">
			    <text class="title">备注：</text>
			    <m-input type="text" focus clearable v-model="remark" placeholder="请输入备注"></m-input>
			</view>
        </view>
        <view class="btn-row">
            <button type="primary" class="primary" @tap="save">保存</button>
        </view>
    </view>
</template>

<script>
	import modelPwd from '../../model/pwd.js';
    import mInput from '../../components/m-input.vue';

    export default {
        components: {
            mInput
        },
        data() {
            return {
				id:'',
				name:'',
                account: '',
                pwd: '',
				remark:''
            }
        },
		onLoad() {
			var item = uni.getStorageSync("model.edit.pwd");
			if(!item){
				return;
			}
			var fields = ["id","name","account","pwd","remark"];
			for(var i=0;i<fields.length;i++){
				var field = fields[i];
				var temp = item[field];
				if(!temp){
					continue;
				}
				this[field] = temp;
			}
		},
        methods: {
            save() {
               uni.model.pwd.save(this,function(){
				   uni.reLaunch({
				       url: './main'
				   });
			   });
            }
        }
    }
</script>

<style>

</style>
