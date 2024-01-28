var vueData = {
	userDetail :{},
	attendList : [],
	finishedList : []
}

var vm;

var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;
		},
		methods: {
			userOneAnFSeminaList: () => {
				const urlParams = new URL(location.href).searchParams;
				let param = {
					userSeq : urlParams.get('userSeq')
				}
				$.sendAjax({
					url: "/userManage/selectUserOneAnFSeminaList.api",
					data : param,
					contentType: "application/json",
					success : (res) => {
						vm.userDetail = res.data;
						if(res.data.attendList){
							vm.attendList = res.data.attendList;
							for(var i=0; i<res.data.attendList.length; i++){
								vm.attendList[i].seminaDe = util.date.addDateDash(res.data.attendList[i].seminaDe);
								vm.attendList[i].seminaBeginTime = util.cnTime(res.data.attendList[i].seminaBeginTime);
								vm.attendList[i].seminaEndTime = util.cnTime(res.data.attendList[i].seminaEndTime);
							}
						}
						if(res.data.finishedList){
							vm.finishedList = res.data.finishedList;
							for(var i=0; i<res.data.finishedList.length; i++){
								vm.finishedList[i].seminaDe = util.date.addDateDash(res.data.finishedList[i].seminaDe);
								vm.finishedList[i].seminaBeginTime = util.cnTime(res.data.finishedList[i].seminaBeginTime);
								vm.finishedList[i].seminaEndTime = util.cnTime(res.data.finishedList[i].seminaEndTime);
							}
						}
					}			
				})
			},
			fnSeminaDetail: (seminaSeq) => {
				detailModal(seminaSeq)
			}
		}
	})
	vm = app.mount('#content');
}

let event = {
	
	
}


$(document).ready( () => {
	vueInit();
	vm.userOneAnFSeminaList();
})

