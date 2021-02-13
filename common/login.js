export default function(event) {
	return uni.preLogin({
		provider: 'univerify',
		success(res) {
			//预登录成功
			// 显示一键登录选项
			console.log(res);
			console.log('999', 2222);
			uni.login({
				provider: 'univerify',
				univerifyStyle: {
					// 自定义登录框样式
					//参考`univerifyStyle 数据结构`
					backgroundColor: '#ffffff', // 授权页面背景颜色，默认值：#ffffff
					icon: {
						path: '/static/uni.png' // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
					},
					phoneNum: {
						color: '#000000', // 手机号文字颜色 默认值：#000000
						fontSize: '18' // 手机号字体大小 默认值：18
					},
					slogan: {
						color: '#8a8b90', //  slogan 字体颜色 默认值：#8a8b90
						fontSize: '12' // slogan 字体大小 默认值：12
					},
					authButton: {
						normalColor: '#3479f5', // 授权按钮正常状态背景颜色 默认值：#3479f5
						highlightColor: '#2861c5', // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
						disabledColor: '#73aaf5', // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）
						textColor: '#ffffff', // 授权按钮文字颜色 默认值：#ffffff
						title: '本机号码一键登录' // 授权按钮文案 默认值：“本机号码一键登录”
					},
					otherLoginButton: {
						visible: 'true', // 是否显示其他登录按钮，默认值：true
						normalColor: '#f8f8f8', // 其他登录按钮正常状态背景颜色 默认值：#f8f8f8
						highlightColor: '#dedede', // 其他登录按钮按下状态背景颜色 默认值：#dedede
						textColor: '#000000', // 其他登录按钮文字颜色 默认值：#000000
						title: '其他手机号码登录', // 其他登录方式按钮文字 默认值：“其他登录方式”
						borderWidth: '1px', // 边框宽度 默认值：1px（仅ios支持）
						borderColor: '#c5c5c5' //边框颜色 默认值： #c5c5c5（仅ios支持）
					},
					privacyTerms: {
						defaultCheckBoxState: 'true', // 条款勾选框初始状态 默认值： true
						textColor: '#8a8b90', // 文字颜色 默认值：#8a8b90
						termsColor: '#1d4788', //  协议文字颜色 默认值： #1d4788
						prefix: '我已阅读并同意', // 条款前的文案 默认值：“我已阅读并同意”
						suffix: '并使用本机号码登录', // 条款后的文案 默认值：“并使用本机号码登录”
						fontSize: '12', // 字体大小 默认值：12,
						privacyItems: [
							// 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效
							{
								url: 'https://', // 点击跳转的协议详情页面
								title: '用户服务协议' // 协议名称
							}
						]
					}
				},
				success(res) {
					// 登录成功
					this.openid = res.authResult.openid;
					this.access_token = res.authResult.access_token;
					console.log('一键登录成功', res); // {openid:'deviceIDlength+deviceID+gyuid',access_token:'接口返回的 token'}
					console.log(this.openid);
					console.log('access_token', this.access_token);
					// 客户端(调用云函数)  调用云函数来实现整个业务逻辑
					// 在得到access_token后，通过callfunction调用云函数
					uniCloud.callFunction({
							name: 'login', // 你的云函数名称
							data: {
								access_token: this.access_token, // 客户端一键登录接口返回的access_token
								openid: this.openid // 客户端一键登录接口返回的openid
							}
						})
						.then(res => {
							console.log('获取成功');
							console.log(res);
							// 获取用户的手机号
							this.phoneNumber = res.result.data.phoneNumber;
							console.log(this.phoneNumber);
							// res.result = {
							//   code: '',
							//   message: ''
							// }
							// 登录成功，可以关闭一键登陆授权界面了
							uni.closeAuthView();
						})
						.catch(err => {
							// 处理错误
							console.log('获取失败');
							console.log(err);
						});
				},
				fail(res) {
					// 登录失败
					// console.log('失败',2222);
					console.log(res.errCode);
					console.log(res.errMsg);
				}
			});
		},
		fail(res) {
			// 预登录失败
			// 不显示一键登录选项（或置灰）
			// 根据错误信息判断失败原因，如有需要可将错误提交给统计服务器
			console.log('失败', 2222);
			console.log(res.errCode);
			console.log(res.errMsg);
		}
	});

}